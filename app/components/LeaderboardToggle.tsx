"use client";

import { useState } from "react";
import { Leaderboard } from "../framesV2/Leaderboard";
import { Rankings } from "./Rankings";

type Tab = "rankings" | "leaderboard";

export function LeaderboardToggle({ address }: { address: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("rankings");

  return (
    <div>
      <div className="px-3 flex border-b border-[#DBDBDB] mb-4">
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
      {activeTab === "rankings" ? (
        <Rankings address={address} />
      ) : (
        <Leaderboard />
      )}
    </div>
  );
}
