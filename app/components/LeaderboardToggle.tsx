"use client";

import { useState } from "react";
import { Leaderboard } from "../framesV2/Leaderboard";
import { Rankings } from "./Rankings";

type Tab = "rankings" | "leaderboard";

export function LeaderboardToggle({ address }: { address: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("rankings");

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex-shrink-0 px-3 flex border-b border-[#DBDBDB]">
        <button
          onClick={() => setActiveTab("rankings")}
          className={`flex-1 py-2 text-base font-semibold relative ${
            activeTab === "rankings" ? "text-[#BA181B]" : "text-[#8B99A4]"
          }`}
        >
          Your Rank
          {activeTab === "rankings" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BA181B]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`flex-1 py-2 text-base font-semibold relative ${
            activeTab === "leaderboard" ? "text-[#BA181B]" : "text-[#8B99A4]"
          }`}
        >
          Leaderboard
          {activeTab === "leaderboard" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BA181B]" />
          )}
        </button>
      </div>
      <div className="flex-1 min-h-0 mt-4">
        <div className="h-full overflow-y-auto">
          {activeTab === "rankings" ? (
            <Rankings address={address} />
          ) : (
            <Leaderboard />
          )}
        </div>
      </div>
    </div>
  );
}
