import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";

const UnPublishButton = ({ projectInfo, cellData, refresh, ...props }: any) => {
  return (
    <>
      <ConfirmDialog />
      <Button
        type={props.type || "text"}
        label="提交"
        onClick={(e) => {
          e.stopPropagation();
          confirmDialog({
            message: "确定取消提交吗？",
            defaultFocus: "accept",
            accept: () => {},
          });
        }}
      />
    </>
  );
};

export default UnPublishButton;
