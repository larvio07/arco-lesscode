import { Button, Form, Grid, Tabs, TabsProps } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { useState } from "react";
import { FromCompRender } from "../../libs";
import { FormCompMatchType, FormSchemas } from "../../../typings";

export interface TabsListType<T = any> extends Partial<TabsProps> {
  tabNameKey?: string;
  field: string;
  span: number;
  schemas: FormSchemas;
  value: T[];
}

export default function TabsList(props: TabsListType) {
  const [activeTab, setActiveTab] = useState("0");

  const {
    field,
    schemas: { properties },
    ...tabsProps
  } = props;
  const keys = Object.keys(properties);
  const tabNameKey = props.tabNameKey || Object.keys(properties)[0] || "";

  return (
    <Grid.Col
      span={props.span || 24}
      className="form-list"
    >
      <Form.Item>
        <Form.List
          field={field}
          initialValue={props.value}
        >
          {(fields, { add, remove }) => {
            return (
              <Tabs
                editable
                lazyload={false}
                {...tabsProps}
                activeTab={activeTab}
                addButton={
                  <Button
                    size="mini"
                    icon={<IconPlus />}
                    style={{
                      marginBottom: fields.length === 0 ? "8px" : "0",
                    }}
                    onClick={() => {
                      add();

                      setActiveTab(`${Number(fields.length)}`);
                    }}
                  />
                }
                onDeleteTab={(v) => {
                  remove(Number(v));
                  setActiveTab(`${Number(v) - 1}`);
                }}
                onChange={(v) => {
                  setActiveTab(v);
                }}
              >
                {fields.map((item, i) => (
                  <Tabs.TabPane
                    key={i}
                    title={<div className="capitalize">{props.value[i]?.[tabNameKey] || "待定义"}</div>}
                  >
                    <Grid.Row
                      className="flex-grow"
                      gutter={16}
                    >
                      {Object.entries(properties)?.map(([key, filed]) => (
                        <FromCompRender
                          {...filed}
                          key={key}
                          field={keys.length === 1 ? `${item.field}` : `${item.field}.${key}`}
                        />
                      ))}
                    </Grid.Row>
                  </Tabs.TabPane>
                ))}
              </Tabs>
            );
          }}
        </Form.List>
      </Form.Item>
    </Grid.Col>
  );
}
