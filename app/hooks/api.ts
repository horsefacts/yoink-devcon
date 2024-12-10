import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { UserStatsResponse } from "../api/user-stats/route";
import { TotalYoinksResponse } from "../api/total-yoinks/route";
import { LeaderboardEntryWithUserData } from "../../lib/contract";
import { YoinkActivity, YoinkDataResponse } from "../api/recent-activity/route";

export function useUserStats(address: string) {
  return useSuspenseQuery({
    queryKey: ["user-stats", address],
    queryFn: async () => {
      const response = await fetch(`/api/user-stats?address=${address}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user stats");
      }
      return response.json() as Promise<UserStatsResponse>;
    },
  });
}

export function useTotalYoinks() {
  return useSuspenseQuery({
    queryKey: ["total-yoinks"],
    queryFn: async () => {
      const response = await fetch("/api/total-yoinks", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch total yoinks");
      }
      return response.json() as Promise<TotalYoinksResponse>;
    },
  });
}

export function useLeaderboard() {
  return useSuspenseQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await fetch("/api/leaderboard", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      return response.json() as Promise<LeaderboardEntryWithUserData[]>;
    },
  });
}

export function useRecentActivity() {
  return useSuspenseQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const response = await fetch("/api/recent-activity", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch recent activity");
      }
      const data = await response.json();
      return data.recentActivity as YoinkActivity[];
    },
  });
}

export function useYoinkData() {
  return useSuspenseQuery({
    queryKey: ["yoink-data"],
    queryFn: async () => {
      const response = await fetch("/api/recent-activity", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch yoink data");
      }
      return response.json() as Promise<YoinkDataResponse>;
    },
  });
}

export function useNotificationToken({ fid }: { fid?: number }) {
  return useQuery({
    queryKey: ["notification-token"],
    queryFn: async () => {
      const res = await fetch(`/api/has-notification-token?fid=${fid}`);
      return res.json();
    },
    enabled: !!fid,
  });
}

export function useRankings(address: string) {
  return useSuspenseQuery({
    queryKey: ["rankings", address],
    queryFn: async () => {
      const response = await fetch(`/api/rankings?address=${address}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch rankings");
      }
      return response.json();
    },
  });
}
