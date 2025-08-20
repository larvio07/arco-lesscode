import React, { useState } from "react";

import { Button, Message, Modal, Result, Space } from "@arco-design/web-react";
import { useDebounceFn } from "ahooks";

export type FormSubmitProviderChildrenProps = {
  onClick: (resp: unknown) => void;
  onSubmit: (resp: unknown) => void;
  onReset: (resp: unknown) => void;

  submitting: boolean | number;
  loading: boolean | number;
};
export type FormSubmitProviderType = {
  hideResult?: boolean;
  buttonMode?: boolean;
  deleteMode?: boolean;
  deleteTip?: React.ReactNode;
  deleteText?: string | React.ReactElement;
  params?: {};
  backText?: string;
  children:
    | React.ReactElement<Partial<FormSubmitProviderChildrenProps>>
    | React.ReactElement<Partial<FormSubmitProviderChildrenProps>>[];
  request?: (params: unknown) => Promise<any>;
  onFinish?: (resp: unknown) => void;
  back?: () => void;
  decideOk?: (resp: unknown) => boolean;
};

export const FormSubmitter: React.FC<FormSubmitProviderType> = ({
  request,
  onFinish,
  hideResult,
  buttonMode,
  deleteMode,
  deleteTip,
  deleteText,
  params,
  backText,
  children,
  decideOk = () => true,
  ...props
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [opened, setOpened] = useState(false);
  const [resp, setResp] = useState<{ hasCall: boolean; message?: string }>({ hasCall: false });

  const startRequest = useDebounceFn(
    (params: any) => {
      setSubmitting(true);
      request &&
        request(params)
          .then((resp: any) => {
            setTimeout(() => {
              setSubmitting(false);
              setResp({ hasCall: true, ...resp });

              if (buttonMode && !decideOk(resp)) {
                Message.error(resp.message);
              }
              if (decideOk(resp)) {
                onFinish && onFinish(resp);
                hideResult && Message.success(resp.message);
                deleteMode && setOpened(false);
              }
              if (!decideOk(resp)) {
                hideResult && Message.warning(resp.message);
              }
            }, 500);
          })
          .catch((err) => {
            console.error(err);
            setSubmitting(false);
          });
    },
    { wait: 1000 }
  );

  const isOk: boolean = decideOk(resp);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const buttonModeProps = {
        onClick: buttonMode
          ? () => {
              if (deleteMode) {
                setOpened(true);
              } else {
                startRequest.run(params);
              }
            }
          : () => {},
        loading: submitting ? 1 : 0,
      };
      const formModeProps = {
        submitting: submitting ? 1 : 0,
        onReset: () => setResp({ hasCall: false }),
        onSubmit: (params: unknown) => {
          startRequest.run(params);
        },
      };
      return React.cloneElement(child, buttonMode ? buttonModeProps : formModeProps);
    }
    return child;
  });
  if (!!hideResult || buttonMode) {
    return (
      <>
        {childrenWithProps}
        {deleteMode && (
          <Modal
            title={deleteTip || <div className="font-bold text-base">确认执行当前操作?</div>}
            visible={opened}
            footer={null}
            onCancel={() => setOpened(false)}
          >
            {deleteText}

            <Space>
              <Button
                type="primary"
                loading={submitting}
                onClick={() => {
                  startRequest.run(params);
                }}
              >
                确定
              </Button>
              <Button
                type="dashed"
                onClick={() => setOpened(false)}
              >
                取消
              </Button>
            </Space>
          </Modal>
        )}
      </>
    );
  }

  console.log({ isOk });

  return (
    <>
      <div
        className="flex items-center h-[100%]"
        style={{ display: resp.hasCall ? "flex" : "none" }}
      >
        <Result
          style={{ width: "100%" }}
          status={isOk ? "success" : "error"}
          title={isOk ? "执行成功" : "提交错误"}
          subTitle={isOk ? null : resp.message}
        >
          <Space style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            {!isOk && (
              <Button
                type="primary"
                onClick={() => setResp({ hasCall: false })}
              >
                重试
              </Button>
            )}
            {isOk && (
              <Button
                onClick={() => {
                  setResp({ hasCall: false });
                  props.back && props.back();
                }}
              >
                {backText || "返回"}
              </Button>
            )}
          </Space>
        </Result>
      </div>

      <div style={{ display: !resp.hasCall ? "flex" : "none" }}>{childrenWithProps}</div>
    </>
  );
};

export default FormSubmitter;
