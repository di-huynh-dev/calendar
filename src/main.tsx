import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConfigProvider } from "antd";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff5202",
          controlOutlineWidth: 0,
        },
      }}
    >
      <App />
      <Toaster />
    </ConfigProvider>
  </StrictMode>
);
