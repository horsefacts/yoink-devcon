"use client";

import Image from "next/image";
import { intervalToDuration, Duration, formatDistance } from "date-fns";

import Flag from "../../public/flag_simple.png";
import FlagAvatar from "../../public/flag.png";
import { TotalYoinks } from "./TotalYoinks";
import { useUserStats } from "../hooks/api";

export function UserHeader(props: {
  address: string;
  hasFlag?: boolean;
  isMe?: boolean;
}) {
  const { data: stats } = useUserStats(props.address);

  if (!stats) {
    return null;
  }

  const duration = formatCustomDuration(
    intervalToDuration({
      start: 0,
      end: Number(stats?.timeHeld ?? 0) * 1000,
    }),
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-row items-center gap-4">
        <div className="relative mb-1">
          <div className="flex object-cover object-center rounded-full h-[64px] w-[64px] bg-gray-200">
            <Image
              src={stats.pfpUrl ?? FlagAvatar}
              alt="pfp"
              className="rounded-full"
              width="64"
              height="64"
            />
          </div>
          {props.hasFlag && (
            <div className="absolute right-0 bottom-0 flex items-center justify-center bg-[#F7F7F7] border border-[#F5F3F4] rounded-full h-[36px] w-[36px]">
              <Image
                src={Flag}
                width={14.772}
                height={19.286}
                alt="yoink flag"
              />
            </div>
          )}
        </div>
        {props.hasFlag ? (
          <div className="text-lg text-[#BA181B] font-semibold">
            {props.isMe
              ? "You have the flag"
              : `${stats.username} has the flag`}
          </div>
        ) : (
          (() => {
            if (stats.lastYoinkedAt === 0n) {
              return (
                <div className="text-lg text-[#BA181B] font-semibold">
                  {stats.username} has never held the flag
                </div>
              );
            }
            return (
              <div className="text-lg text-[#BA181B] font-semibold">
                Last had the flag{" "}
                {formatDistance(
                  new Date(Number(stats.lastYoinkedAt) * 1000),
                  new Date(),
                  { addSuffix: true },
                )}
              </div>
            );
          })()
        )}
      </div>
      <div className="p-[11px] grid grid-cols-2 border border-[#DBDBDB] rounded-lg">
        <div className="flex flex-col items-center border-r border-[#DBDBDB]">
          <div className="text-lg font-semibold">{stats.yoinks.toString()}</div>
          <div className="text-xs text-[#8B99A4]">Yoinks</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-lg font-semibold">{duration}</div>
          <div className="text-xs text-[#8B99A4]">Time held</div>
        </div>
      </div>
    </div>
  );
}

function formatCustomDuration(duration: Duration) {
  const comps = [];
  if (duration.years) {
    comps.push(`${duration.years}y`);
  }
  if (duration.months) {
    comps.push(`${duration.weeks}mo`);
  }
  if (duration.weeks) {
    comps.push(`${duration.weeks}w`);
  }
  if (duration.days) {
    comps.push(`${duration.days}d`);
  }
  if (duration.hours) {
    comps.push(`${duration.hours}h`);
  }
  if (duration.minutes) {
    comps.push(`${duration.minutes}m`);
  }

  comps.push(`${duration.seconds ?? 0}s`);

  return comps.join(" ");
}
