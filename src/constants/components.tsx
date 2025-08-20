import type { CascaderProps, CheckboxProps, SwitchProps } from "@arco-design/web-react";
import {
  AutoComplete,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TreeSelect,
} from "@arco-design/web-react";
import React from "react";
import { RequestProvider } from "../components/RequestProvider";
import TabsList from "../components/TabsList";

export const componentMaps = {
  Input,
  InputNumber,
  InputPassword: Input.Password,
  Select,
  TreeSelect,
  Radio,
  RadioGroup: Radio.Group,
  Checkbox: (props: CheckboxProps) => <Checkbox {...props} />,
  CheckboxGroup: Checkbox.Group,
  AutoComplete,
  DatePicker,
  RangePicker: DatePicker.RangePicker,
  ColorPicker,
  Cascader: (props: CascaderProps) => <Cascader {...props} />,
  Switch: (props: SwitchProps & { value: boolean }) => (
    <Switch
      {...props}
      checked={props.value}
    />
  ),
  InputTextArea: (props: any) => (
    <Input.TextArea
      autoSize={{ minRows: 4 }}
      {...props}
    />
  ),
  List: Form.List,
  TabsList: TabsList,
  Void: React.Fragment,
};

export const providerMaps = {
  RequestProvider,
  Fragment: React.Fragment,
};
