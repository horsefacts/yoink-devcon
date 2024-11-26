import dynamic from "next/dynamic";
import { Metadata } from "next";

import { getLastYoinkedBy, getTotalYoinks } from "../../lib/contract";
import { getUserByAddress, truncateAddress } from "../../lib/neynar";

const Yoink = dynamic(() => import("./Yoink"), { ssr: false });

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
  const [lastYoinkedBy, totalYoinks] = await Promise.all([
    getLastYoinkedBy(),
    getTotalYoinks(),
  ]);

  const user = await getUserByAddress(lastYoinkedBy);
  const username = user ? user.username : truncateAddress(lastYoinkedBy);
  const pfp = user?.pfp_url;

  return (
    <Yoink
      lastYoinkedBy={username}
      pfpUrl={pfp}
      totalYoinks={totalYoinks.toLocaleString()}
    />
  );
}
