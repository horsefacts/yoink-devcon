import dynamic from "next/dynamic";
import { Metadata } from "next";

const SendTx = dynamic(() => import("./SendTx"), { ssr: false });

const BASE_URL = process.env.DEPLOYMENT_URL || process.env.VERCEL_URL;
const domain = BASE_URL ? `https://${BASE_URL}` : "http://localhost:3000";
const route = `${domain}/framesV2`;
const frame = {
  version: "2",
  image: {
    url: `${route}/opengraph-image`,
    aspectRatio: "1:1",
  },
  cta: {
    title: "🚩 Start",
    action: {
      type: "launch_app_frame",
      target: route,
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Yoink!",
    openGraph: {
      title: "Yoink!",
      description: "Yoink the flag",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default async function Page() {
  return <SendTx />;
}
