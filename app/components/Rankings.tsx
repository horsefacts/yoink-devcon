"use client";

import Image from "next/image";
import Link from "next/link";
import { useRankings } from "../hooks/api";
import FlagAvatar from "../../public/flag.png";

interface Ranking {
  rank: number;
  address: string;
  username: string;
  pfpUrl?: string;
  yoinks: number;
}

export function Rankings({ address }: { address: string }) {
  const { data: rankings } = useRankings(address);

  return (
    <div className="px-3">
      {rankings.rankings.map((rank: Ranking) => {
        const isTarget = rank.rank === rankings.targetRank;

        return (
          <Link
            key={rank.address}
            href={`/framesV2/stats?address=${rank.address}`}
            className={`flex flex-row justify-between py-2 ${
              isTarget
                ? "bg-[#FDE8E9] -mx-3 px-3 border-y border-[#F9D0D3]"
                : ""
            }`}
          >
            <div className="flex-1 flex flex-row items-center gap-[10px]">
              <div className="flex-shrink-0 w-[38px] h-[38px] rounded-full overflow-hidden bg-gray-200">
                {rank.pfpUrl ? (
                  <Image
                    src={rank.pfpUrl}
                    className="h-full w-full object-cover object-center"
                    alt={rank.username ?? rank.address}
                    height={38}
                    width={38}
                  />
                ) : (
                  <Image
                    src={FlagAvatar}
                    className="h-full w-full object-cover"
                    alt="default avatar"
                    height={38}
                    width={38}
                  />
                )}
              </div>
              <div className="flex-shrink min-w-0">
                <div
                  className={`font-semibold text-sm leading-5 truncate ${
                    isTarget ? "text-[#BA181B]" : ""
                  }`}
                >
                  {rank.username}
                </div>
                <div className="text-xs text-[#8B99A4]">
                  {rank.yoinks} yoinks
                </div>
              </div>
            </div>
            <div className="flex-none text-[#546473] font-semibold">
              #{rank.rank}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
