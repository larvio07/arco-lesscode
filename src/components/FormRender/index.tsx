import type { FormInstance } from "@arco-design/web-react";
import { Button, Form, Space } from "@arco-design/web-react";
import { useState, useCallback, useEffect } from "react";
import { FormWrapperRender } from "../../libs/index";
import type { FormCompMatchType, FormSchemas } from "../../../typings";
import type { FormProps } from "@arco-design/web-react";

const { useForm } = Form;

interface FormRenderProps extends Partial<FormProps> {
  form?: FormInstance;
  maxWidth?: string;
  submitting?: boolean;
  hiddenReset?: boolean;
  submitText?: string;
  schemas: FormSchemas;
  comments?: Record<string, string>;
  initialValues?: Record<string, string>;
  onValuesChange?: (value: unknown, values: unknown) => void;
  onReset?: () => void;
  onSubmit?: (values: Record<string, unknown>) => void;
}

export function FormRender(props: FormRenderProps) {
  const [form] = props.form ? [props.form] : useForm();
  const [properties, setProperties] = useState<Record<string, FormCompMatchType>>({});

  const { maxWidth, submitText, labelCol, wrapperCol, hiddenReset, ...otherProps } = props;

  // 提交处理
  const handleSubmit = () => form.submit();
  const handleReset = () => {
    props?.onReset?.();
    form.resetFields();
  };

  // 更新 properties
  const onValuesChange = useCallback(
    (changedValues: Record<string, unknown>, allValues: Record<string, unknown>) => {
      const nextProperties = Object.entries(props.schemas.properties).reduce(
        (acc, [key, field]) => ({
          ...acc,
          [key]: {
            ...field,
            ...(typeof field.reload === "function" ? field.reload(changedValues, allValues, field, form) : {}),
          },
        }),
        {} as Record<string, FormCompMatchType>
      );
      setProperties(nextProperties);
    },
    [props.schemas.properties, form]
  );

  // 初始化 properties
  useEffect(() => {
    setProperties(props.schemas.properties);
  }, [props.schemas.properties]);

  // 初始化表单值
  useEffect(() => {
    form.setFieldsValue(props.initialValues);
  }, [props.initialValues, form]);

  return (
    <div style={{ maxWidth: maxWidth || "100%", width: "100%" }}>
      <FormWrapperRender
        form={form}
        {...otherProps}
        schemas={{
          ...props.schemas,
          properties,
        }}
        onValuesChange={(value: any, values: any) => {
          onValuesChange(value, values);
          props?.onValuesChange?.(value, values);
        }}
        comments={props.comments}
      />

      <div className="flex justify-start">
        <Form.Item>
          <Space className="flex justify-start">
            <Button
              type="primary"
              loading={props.submitting}
              onClick={handleSubmit}
            >
              {submitText || "提交"}
            </Button>
            {!hiddenReset && <Button onClick={handleReset}>重置</Button>}
          </Space>
        </Form.Item>
      </div>
    </div>
  );
}

export default FormRender;
