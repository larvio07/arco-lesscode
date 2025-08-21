import { Button, Form, FormProps, Grid } from "@arco-design/web-react";
import { IconArrowFall, IconArrowRise, IconDelete, IconPlus } from "@arco-design/web-react/icon";
import React, { FC } from "react";
import { InjectProps } from "../components/RequestProvider";
import { componentMaps, providerMaps } from "../constants/components";
import { FormCompMatchType, FormWrapType } from "../../typings";

//表单组件渲染规则解释器
export const FromCompRender: FC<FormCompMatchType & { field: string; formProps?: Partial<FormProps> }> = (props) => {
  const { provider, compName, compProps, field, label, required, hidden, formProps } = props;

  //匹配到容器组件
  const ProviderComponent = provider ? (providerMaps[provider.compName] as React.ElementType) : null;

  // 匹配到表单组件
  const Component = componentMaps[compName] as React.ElementType | typeof Form.List;

  //解析列表组件
  if (compName === "List") {
    const {
      schemas: { properties },
      hideMove,
      style,
    } = compProps as FormWrapType;

    return (
      <Grid.Col
        span={props.span || 24}
        className="form-list"
      >
        <Form.Item
          hidden={hidden}
          label={label}
          rules={[{ required }]}
        >
          <Form.List field={field}>
            {(fields, { add, remove, move }) => {
              return (
                <div
                  style={{
                    width: "100%",
                    ...style,
                  }}
                >
                  {fields.map((item, index) => (
                    <div
                      style={{ display: "flex" }}
                      key={item.key}
                    >
                      <Grid.Row
                        className="flex-grow"
                        gutter={16}
                      >
                        {Object.entries(properties)?.map(([key, filed]) => (
                          <FromCompRender
                            {...filed}
                            key={key}
                            formProps={formProps}
                            field={Object.keys(properties).length === 1 ? `${item.field}` : `${item.field}.${key}`}
                          />
                        ))}
                      </Grid.Row>

                      <div style={{ display: "flex", flexShrink: 1 }}>
                        {!hideMove && (
                          <Button
                            style={{ marginLeft: "16px" }}
                            disabled={index === 0}
                            icon={<IconArrowRise />}
                            onClick={() => move(index, index - 1)}
                          />
                        )}
                        {!hideMove && (
                          <Button
                            style={{ marginLeft: "16px" }}
                            disabled={index + 1 === fields.length}
                            icon={<IconArrowFall />}
                            onClick={() => move(index, index + 1)}
                          />
                        )}
                        <Button
                          style={{ marginLeft: "16px" }}
                          icon={<IconDelete />}
                          status="danger"
                          onClick={() => remove(index)}
                        />
                        <Button
                          style={{ marginLeft: "16px" }}
                          icon={<IconPlus />}
                          onClick={() => add(null, index + 1)}
                        />
                      </div>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <Button
                      className="mb-[16px]"
                      onClick={() => {
                        add();
                      }}
                    >
                      添加
                    </Button>
                  )}
                </div>
              );
            }}
          </Form.List>
        </Form.Item>
      </Grid.Col>
    );
  }

  if (compName === "Void") {
    return <></>;
  }
  //解析携带数据加载容器的组件
  if (Component && !!ProviderComponent) {
    return (
      <Grid.Col span={props.span || 24}>
        <Form.Item
          hidden={hidden}
          label={label}
          field={field}
          rules={[{ required }]}
        >
          <ProviderComponent {...provider?.compProps}>
            <InjectProps {...provider?.injectProps}>
              <Component
                key="void"
                filed
                {...compProps}
              />
            </InjectProps>
          </ProviderComponent>
        </Form.Item>
      </Grid.Col>
    );
  }
  //解析组件
  if (Component) {
    return (
      <Grid.Col span={props.span || 24}>
        <Form.Item
          hidden={hidden}
          label={label}
          field={field}
          rules={[{ required }]}
        >
          <Component
            key="void"
            placeholder={field}
            field={field}
            {...compProps}
          />
        </Form.Item>
      </Grid.Col>
    );
  }
  return <div>[COM:NAME]:{compName?.toString()}</div>;
};

//表单组件布局排版解释器
export const FormWrapperRender: FC<FormWrapType> = (props) => {
  const {
    schemas: { properties },
    ...defaultProps
  } = props;

  return (
    <Form {...defaultProps}>
      <Grid.Row gutter={[16, 0]}>
        {Object.entries(properties)?.map(([key, field]) => (
          <FromCompRender
            {...field}
            key={key}
            field={key}
            formProps={defaultProps}
            label={field.label ? field.label : props.comments ? props.comments[key] : key}
          />
        ))}
      </Grid.Row>
      {defaultProps.children}
    </Form>
  );
};
