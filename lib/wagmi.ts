import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";

export const config = createConfig({
  chains: [base],
  connectors: [farcasterFrame()],
  transports: {
    [base.id]: http(
      process.env.NEXT_PUBLIC_ALCHEMY_RPC ?? "https://mainnet.base.org",
    ),
  },
});
