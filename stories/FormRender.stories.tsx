import "@arco-design/web-react/dist/css/arco.css";
import qs from "qs";

import { Meta, StoryObj } from "@storybook/react";
import FormRender from "../src/components/FormRender";

import { Typography } from "@arco-design/web-react";
import { RequestProviderRefType } from "../src/components/RequestProvider";
import { useRef } from "react";

const meta: Meta<typeof FormRender> = {
  title: "FormRender",

  component: FormRender,
  parameters: {},
  tags: ["autodocs"],

  args: {},
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof FormRender>;

const service = (params) =>
  fetch(`https://api.github.com/search/repositories?${qs.stringify(params)}`).then((res) => res.json());

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: "依据 schemas 规则结构灵活构造表单",
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
          基本用法
        </Typography.Title>

        <div style={{ paddingTop: "16px", width: "100%" }}>
          <FormRender
            layout="vertical"
            schemas={{
              type: "array",
              properties: {
                username: {
                  compName: "AutoComplete",
                  compProps: {},
                },
              },
            }}
            comments={{
              username: "USERNAME",
            }}
            onSubmit={(values) => {
              console.log({ values });
            }}
          />
        </div>
      </div>
    );
  },
};

export const DataFetch: Story = {
  parameters: {
    docs: {
      description: {
        story: "依据 schemas 规则结构构造联动表单，keyword 选择后，会远程加载 project 列表",
      },
    },
  },
  render: () => {
    const RequestREF = useRef<RequestProviderRefType<{ q: string }>>(null);
    return (
      <div>
        <Typography.Title
          heading={5}
          style={{ marginTop: 0 }}
        >
          请求 API 数据填充 Selec 组件配置案例
        </Typography.Title>

        <div style={{ paddingTop: "16px", width: "100%" }}>
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
        </div>
      </div>
    );
  },
};
export const ComplexForm: Story = {
  parameters: {
    docs: {
      description: {
        story: "依据 schemas 规则结构灵活构造复杂表单",
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
          复杂表单构造
        </Typography.Title>

        <div style={{ paddingTop: "16px", width: "100%" }}>
          <FormRender
            layout="vertical"
            schemas={{
              type: "array",
              properties: {
                title: {
                  label: "文档标题",
                  compName: "Input",
                },
                slug: {
                  label: "标识",
                  span: 4,
                  compName: "Input",
                },
                path: {
                  label: "接口地址",
                  span: 20,
                  compName: "Input",
                },
                method: {
                  label: "请求方式",
                  span: 4,
                  compName: "Select",
                  compProps: {
                    options: [
                      "Accept",
                      "Accept-CH",
                      "Accept-Encoding",
                      "Accept-Language",
                      "Accept-Patch",
                      "Accept-Post",
                      "Accept-Ranges",
                      "Access-Control-Allow-Credentials",
                      "Access-Control-Allow-Headers",
                      "Access-Control-Allow-Methods",
                      "Access-Control-Allow-Origin",
                      "Access-Control-Expose-Headers",
                      "Access-Control-Max-Age",
                      "Access-Control-Request-Headers",
                      "Access-Control-Request-Method",
                    ],
                  },
                },
                responseType: {
                  label: "返回类型",
                  span: 20,
                  compName: "Select",
                  compProps: {
                    options: ["application/json", "application/xml", "text/plain", "application/octet-stream"],
                  },
                },
                description: {
                  label: "接口描述",
                  compName: "InputTextArea",
                },
                headers: {
                  compName: "List",
                  span: 18,
                  label: "请求 Header",
                  compProps: {
                    schemas: {
                      type: "array",
                      properties: {
                        key: {
                          compName: "Select",
                          span: 12,
                          compProps: {
                            allowCreate: true,
                            options: ["application/json", "application/xml", "text/plain", "application/octet-stream"],
                          },
                        },
                        value: {
                          span: 12,
                          compName: "Input",
                        },
                      },
                    },
                  },
                },
                params: {
                  compName: "List",
                  span: 18,
                  label: "请求 Params",
                  compProps: {
                    schemas: {
                      type: "array",
                      properties: {
                        name: {
                          span: 4,
                          compName: "Input",
                          compProps: {
                            placeholder: "字段",
                          },
                        },
                        required: {
                          span: 4,
                          compName: "Select",
                          compProps: {
                            placeholder: "是否必填",
                            options: ["必填", "非必填"],
                          },
                        },
                        key: {
                          span: 4,
                          compName: "Select",
                          compProps: {
                            allowCreate: true,
                            placeholder: "类型",
                            options: ["STRING", "INT", "OBJECT"],
                          },
                        },
                        value: {
                          span: 12,
                          compName: "Input",
                          compProps: {
                            placeholder: "说明",
                          },
                        },
                      },
                    },
                  },
                },
                data: {
                  label: "请求 Body",
                  compName: "List",
                  span: 18,
                  compProps: {
                    schemas: {
                      type: "array",
                      properties: {
                        name: {
                          span: 4,
                          compName: "Input",
                          compProps: {
                            placeholder: "字段",
                          },
                        },
                        required: {
                          span: 4,
                          compName: "Select",
                          compProps: {
                            placeholder: "是否必填",
                            options: ["必填", "非必填"],
                          },
                        },
                        key: {
                          span: 4,
                          compName: "Select",
                          compProps: {
                            allowCreate: true,
                            placeholder: "类型",
                            options: ["STRING", "INT", "OBJECT"],
                          },
                        },
                        value: {
                          span: 12,
                          compName: "Input",
                          compProps: {
                            placeholder: "说明",
                          },
                        },
                      },
                    },
                  },
                  reload(v, values, s, f) {
                    return {
                      ...s,
                      hidden: ["GET", "HEAD", "CONNECT"].includes(values["method"]),
                    };
                  },
                },
                scene: {
                  compName: "TabsList",
                  label: "应用场景",
                  compProps: {
                    schemas: {
                      type: "array",
                      properties: {
                        type: {
                          span: 24,
                          compName: "Input",
                          label: "场景标题",
                          compProps: {
                            placeholder: "应用场景",
                          },
                        },
                        code: {
                          span: 24,
                          compName: "InputTextArea",
                          label: "场景描述",
                          compProps: {
                            placeholder: "场景描述",
                          },
                        },
                      },
                    },
                  },
                },
              },
            }}
            onSubmit={(values) => {
              console.log({ values });
            }}
          />
        </div>
      </div>
    );
  },
};
