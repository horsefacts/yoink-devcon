"use client";

import Image from "next/image";
import Link from "next/link";
import { useLeaderboard } from "../hooks/api";

export function Leaderboard() {
  const { data: leaderboard } = useLeaderboard();

  return (
    <div className="px-3">
      {leaderboard.map((leader, index) => (
        <Link
          key={leader.address}
          href={`/framesV2/stats?address=${leader.address}`}
          className="flex flex-row justify-between py-2"
        >
          <div className="flex-1 flex flex-row items-center gap-[10px]">
            <div className="flex-shrink-0 w-[38px] h-[38px] rounded-full overflow-hidden bg-gray-200">
              {leader.pfpUrl && (
                <Image
                  src={leader.pfpUrl}
                  className="h-full w-full object-cover object-center"
                  alt={leader.username ?? leader.address}
                  height={38}
                  width={38}
                />
              )}
            </div>
            <div className="flex-shrink min-w-0">
              <div className="font-semibold text-sm leading-5 truncate">
                {leader.username}
              </div>
              <div className="text-xs text-[#8B99A4]">
                {leader.yoinks} {leader.yoinks === 1 ? "yoink" : "yoinks"}
              </div>
            </div>
          </div>
          <div className="flex-none text-[#546473] font-semibold">
            #{index + 1}
          </div>
        </Link>
      ))}
    </div>
  );
}
