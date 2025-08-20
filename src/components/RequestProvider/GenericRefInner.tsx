import { Spin } from "@arco-design/web-react";
import { useRequest } from "ahooks";
import type { Result } from "ahooks/lib/useRequest/src/types";
import React, {
  forwardRef,
  createContext,
  ReactNode,
  Ref,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from "react";
import type { PropsWithChildren } from "react";

export type RequestContextType<R = any> = Partial<Result<R, []> & { key: string }>;

export const RequestContext = createContext<RequestContextType>({
  loading: true,
});

export type RequestProviderType<R = {}, P = {}> = {
  params?: Partial<P>;
  children?: ReactNode;
  manual?: boolean; // 是否自动请求
  spinning?: boolean; // 控制是否包裹 Spin
  service: (params: Partial<P>) => Promise<R>; // 请求函数
  ref?: Ref<RequestProviderRefType<P>>;
};
export type RequestProviderRefType<P = {}> = {
  resp: unknown; // 上一次请求数据
  params: Partial<P>; // 请求参数
  setParams: (params: Partial<P>, key?: string) => void; // 更新请求参数
  refresh: (key?: string) => void; // 强制刷新
};

export const GenericRefInner = <R extends {}, P extends {}>(
  { children, service, params = {}, spinning, manual, ...props }: RequestProviderType<R, P>,
  ref?: Ref<RequestProviderRefType<P>>
) => {
  const [innerParams, setInnerParams] = useState<Partial<P>>(params);
  const KEY = useRef("");

  const Request = useRequest<R, []>(() => service(innerParams), {
    manual,
    refreshDeps: [JSON.stringify(innerParams), manual],
  });

  const setParams = useCallback(
    (p: Partial<P>, key?: string) => {
      KEY.current = key ?? "";
      setInnerParams((prev) => ({ ...prev, ...p }));
      if (manual) Request.run();
    },
    [manual, Request]
  );

  const refresh = useCallback(
    (key?: string) => {
      KEY.current = key ?? "";
      setInnerParams((prev) => ({ ...prev, timestamp: Date.now() } as Partial<P>));
      if (manual) Request.run();
    },
    [manual, Request]
  );

  useImperativeHandle(
    ref,
    () => ({
      resp: Request.data,
      params: innerParams,
      setParams,
      refresh,
    }),
    [Request.data, innerParams, setParams, refresh]
  );

  //透传子组件的props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, props);
    }
    return child;
  });

  return (
    <RequestContext.Provider value={{ ...Request, key: KEY.current }}>
      {spinning ? (
        <Spin
          style={{ width: "100%" }}
          loading={Request.loading}
        >
          {childrenWithProps}
        </Spin>
      ) : (
        childrenWithProps
      )}
    </RequestContext.Provider>
  );
};

export const RequestProvider = forwardRef(GenericRefInner) as <R = {}, P = {}>(
  props: PropsWithChildren<RequestProviderType<R, P>>,
  ref?: Ref<RequestProviderRefType<P>>
) => ReturnType<typeof GenericRefInner>;
