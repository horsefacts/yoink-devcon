"use client";

import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { frameConnector } from "./connector";

export const config = createConfig({
  chains: [base],
  connectors: [frameConnector()],
  ssr: window.process === undefined,
  transports: {
    [base.id]: http(
      process.env.NEXT_PUBLIC_ALCHEMY_RPC ?? "https://mainnet.base.org",
    ),
  },
});
