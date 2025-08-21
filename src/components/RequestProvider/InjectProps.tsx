import React, { useContext, useMemo } from "react";
import { RequestContext } from "./GenericRefInner";

// 工具函数：按 dataIndex 获取值
function getValueByPath(obj: any, path: string[]) {
  return path.reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}
export type InjectField = {
  dataIndex: string[];
  fallback?: unknown;
  verify?: (resp: unknown) => boolean;
  format?: (resp: unknown) => unknown;
};
export type InjectObjectType = Record<string, InjectField>;

export type InjectPropsType = {
  schema?: InjectObjectType;
  loading?: boolean | number;
  submitMode?: boolean;
  children?:
    | React.ReactElement<{ loading?: boolean | number }>
    | React.ReactElement<{ loading?: boolean | number }>[]
    | ((props: Record<string, unknown>) => React.ReactNode);
};

export const InjectProps = ({ schema, children, submitMode, ...props }: InjectPropsType) => {
  const Request = useContext(RequestContext);

  // 计算注入的 props
  const injectProps = useMemo(() => {
    if (!schema || !Request.data) return {};
    return Object.entries(schema).reduce<Record<string, unknown>>(
      (acc, [key, { dataIndex, fallback = [], format, verify = () => true }]) => {
        const rawValue = getValueByPath(Request.data, dataIndex);
        const value = verify(rawValue) ? rawValue : fallback;
        acc[key] = format ? format(value) : value;
        return acc;
      },
      {}
    );
  }, [schema, Request.data]);

  if (typeof children === "function") {
    return <>{children(injectProps)}</>;
  }

  const childrenWithNewProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    return React.cloneElement(child, {
      ...props,
      ...injectProps,
      loading: submitMode ? props.loading : child.key === "void" || Request.key === child.key ? Request.loading : 0,
    });
  });

  return <>{childrenWithNewProps}</>;
};
