import { Button } from "primereact/button";

import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const PublishButton = ({ projectInfo, cellData, refresh, ...props }: any) => {
  return (
    <>
      <ConfirmDialog />
      <Button
        type={props.type || "text"}
        label="提交"
        onClick={(e) => {
          e.stopPropagation();
          confirmDialog({
            message: "确定提交吗",
            defaultFocus: "accept",
            accept: () => {},
          });
        }}
      />
    </>
  );
};

export default PublishButton;
