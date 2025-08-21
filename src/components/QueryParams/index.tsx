import type { FormProps } from "@arco-design/web-react";
import { Button, Form, Space } from "@arco-design/web-react";
import { IconRefresh, IconSearch } from "@arco-design/web-react/icon";
import React, { useState } from "react";

import { FormWrapperRender } from "../../libs";

import { FormCompMatchType } from "../../../typings";

const { useForm } = Form;

export function QueryParams(
  props: {
    labelCol?: number;
    wrapperCol?: number;
    actionLayout?: "horizontal" | "vertical";
    schemas: {
      type: "object" | "array";
      properties: {
        [key: string]: FormCompMatchType;
      };
    };
    onSearch?: (values: Record<string, any>) => void;
  } & Partial<FormProps>
) {
  const [form] = props.form ? [props.form] : useForm();
  const [properties, setProperties] = useState({});

  const handleSubmit = () => form.submit();

  const handleReset = () => {
    form.resetFields();
    props?.onSearch && props.onSearch({});
  };

  const onValuesChange = (value: Partial<any>, values: Partial<any>) => {
    const initProperties = props.schemas.properties;
    const nextpProperties = [...Object.entries(initProperties)].reduce(
      (pre, [key, filed]) => ({
        ...pre,
        [key]: {
          ...filed,
          ...(typeof filed.reload === "function" ? filed.reload(value, values, filed, form) : {}),
        },
      }),
      {}
    );
    setProperties(nextpProperties);
  };

  React.useEffect(() => {
    setProperties(props.schemas.properties);
    return () => {};
  }, [JSON.stringify(props?.schemas)]);
  React.useEffect(() => {
    form.setFieldsValue(props.initialValues);
    return () => {};
  }, [JSON.stringify(props.initialValues)]);

  return (
    <div style={{ display: "flex", borderBottom: "1px solid var(--color-border-1)", marginBottom: "20px" }}>
      <div style={{ flexGrow: 1, paddingRight: "20px" }}>
        <FormWrapperRender
          labelAlign="left"
          form={form}
          schemas={{
            ...props.schemas,
            properties: properties,
          }}
          onValuesChange={(value: any, values: any) => {
            onValuesChange(value, values);
            props?.onValuesChange && props?.onValuesChange(value, values);
          }}
          onSubmit={(value: any) => {
            props.onSearch && props.onSearch(value);
          }}
          labelCol={{ span: props.labelCol || 5 }}
          wrapperCol={{ span: props.wrapperCol || 19 }}
        />
      </div>
      {props.actionLayout === "vertical" ? (
        <div className="flex items-start">
          <Space size={12}>
            <Button
              type="primary"
              icon={<IconSearch />}
              onClick={handleSubmit}
            >
              搜索
            </Button>
            <Button
              icon={<IconRefresh />}
              onClick={handleReset}
            >
              重置
            </Button>
          </Space>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginBottom: "20px",
            paddingLeft: "20px",
            borderLeft: "1px solid var(--color-border-1)",
          }}
        >
          <Button
            type="primary"
            icon={<IconSearch />}
            onClick={handleSubmit}
          >
            搜索
          </Button>
          <Button
            icon={<IconRefresh />}
            onClick={handleReset}
          >
            重置
          </Button>
        </div>
      )}
    </div>
  );
}

export default QueryParams;
