"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as WagmiProviderLib } from "wagmi";
import { config } from "../lib/wagmi";

const queryClient = new QueryClient();

export function WagmiProvider({ children }: { children: JSX.Element }) {
  return (
    <WagmiProviderLib config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProviderLib>
  );
}
