import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n/config";
import "./style.css";
import App from "./App.tsx";
import MainRouter from "./Routes/MainRouter.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadProvider } from "react-head";
import { AuthProvider } from "./Context/Auth.tsx";
import { SocketProvider } from "./Context/SocketContext.tsx";

const client = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <HeadProvider>
        <AuthProvider>
          <SocketProvider>
            <MainRouter />
            <App />
          </SocketProvider>
        </AuthProvider>
      </HeadProvider>
    </QueryClientProvider>
  </StrictMode>,
);
