import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.tsx";
import MainRouter from "./Routes/MainRouter.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainRouter />
    <App />
  </StrictMode>,
);
