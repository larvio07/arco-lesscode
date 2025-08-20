// @ts-nocheck
import { Message } from "@arco-design/web-react";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

// request 方法 opts 参数的接口
interface IRequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  requestInterceptors?: IRequestInterceptorTuple[];
  responseInterceptors?: IResponseInterceptorTuple[];
  [key: string]: any;
}

interface IRequestOptionsWithResponse extends IRequestOptions {
  getResponse: true;
}

interface IRequestOptionsWithoutResponse extends IRequestOptions {
  getResponse: false;
}

interface IRequest {
  <T = any>(url: string, opts: IRequestOptionsWithResponse): Promise<
    AxiosResponse<T>
  >;
  <T = any>(url: string, opts: IRequestOptionsWithoutResponse): Promise<T>;
  <T = any>(url: string, opts: IRequestOptions): Promise<T>; // getResponse 默认是 false， 因此不提供该参数时，只返回 data
  <T = any>(url: string): Promise<T>; // 不提供 opts 时，默认使用 'GET' method，并且默认返回 data
}

type RequestError = AxiosError | Error;

interface IErrorHandler {
  (error: RequestError, opts: IRequestOptions): void;
}
type WithPromise<T> = T | Promise<T>;
type IRequestInterceptorAxios = (
  config: IRequestOptions
) => WithPromise<IRequestOptions>;
type IRequestInterceptorUmiRequest = (
  url: string,
  config: IRequestOptions
) => WithPromise<{ url: string; options: IRequestOptions }>;
type IRequestInterceptor =
  | IRequestInterceptorAxios
  | IRequestInterceptorUmiRequest;
type IErrorInterceptor = (error: Error) => Promise<Error>;
type IResponseInterceptor = <T = any>(
  response: AxiosResponse<T>
) => WithPromise<AxiosResponse<T>>;
type IRequestInterceptorTuple =
  | [IRequestInterceptor, IErrorInterceptor]
  | [IRequestInterceptor]
  | IRequestInterceptor;
type IResponseInterceptorTuple =
  | [IResponseInterceptor, IErrorInterceptor]
  | [IResponseInterceptor]
  | IResponseInterceptor;

export interface RequestConfig<T = any> extends AxiosRequestConfig {
  errorConfig?: {
    errorHandler?: IErrorHandler;
    errorThrower?: (res: T) => void;
  };
  requestInterceptors?: IRequestInterceptorTuple[];
  responseInterceptors?: IResponseInterceptorTuple[];
}

let requestInstance: AxiosInstance;
let config: RequestConfig = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = "BizError";
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      throw error;
    },
  },
  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const url = config?.url?.concat("");

      return {
        ...config,
        url,
      };
    },
  ],
  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const {
        config: { method, url, getResponse },

        data: { code, message },
        status,
      } = response as unknown as ResponseStructure;

      code !== 200 &&
        method === "get" &&
        !getResponse &&
        Message.warning(message);
      return response;
    },
  ],
};

const getRequestInstance = (): AxiosInstance => {
  if (requestInstance) return requestInstance;

  requestInstance = axios.create(config);

  config?.requestInterceptors?.forEach((interceptor) => {
    if (interceptor instanceof Array) {
      requestInstance.interceptors.request.use(async (config) => {
        const { url } = config;
        if (interceptor[0].length === 2) {
          const { url: newUrl, options } = await interceptor[0](url, config);
          return { ...options, url: newUrl };
        }
        return interceptor[0](config);
      }, interceptor[1]);
    } else {
      requestInstance.interceptors.request.use(async (config) => {
        const { url } = config;
        if (interceptor.length === 2) {
          const { url: newUrl, options } = await interceptor(url, config);
          return { ...options, url: newUrl };
        }
        return interceptor(config);
      });
    }
  });

  config?.responseInterceptors?.forEach((interceptor) => {
    interceptor instanceof Array
      ? requestInstance.interceptors.response.use(
          interceptor[0],
          interceptor[1]
        )
      : requestInstance.interceptors.response.use(interceptor);
  });

  // 当响应的数据 success 是 false 的时候，抛出 error 以供 errorHandler 处理。
  requestInstance.interceptors.response.use((response) => {
    const { data } = response;
    if (data?.success === false && config?.errorConfig?.errorThrower) {
      config.errorConfig.errorThrower(data);
    }
    return response;
  });
  return requestInstance;
};

const request: IRequest = (url: string, opts: any = { method: "GET" }) => {
  const requestInstance = getRequestInstance();

  const {
    getResponse = false,
    requestInterceptors,
    responseInterceptors,
  } = opts;
  const requestInterceptorsToEject = requestInterceptors?.map((interceptor) => {
    if (interceptor instanceof Array) {
      return requestInstance.interceptors.request.use(async (config) => {
        const { url } = config;
        if (interceptor[0].length === 2) {
          const { url: newUrl, options } = await interceptor[0](url, config);
          return { ...options, url: newUrl };
        }
        return interceptor[0](config);
      }, interceptor[1]);
    } else {
      return requestInstance.interceptors.request.use(async (config) => {
        const { url } = config;
        if (interceptor.length === 2) {
          const { url: newUrl, options } = await interceptor(url, config);
          return { ...options, url: newUrl };
        }
        return interceptor(config);
      });
    }
  });
  const responseInterceptorsToEject = responseInterceptors?.map(
    (interceptor) => {
      return interceptor instanceof Array
        ? requestInstance.interceptors.response.use(
            interceptor[0],
            interceptor[1]
          )
        : requestInstance.interceptors.response.use(interceptor);
    }
  );
  return new Promise(async (resolve, reject) => {
    // await new Promise((resolve) => setTimeout(() => resolve(1), 100));
    opts.startTime = Date.now();
    requestInstance
      .request({ ...opts, url })
      .then((res) => {
        requestInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.request.eject(interceptor);
        });
        responseInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.response.eject(interceptor);
        });
        res.useTime = Date.now() - opts.startTime;
        resolve(getResponse ? res : res.data);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          location.href = "/login";
          return;
        }
        Message.error(error.message);
        requestInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.request.eject(interceptor);
        });
        responseInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.response.eject(interceptor);
        });
        try {
          const handler = config?.errorConfig?.errorHandler;
          if (handler) handler(error, opts, config);
        } catch (e) {
          reject(e);
        }
        reject(error);
      });
  });
};

export { request };
