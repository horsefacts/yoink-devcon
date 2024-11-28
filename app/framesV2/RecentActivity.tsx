"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";

type YoinkWithUsername = {
  from: string;
  by: string;
  timestamp: number;
};

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
  const [yoinks, setYoinks] = useState<YoinkWithUsername[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentActivity() {
      try {
        const response = await fetch("/api/recent-activity");
        if (!response.ok) {
          throw new Error("Failed to fetch recent activity");
        }
        const data = await response.json();
        setYoinks(data.yoinksWithUsernames);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchRecentActivity();
  }, []);

  if (loading) {
    return <div className="px-3"></div>;
  }

  if (error) {
    return (
      <div className="px-3">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="px-3">
      <div className="text-xs">
        {yoinks.map((yoink, index) => (
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
