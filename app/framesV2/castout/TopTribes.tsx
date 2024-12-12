"use client";

import Image from "next/image";
import { useCastoutData } from "../../hooks/api";
import FlagAvatar from "../../../public/flag.png";
import { CastoutPlayer } from "../../api/castout/route";
import { tribeColors } from "./tribeColors";
import { navigateToProfile, navigateToTribe } from "./navigation";

export function TopTribes() {
  const { data, isLoading } = useCastoutData();

  if (isLoading) {
    return (
      <div className="p-[11px] grid grid-cols-3 border border-[#DBDBDB] rounded-lg mb-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`flex flex-col items-center ${
              i < 2 ? "border-r border-[#DBDBDB]" : ""
            }`}
          >
            <div className="h-4 w-20 bg-[#8B99A4]/10 rounded mb-1 animate-pulse-subtle"></div>
            <div className="h-3 w-16 bg-[#8B99A4]/10 rounded mb-3 animate-pulse-subtle"></div>
            <div className="w-[38px] h-[38px] rounded-full bg-[#8B99A4]/10 mb-2 animate-pulse-subtle"></div>
            <div className="h-4 w-16 bg-[#8B99A4]/10 rounded mb-1 animate-pulse-subtle"></div>
            <div className="h-3 w-12 bg-[#8B99A4]/10 rounded animate-pulse-subtle"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const topTribes = [...data.tribes]
    .sort((a, b) => b.totalYoinks - a.totalYoinks)
    .slice(0, 3);

  const tribesWithMVPs = topTribes.map((tribe) => {
    const tribePlayers = data.players
      .filter((player: CastoutPlayer) => player.tribe === tribe.tribe)
      .sort((a: CastoutPlayer, b: CastoutPlayer) => b.yoinks - a.yoinks);

    return {
      ...tribe,
      mvp: tribePlayers[0] || null,
    };
  });

  return (
    <div className="p-[11px] grid grid-cols-3 border border-[#DBDBDB] rounded-lg mb-8">
      {tribesWithMVPs.map((tribe, index) => (
        <div
          key={tribe.tribe}
          className={`flex flex-col items-center cursor-pointer ${
            index < 2 ? "border-r border-[#DBDBDB]" : ""
          }`}
          onClick={() => navigateToTribe(tribe.tribe)}
        >
          <div
            className={`font-semibold text-sm leading-5 ${tribeColors[tribe.tribe] || "text-[#BA181B]"}`}
          >
            {tribe.tribe}
          </div>
          <div className="mb-3">
            <div className="text-xs text-[#8B99A4]">
              {tribe.totalYoinks} yoinks
            </div>
          </div>
          {tribe.mvp && (
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => navigateToProfile(tribe.mvp!.username)}
            >
              <div className="w-[38px] h-[38px] rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={tribe.mvp.pfpUrl || FlagAvatar}
                  alt={tribe.mvp.username}
                  width={38}
                  height={38}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-sm font-medium truncate max-w-[100px]">
                {tribe.mvp.username}
              </div>
              <div className="bg-[#FDE8E9] border border-[#F9D0D3] text-[#BA181B] text-[10px] font-semibold px-1.5 py-[2px] rounded">
                🏆 MVP
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
