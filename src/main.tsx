import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.tsx";
import MainRouter from "./Routes/MainRouter.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadProvider } from "react-head";

const client = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <HeadProvider>
        <MainRouter />
        <App />
      </HeadProvider>
    </QueryClientProvider>
  </StrictMode>,
);
