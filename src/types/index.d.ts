import type {
  CascaderProps,
  CheckboxProps,
  DatePickerProps,
  FormInstance,
  FormProps,
  InputNumberProps,
  InputProps,
  RadioProps,
  SelectProps,
  TextAreaProps,
  TypographyTitleProps,
} from "@arco-design/web-react";

import type { RequestProviderType, InjectPropsType } from "../components/RequestProvider";
import type { TabsListType } from "../components/TabsList";
import { componentMaps, providerMaps } from "../constants/components";

declare global {
  const isDEV: boolean;
  interface Window {
    getOssSignature: () => any;
  }
}

type ProviderNameMaps = keyof typeof providerMaps;
type CompNameMaps = keyof typeof componentMaps;
type CompProps = Partial<
  | InputProps
  | InputNumberProps
  | TextAreaProps
  | SelectProps
  | CascaderProps
  | DatePickerProps
  | PageSelectProps
  | RadioProps
  | CheckboxProps
  | TypographyTitleProps
  | FormWrapType
  | CodeEditorProps
  | TabsListType
>;

type FormCompMatchType = {
  label?: string;
  span?: number;
  hidden?: boolean;
  reload?: (v: any, values: any, s: Partial<FormCompMatchType>, f: FormInstance) => Partial<FormCompMatchType>;
  compName: CompNameMaps;
  compProps?: CompProps &
    Partial<FormWrapType> & {
      key?: string;
      hideMove?: boolean;
    };
  required?: boolean;
  isList?: boolean;
  provider?: {
    compName: ProviderNameMaps;
    compProps?: Partial<RequestProviderType>;
    injectProps?: InjectPropsType;
  };
};

type FormWrapType = Partial<FormProps> & {
  hideMove?: boolean;
  schemas: FormSchemas;
  comments?: Record<string, string>;
};
type FormSchemas = {
  type: "object" | "array";
  properties: Record<string, FormCompMatchType>;
};
type SelectPageMode = {
  onSelect?: (params: any, options: any[]) => void;
  mode?: "select" | "list";
};
