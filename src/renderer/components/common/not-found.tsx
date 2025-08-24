import { useNavigate } from "@tanstack/react-router";
import { Button } from "antd";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-20 m-auto container text-center">
      <Button
        onClick={() => {
          navigate({
            to: "/welcome",
          });
        }}
      >
        返回
      </Button>
    </div>
  );
};

export default NotFound;
