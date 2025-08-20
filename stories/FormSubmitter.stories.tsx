import "@arco-design/web-react/dist/css/arco.css";
import qs from "qs";
import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { FormSubmitter, FormSubmitProviderType } from "../src/components/FormSubmitter";
import { FormRender } from "../src/components/FormRender";
import { Alert, Button, Input, Descriptions, Space, Typography, Modal } from "@arco-design/web-react";

const meta: Meta<typeof FormSubmitter> = {
  title: "FormSubmitter",
  component: FormSubmitter,
  parameters: {},
  tags: ["autodocs"],
  args: {},
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof FormSubmitter>;

const service = (params) =>
  fetch(`https://api.github.com/search/repositories?${qs.stringify(params)}`).then((res) => res.json());

// 基本用法
export const Basic: Story = {
  render: () => {
    return (
      <div>
        <Typography.Title
          heading={5}
          style={{ marginTop: 0 }}
        >
          简单表单数据提交示例（IP地址查询）
        </Typography.Title>
        <Space></Space>
        <div style={{ paddingTop: "16px", width: "100%" }}>
          <FormSubmitter
            request={(data: any) => fetch(`http://ip-api.com/json/${data.ip}`).then((res) => res.json())}
            decideOk={(resp: any) => resp.status === "success"}
            onFinish={(resp: any) => {
              Modal.info({
                title: "查询成功",
                style: { width: "800px" },
                content: (
                  <Descriptions
                    border
                    column={2}
                    data={[...Object.entries(resp).map(([label, value]) => ({ label, value: `${value}` }))]}
                  />
                ),
              });
            }}
          >
            <FormRender
              layout="vertical"
              initialValues={{ ip: "8.8.8.8" }}
              schemas={{
                type: "object",
                properties: {
                  ip: {
                    span: 12,
                    compName: "AutoComplete",
                  },
                },
              }}
              comments={{
                ip: "ip地址",
              }}
              onSubmit={(values) => {
                console.log({ values });
              }}
            />
          </FormSubmitter>
        </div>
      </div>
    );
  },
};

// 基本用法
export const ButtonAction: Story = {
  render: () => {
    return (
      <div>
        <Typography.Title
          heading={5}
          style={{ marginTop: 0 }}
        >
          简单表单数据提交示例（IP地址查询）
        </Typography.Title>
        <Space></Space>
        <div style={{ paddingTop: "16px", width: "100%" }}>
          <Space>
            <FormSubmitter
              buttonMode
              params={{ ip: "8.8.8.8" }}
              request={(data: any) => fetch(`http://ip-api.com/json/${data.ip}`).then((res) => res.json())}
              decideOk={(resp: any) => resp.status === "success"}
              onFinish={(resp: any) => {
                Modal.info({
                  title: "查询成功",
                  style: { width: "800px" },
                  content: (
                    <Descriptions
                      border
                      column={2}
                      data={[...Object.entries(resp).map(([label, value]) => ({ label, value: `${value}` }))]}
                    />
                  ),
                });
              }}
            >
              <Button
                type="primary"
                color="red"
              >
                提交请求
              </Button>
            </FormSubmitter>
            <FormSubmitter
              buttonMode
              deleteMode
              deleteText={
                <Alert
                  style={{ margin: "16px 0" }}
                  type="error"
                  content="删除请求执行后不可恢复，确定继续执行？"
                />
              }
              params={{ ip: "8.8.8.8" }}
              request={(data: any) => fetch(`http://ip-api.com/json/${data.ip}`).then((res) => res.json())}
              decideOk={(resp: any) => resp.status === "success"}
              onFinish={(resp: any) => {
                Modal.info({
                  title: "操作成功",
                  style: { width: "800px" },
                  content: (
                    <Descriptions
                      border
                      column={2}
                      data={[...Object.entries(resp).map(([label, value]) => ({ label, value: `${value}` }))]}
                    />
                  ),
                });
              }}
            >
              <Button
                type="secondary"
                status="danger"
              >
                删除请求
              </Button>
            </FormSubmitter>
          </Space>
        </div>
      </div>
    );
  },
};
