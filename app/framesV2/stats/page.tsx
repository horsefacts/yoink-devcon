import { Metadata } from "next";
import { Hex } from "viem";
import { Leaderboard } from "../Leaderboard";
import { UserHeader } from "../UserHeader";
import { TotalYoinks } from "../TotalYoinks";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

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

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const address =
    typeof searchParams.address === "string"
      ? searchParams.address
      : "0xcA698e19280DFB59084A15f7E891778c483Be0DC";

  return (
    <div className="p-3 space-y-3">
      <ErrorBoundary>
        <Suspense fallback={<div>Loading user stats...</div>}>
          <UserHeader address={address as Hex} />
          <TotalYoinks />
          <Leaderboard />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
