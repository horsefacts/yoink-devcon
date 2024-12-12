"use client";

import { useState } from "react";
import { TribesLeaderboard } from "./TribesLeaderboard";
import { PlayersLeaderboard } from "./PlayersLeaderboard";

type Tab = "tribes" | "players";

export function CastoutLeaderboardToggle() {
  const [activeTab, setActiveTab] = useState<Tab>("tribes");

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-3 flex border-b border-[#DBDBDB]">
        <button
          onClick={() => setActiveTab("tribes")}
          className={`flex-1 py-2 text-base font-semibold relative ${
            activeTab === "tribes" ? "text-[#BA181B]" : "text-[#8B99A4]"
          }`}
        >
          Tribes
          {activeTab === "tribes" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BA181B]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("players")}
          className={`flex-1 py-2 text-base font-semibold relative ${
            activeTab === "players" ? "text-[#BA181B]" : "text-[#8B99A4]"
          }`}
        >
          Players
          {activeTab === "players" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BA181B]" />
          )}
        </button>
      </div>
      <div className="flex-1 overflow-hidden mt-4">
        <div className="h-full overflow-y-auto pb-[120px]">
          {activeTab === "tribes" ? (
            <TribesLeaderboard />
          ) : (
            <PlayersLeaderboard />
          )}
        </div>
      </div>
    </div>
  );
}
