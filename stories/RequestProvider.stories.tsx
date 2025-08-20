import "@arco-design/web-react/dist/css/arco.css";
import qs from "qs";
import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { RequestProvider, RequestProviderRefType, InjectProps } from "../src/components/RequestProvider";
import { FormRender } from "../src/components/FormRender";

import { Alert, Button, Input, Table, Space, Typography } from "@arco-design/web-react";

const meta: Meta<typeof RequestProvider> = {
  title: "RequestProvider",
  component: RequestProvider,
  parameters: {},
  tags: ["autodocs"],

  args: {},
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof RequestProvider>;

const service = (params) =>
  fetch(`https://api.github.com/search/repositories?${qs.stringify(params)}`).then((res) => res.json());

// 基本用法
export const Basic: Story = {
  render: () => {
    const RequestREF = React.useRef<RequestProviderRefType<{ q: string; page: 1; per_page: 20 }>>(null);
    const InputREF = React.useRef<string>("");

    return (
      <div>
        <Typography.Title
          heading={5}
          style={{ marginTop: 0 }}
        >
          表格数据加载
        </Typography.Title>
        <Space>
          <Input
            defaultValue="klipper"
            onChange={(value) => (InputREF.current = value)}
            placeholder="输入搜索关键词"
          />
          <Button
            type="primary"
            onClick={() => RequestREF.current?.setParams({ q: InputREF.current })}
          >
            搜索
          </Button>
        </Space>
        <div style={{ paddingTop: "16px", width: "100%" }}>
          <RequestProvider
            ref={RequestREF}
            params={{ q: "klipper", page: 1, per_page: 20 }}
            service={service}
          >
            <InjectProps
              schema={{
                data: {
                  dataIndex: ["items"],
                  fallback: [],
                },
                pagination: {
                  dataIndex: ["total_count"],
                  format: (total) => {
                    return {
                      total: total,
                      current: RequestREF.current?.params.page,
                      onChange: (page) => {
                        RequestREF.current?.setParams({ page });
                      },
                      pageSize: 20,
                    };
                  },
                },
              }}
            >
              <Table
                border={false}
                key="void"
                rowKey="id"
                columns={[
                  { dataIndex: "full_name", title: "full_name" },
                  { dataIndex: "language", title: "language" },
                  { dataIndex: "size", title: "size" },
                  { dataIndex: "stargazers_count", title: "stargazers_count" },
                  { dataIndex: "forks", title: "forks" },
                  { dataIndex: "open_issues", title: "open_issues" },
                  { dataIndex: "watchers", title: "watchers" },
                ]}
              />
            </InjectProps>
            <InjectProps schema={{ message: { dataIndex: ["message"] } }}>
              {({ message }: any) =>
                message ? (
                  <Alert
                    style={{ marginTop: "16px" }}
                    content={message}
                    type="error"
                  />
                ) : (
                  ""
                )
              }
            </InjectProps>
          </RequestProvider>
        </div>
      </div>
    );
  },
};

export const FormValuesInject: Story = {
  render: () => {
    const RequestREF = React.useRef<RequestProviderRefType<{ q: string; page: 1; per_page: 20 }>>(null);
    const InputREF = React.useRef<string>("");

    return (
      <div>
        <Typography.Title
          heading={5}
          style={{ marginTop: 0 }}
        >
          表单数据加载
        </Typography.Title>
        <Space>
          <Input
            defaultValue="KlipperScreen"
            onChange={(value) => (InputREF.current = value)}
            placeholder="输入搜索关键词"
          />
          <Button
            type="primary"
            onClick={() => RequestREF.current?.setParams({ q: InputREF.current })}
          >
            载入
          </Button>
        </Space>
        <div style={{ paddingTop: "16px", width: "100%" }}>
          <RequestProvider
            ref={RequestREF}
            params={{ q: "KlipperScreen", page: 1, per_page: 20 }}
            service={service}
          >
            <InjectProps schema={{ message: { dataIndex: ["message"] } }}>
              {({ message }: any) =>
                message ? (
                  <Alert
                    style={{ marginBottom: "16px" }}
                    content={message}
                    type="error"
                  />
                ) : (
                  ""
                )
              }
            </InjectProps>
            <InjectProps
              schema={{
                initialValues: {
                  dataIndex: ["items", "0"],
                  fallback: [],
                },
              }}
            >
              <FormRender
                layout="vertical"
                schemas={{
                  type: "object",
                  properties: {
                    full_name: {
                      label: "项目名称",
                      compName: "Input",
                    },

                    html_url: {
                      label: "项目地址",
                      span: 20,
                      compName: "Input",
                    },
                    language: {
                      label: "语言",
                      span: 4,
                      compName: "Input",
                      compProps: {
                        options: [],
                      },
                    },
                    description: {
                      label: "项目描述",
                      compName: "InputTextArea",
                    },
                    topics: {
                      compName: "List",
                      span: 18,
                      label: "主题",
                      compProps: {
                        schemas: {
                          type: "array",
                          properties: {
                            key: {
                              compName: "Input",
                              span: 24,
                              compProps: {},
                            },
                          },
                        },
                      },
                    },
                  },
                }}
                comments={{}}
                onSubmit={(values) => {
                  console.log({ values });
                }}
              />
            </InjectProps>
          </RequestProvider>
        </div>
      </div>
    );
  },
};
