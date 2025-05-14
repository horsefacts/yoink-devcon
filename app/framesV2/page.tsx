import dynamic from "next/dynamic";
import { Metadata } from "next";

const Yoink = dynamic(() => import("./Yoink"), { ssr: false });

const BASE_URL = process.env.DEPLOYMENT_URL || process.env.VERCEL_URL;
const domain = BASE_URL ? `https://${BASE_URL}` : "http://localhost:3000";
const route = `${domain}/framesV2`;
const frame = {
  version: "next",
  imageUrl: `${route}/opengraph-image?v=2`,
  button: {
    title: "🚩 Start",
    action: {
      type: "launch_frame",
      name: "Yoink!",
      url: route,
      splashImageUrl: "https://yoink.party/logo.png",
      splashBackgroundColor: "#f5f0ec",
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
  return <Yoink />;
}
