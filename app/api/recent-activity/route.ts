import {
  getLastYoinkedBy,
  getRecentYoinks,
  getTotalYoinks,
} from "../../../lib/contract";
import {
  getCurrentYoinker,
  getNotificationTokenForAddress,
  setCurrentYoinker,
} from "../../../lib/kv";
import {
  getUserByAddress,
  getYoinksWithUsernames,
  truncateAddress,
} from "../../../lib/neynar";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export type YoinkActivity = {
  from: string;
  by: string;
  timestamp: number;
};

export type YoinkDataResponse = {
  lastYoinkedBy: string;
  pfpUrl?: string;
  totalYoinks: string;
  recentActivity?: YoinkActivity[];
};

export async function GET() {
  try {
    const [lastYoinkedBy, totalYoinks, recentYoinks] = await Promise.all([
      getLastYoinkedBy(),
      getTotalYoinks(),
      getRecentYoinks(10),
    ]);

    const latest = await getCurrentYoinker();
    const notifyYoinkers = recentYoinks.filter(
      (y) => y.timestamp > (latest?.timestamp ?? 0),
    );

    let recentActivity:
      | {
          from: string;
          by: string;
          timestamp: number;
        }[]
      | undefined;

    try {
      recentActivity = await getYoinksWithUsernames(recentYoinks);
    } catch (error) {
      console.error("Error converting addresses to usernames:", error);
    }

    try {
      if (latest && notifyYoinkers.length > 0) {
        for (let i = 0; i < notifyYoinkers.length; i++) {
          const yoinker = notifyYoinkers[i];
          if (!yoinker) break;

          await setCurrentYoinker(yoinker.by, yoinker.timestamp);
          const notificationToken = await getNotificationTokenForAddress(
            yoinker.from,
          );
          if (notificationToken) {
            const fullyQualifiedYoinker = recentActivity
              ? (recentActivity[i]?.by ?? "Someone")
              : "Someone";
            const response = await fetch(
              "https://api.warpcast.com/v1/frame-notifications",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  notificationId: crypto.randomUUID(),
                  title: "You've been Yoinked!",
                  body: `${fullyQualifiedYoinker} yoinked the flag from you. Yoink it back!`,
                  targetUrl: "https://yoink.party/framesV2/",
                  tokens: [notificationToken],
                }),
              },
            );
          }
        }
      }
    } catch (error) {
      console.error("Error processing notifications:", error);
    }

    const user = await getUserByAddress(lastYoinkedBy);
    const username = user ? user.username : truncateAddress(lastYoinkedBy);
    const pfp = user?.pfp_url;

    return NextResponse.json({
      lastYoinkedBy: username,
      pfpUrl: pfp,
      totalYoinks: totalYoinks.toLocaleString(),
      recentActivity,
    });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity" },
      { status: 500 },
    );
  }
}
