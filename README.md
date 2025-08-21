# Arco-less 组件库

## 项目概述

这是一个基于 Arco-design 构建的中台业务组件库，很易用的中台常见场景组件解决方案，提高项目交互一致性和代码可维护性。

## 核心特性

- **[RequestProvider](https://larvio07.github.io/arco-lesscode/?path=/docs/requestprovider--docs)** 异步请求组件通过注入新的 props 到子组件完成数据加载、刷新、请求参数变更。
- **[FormRender](https://larvio07.github.io/arco-lesscode/?path=/docs/formrender--docs)** 协议配置生成复杂表单，支持数据联动交互，组件 props 异步加载和主动更新。
- **[FormSubmitter](https://larvio07.github.io/arco-lesscode/?path=/docs/formsubmitter--docs)** 表单和异步请求提交组件，自动处理 loading 和 submitting 状态。
- **[QueryParams](https://larvio07.github.io/arco-lesscode/?path=/docs/queryparams--docs)** 协议配置生成参数查询器，支持数据联动交互，组件 props 异步加载和主动更新。

## 技术栈

- **核心框架**: React18
- **UI 框架**: Arco-design

## 安装

To install `@ant-design/pro-components`, run the following command:

```bash
$ pnpm install arco-lesscode
```

## RequestProvider

```javascript
import { RequestProvider } from "arco-less";
import { useRef } from "react";

const service = (params) =>
  fetch(`https://api.github.com/search/repositories?${qs.stringify(params)}`).then((res) => res.json());

function Demo {
    const RequestREF = useRef<RequestProviderRefType<{ q: string; page: 1; per_page: 20 }>>(null);
    return <div>
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
}
```

## FormRender

```javascript
import { FormRender } from "arco-less";
import { useRef } from "react";

function Demo() {
  const RequestREF = useRef < RequestProviderRefType < { q: string } >> null;
  return (
    <FormRender
      layout="vertical"
      schemas={{
        type: "array",
        properties: {
          keyword: {
            compName: "Select",
            compProps: {
              options: ["react", "vue"],
            },
            reload(v, values, s, f) {
              if (v.keyword) {
                RequestREF.current?.setParams({ q: v.keyword });
              }
              return {
                ...s,
              };
            },
          },
          project: {
            compName: "Select",
            compProps: {},
            provider: {
              compName: "RequestProvider",
              compProps: {
                ref: RequestREF,
                service: ({ q }: any) => service({ q: q || "react" }),
              },
              injectProps: {
                schema: {
                  options: {
                    dataIndex: ["items"],
                    format(items: any) {
                      return items?.map((item) => item.full_name);
                    },
                  },
                },
              },
            },
          },
        },
      }}
      onSubmit={(arg) => {
        console.log({ arg });
      }}
    />
  );
}
```

## 特征

组件经过精心设计，可支持企业级应用程序的强大架构。

#### 📝 License

Copyright © 2023 - present <br/> This project is [MIT](./LICENSE) licensed.
