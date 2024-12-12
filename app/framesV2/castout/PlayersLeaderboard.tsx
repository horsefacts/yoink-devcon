"use client";

import Image from "next/image";
import { useCastoutData } from "../../hooks/api";
import FlagAvatar from "../../../public/flag.png";
import { tribeColors } from "./tribeColors";
import { navigateToProfile, navigateToTribe } from "./navigation";

export function PlayersLeaderboard() {
  const { data } = useCastoutData();

  if (!data) return null;

  // Create a map of tribe MVPs
  const tribeMVPs = new Map();
  data.players.forEach((player) => {
    if (
      !tribeMVPs.has(player.tribe) ||
      tribeMVPs.get(player.tribe).yoinks < player.yoinks
    ) {
      tribeMVPs.set(player.tribe, player);
    }
  });

  const sortedPlayers = [...data.players].sort((a, b) => b.yoinks - a.yoinks);

  return (
    <div className="px-3">
      {sortedPlayers.map((player, index) => (
        <div
          key={player.address}
          className="flex flex-row justify-between py-2"
        >
          <div
            className="flex-1 flex flex-row items-center gap-[10px] cursor-pointer"
            onClick={() => navigateToProfile(player.username)}
          >
            <div className="flex-shrink-0 w-[38px] h-[38px] rounded-full overflow-hidden bg-gray-200">
              <Image
                src={player.pfpUrl || FlagAvatar}
                className="h-full w-full object-cover object-center"
                alt={player.username}
                height={38}
                width={38}
              />
            </div>
            <div className="flex-shrink min-w-0">
              <div className="font-semibold text-sm leading-5 truncate flex items-center gap-1">
                {player.username}
                {tribeMVPs.get(player.tribe)?.address === player.address && (
                  <>
                    <span className="text-[#8B99A4]">•</span>
                    <span className="text-[#BA181B] text-[10px] font-semibold">
                      🏆
                    </span>
                  </>
                )}
              </div>
              <div className="text-xs">
                <span
                  className={`${tribeColors[player.tribe] || "text-[#BA181B]"} cursor-pointer`}
                  onClick={() => navigateToTribe(player.tribe)}
                >
                  {player.tribe}
                </span>
                <span className="text-[#8B99A4]">
                  {" "}
                  • {player.yoinks} yoinks
                </span>
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
