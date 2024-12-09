"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { useRecentActivity } from "../hooks/api";

function formatTimeAgo(timestamp: number): string {
  const formatted = formatDistanceToNowStrict(new Date(timestamp * 1000))
    .replace(" seconds", "s")
    .replace(" second", "s")
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" months", "mo")
    .replace(" month", "mo")
    .replace(" years", "y")
    .replace(" year", "y");

  return `${formatted} ago`;
}

export function RecentActivity() {
  const { data: recentActivity } = useRecentActivity();

  if (!recentActivity?.length) {
    return null;
  }

  return (
    <div className="px-3 w-full">
      <div className="text-xs">
        {recentActivity.map((yoink, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-between py-1"
          >
            <div className="flex-1 min-w-0 mr-2">
              <div className="truncate">
                <span className="font-semibold">{yoink.by}</span>
                <span className="text-[#8B99A4]"> yoinked from </span>
                <span className="font-semibold">{yoink.from}</span>
              </div>
            </div>
            <div className="flex-shrink-0 text-[#8B99A4]">
              {formatTimeAgo(yoink.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
