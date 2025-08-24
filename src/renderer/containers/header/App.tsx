// src/renderer/Header.tsx
import dayjs from "dayjs";

import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

import "./index.css";
import HeaderTool from "./components/HeaderTool";

const App = () => {
  return (
    <div className="custom-titlebar">
      <HeaderTool />
      <div className="custom-titlebar-content"></div>
    </div>
  );
};
export default App;
