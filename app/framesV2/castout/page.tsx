import { Metadata } from "next";
import { CastoutLeaderboardToggle } from "./CastoutLeaderboardToggle";
import { TopTribes } from "./TopTribes";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Suspense } from "react";
import { CloseButton } from "../../components/CloseButton";
import { CountdownTimer } from "./CountdownTimer";

const BASE_URL = process.env.DEPLOYMENT_URL || process.env.VERCEL_URL;
const domain = BASE_URL ? `https://${BASE_URL}` : "http://localhost:3000";
const route = `${domain}/framesV2/castout`;
const frame = {
  version: "next",
  imageUrl: `${route}/embed`,
  button: {
    title: "🏆 View Leaderboard",
    action: {
      type: "launch_frame",
      name: "Yoink! Castout",
      url: route,
      splashImageUrl: "https://yoink.party/logo.png",
      splashBackgroundColor: "#f5f0ec",
    },
  },
};

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Yoink! Castout",
    openGraph: {
      title: "Yoink! Castout",
      description: "Yoink Castout Event Leaderboard",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Page() {
  return (
    <div className="fixed inset-0 max-w-screen-sm mx-auto flex flex-col">
      <div className="flex-1 overflow-hidden p-3 space-y-3">
        <ErrorBoundary>
          <Suspense>
            <CountdownTimer />
            <TopTribes />
            <CastoutLeaderboardToggle />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="flex-shrink-0 p-3">
        <CloseButton />
      </div>
    </div>
  );
}
