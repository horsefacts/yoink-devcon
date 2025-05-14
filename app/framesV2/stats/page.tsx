import { Metadata } from "next";
import { Hex } from "viem";
import { LeaderboardToggle } from "../../components/LeaderboardToggle";
import { UserHeader } from "../UserHeader";
import { TotalYoinks } from "../TotalYoinks";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Suspense } from "react";
import { AddFrameButton } from "../../components/AddFrameButton";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.DEPLOYMENT_URL || process.env.VERCEL_URL;
const domain = BASE_URL ? `https://${BASE_URL}` : "http://localhost:3000";
const route = `${domain}/framesV2`;
const frame = {
  version: "2",
  image: {
    url: `${route}/opengraph-image?v=2`,
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
    <div className="flex flex-col h-[100vh]">
      <div className="flex-1 overflow-hidden p-3 space-y-3">
        <ErrorBoundary>
          <Suspense>
            <UserHeader address={address as Hex} />
            <TotalYoinks />
            <LeaderboardToggle address={address as string} />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="flex-shrink-0 p-3">
        <AddFrameButton />
      </div>
    </div>
  );
}
