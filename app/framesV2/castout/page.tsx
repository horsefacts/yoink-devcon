import { Metadata } from "next";
import { CastoutLeaderboardToggle } from "./CastoutLeaderboardToggle";
import { TopTribes } from "./TopTribes";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Suspense } from "react";
import { CloseButton } from "../../components/CloseButton";
import { CountdownTimer } from "./CountdownTimer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Yoink! Castout",
    openGraph: {
      title: "Yoink! Castout",
      description: "Yoink Castout Event Leaderboard",
    },
  };
}

export default function Page() {
  return (
    <div className="flex flex-col h-[100vh]">
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
