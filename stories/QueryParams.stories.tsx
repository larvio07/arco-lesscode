import "@arco-design/web-react/dist/css/arco.css";
import qs from "qs";
import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import QueryParams from "../src/components/QueryParams";
import { RequestProvider, InjectProps } from "../src/components/RequestProvider";
import type { RequestProviderRefType } from "../src/components/RequestProvider";

import { Typography, Grid, Space, Card, Alert, Descriptions, Modal, Table } from "@arco-design/web-react";

const meta: Meta<typeof QueryParams> = {
  title: "QueryParams",

  component: QueryParams,
  parameters: {},
  tags: ["autodocs"],

  args: {},
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof QueryParams>;

const service = (params) =>
  fetch(`https://ghibliapi.vercel.app/films?${qs.stringify(params)}`).then((res) => res.json());

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: "依据 schemas 规则结构构造参数查询器",
      },
    },
  },
  render: () => {
    return (
      <div>
        <Typography.Title
          heading={5}
          style={{ marginTop: 0 }}
        >
          查询参数构造器
        </Typography.Title>

        <div style={{ paddingTop: "16px", width: "100%" }}>
          <QueryParams
            title="查询参数构造器"
            layout="vertical"
            schemas={{
              type: "array",
              properties: {
                keyword: {
                  span: 12,
                  label: "关键字",
                  compName: "Input",
                },
                type: {
                  span: 12,
                  label: "类型",
                  compName: "Select",
                  compProps: {
                    options: [],
                  },
                },
                sortField: {
                  span: 12,
                  label: "排序字段",
                  compName: "Select",
                  compProps: {
                    options: ["id", "name", "type", "createdAt"],
                  },
                },
                direction: {
                  span: 12,
                  label: "排序方向",
                  compName: "Select",
                  compProps: {
                    options: [
                      {
                        label: "升序",
                        value: "ASC",
                      },
                      {
                        label: "降序",
                        value: "DESC",
                      },
                    ],
                  },
                },
              },
            }}
            onSearch={(values) => {
              console.log({ values });
              Modal.info({
                title: "构造参数显示",
                style: { width: "800px" },
                content: (
                  <Descriptions
                    border
                    column={1}
                    data={[...Object.entries(values).map(([label, value]) => ({ label, value: `${value}` }))]}
                  />
                ),
              });
            }}
          />
        </div>
      </div>
    );
  },
};

export const QueryParamsTable: Story = {
  parameters: {
    docs: {
      description: {
        story: "",
      },
    },
  },
  render: () => {
    const RequestREF = React.useRef<RequestProviderRefType>(null);

    return (
      <div>
        <Typography.Title
          heading={5}
          style={{ marginTop: 0 }}
        >
          参数构造器查询案例
        </Typography.Title>

        <div style={{ paddingTop: "16px", width: "100%" }}>
          <QueryParams
            labelCol={2}
            wrapperCol={22}
            actionLayout="vertical"
            title="查询参数构造器"
            layout="vertical"
            schemas={{
              type: "array",
              properties: {
                q: {
                  label: "关键词",
                  compName: "Input",
                  compProps: {},
                },
              },
            }}
            onSearch={(params) => {
              RequestREF.current?.setParams(params);
            }}
          />
          <RequestProvider
            ref={RequestREF}
            service={service}
          >
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <InjectProps
                schema={{
                  data: {
                    dataIndex: [],
                    fallback: [],
                  },
                }}
              >
                {({ data }: any) =>
                  data?.map(({ id, image, original_title, director, description, release_date }) => (
                    <Card
                      key={id}
                      style={{ width: "200px", marginBottom: "16px", marginRight: "16px" }}
                      cover={
                        <div style={{ overflow: "hidden" }}>
                          <img
                            style={{ width: "100%", transform: "translateY(-20px)" }}
                            alt={original_title}
                            src={image}
                          />
                        </div>
                      }
                    >
                      <Card.Meta
                        title={`${original_title} ${release_date}`}
                        description={
                          <div
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              textAlign: "justify",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {description}
                          </div>
                        }
                        avatar={
                          <Space>
                            <Typography.Text>{director}</Typography.Text>
                          </Space>
                        }
                      />
                    </Card>
                  ))
                }
              </InjectProps>
            </div>
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
