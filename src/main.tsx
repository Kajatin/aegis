import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { getSetting } from "./utils/storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const cacheTime = await getSetting("cache_time");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: parseInt(cacheTime),
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
