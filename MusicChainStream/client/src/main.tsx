import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { PlayerProvider } from "./contexts/PlayerContext";
import { BlockchainProvider } from "./contexts/BlockchainContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class">
      <BlockchainProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </BlockchainProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
