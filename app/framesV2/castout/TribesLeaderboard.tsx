"use client";

import { useCastoutData } from "../../hooks/api";
import { tribeColors } from "./tribeColors";
import { navigateToTribe } from "./navigation";

export function TribesLeaderboard() {
  const { data, isLoading } = useCastoutData();

  if (isLoading) {
    return (
      <div className="px-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-row justify-between py-2">
            <div className="flex-1 flex flex-row items-center">
              <div className="flex-shrink min-w-0">
                <div className="h-5 w-24 bg-[#8B99A4]/10 rounded mb-1 animate-pulse-subtle"></div>
                <div className="h-4 w-16 bg-[#8B99A4]/10 rounded animate-pulse-subtle"></div>
              </div>
            </div>
            <div className="h-5 w-8 bg-[#8B99A4]/10 rounded animate-pulse-subtle"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const sortedTribes = [...data.tribes].sort(
    (a, b) => b.totalYoinks - a.totalYoinks,
  );

  return (
    <div className="px-3 pb-[120px]">
      {sortedTribes.map((tribe, index) => (
        <div
          key={tribe.tribe}
          className="flex flex-row justify-between py-2 cursor-pointer"
          onClick={() => navigateToTribe(tribe.tribe)}
        >
          <div className="flex-1 flex flex-row items-center">
            <div className="flex-shrink min-w-0">
              <div
                className={`font-semibold text-sm leading-5 ${tribeColors[tribe.tribe] || "text-[#BA181B]"}`}
              >
                {tribe.tribe}
              </div>
              <div className="text-xs text-[#8B99A4]">
                {index === 0 && "🥇 "}
                {index === 1 && "🥈 "}
                {index === 2 && "🥉 "}
                {tribe.totalYoinks}{" "}
                {tribe.totalYoinks === 1 ? "yoink" : "yoinks"}
              </div>
            </div>
          </div>
          <div className="flex-none text-[#546473] font-semibold">
            #{index + 1}
          </div>
        </div>
      ))}
    </div>
  );
}
