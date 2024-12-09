import {
  getLastYoinkedBy,
  getRecentYoinks,
  getTotalYoinks,
} from "../../../lib/contract";
import {
  getCurrentYoinker,
  getNotificationTokenForAddress,
  setCurrentYoinker,
  hasNotificationBeenSent,
  markNotificationAsSent,
} from "../../../lib/kv";
import {
  getUserByAddress,
  getYoinksWithUsernames,
  truncateAddress,
} from "../../../lib/neynar";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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

async function processNotifications(
  recentYoinks: Array<{
    id: string;
    by: string;
    from: string;
    timestamp: number;
  }>,
  recentActivity?: YoinkActivity[],
) {
  try {
    for (const yoink of recentYoinks) {
      const alreadySent = await hasNotificationBeenSent(yoink.id);
      if (alreadySent) continue;

      const notificationToken = await getNotificationTokenForAddress(
        yoink.from,
      );
      if (!notificationToken) continue;

      const yoinkerUsername =
        recentActivity?.find(
          (activity) => activity.by && activity.timestamp === yoink.timestamp,
        )?.by ?? "Someone";

      const notificationId = uuidv4();

      await fetch("https://api.warpcast.com/v1/frame-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
          title: "You've been Yoinked!",
          body: `${yoinkerUsername} yoinked the flag from you. Yoink it back!`,
          targetUrl: "https://yoink.party/framesV2/",
          tokens: [notificationToken],
        }),
      });

      await markNotificationAsSent(yoink.id, notificationId);
    }
  } catch (error) {
    console.error("Error processing notifications:", error);
  }
}

export async function GET() {
  try {
    const [lastYoinkedBy, totalYoinks, recentYoinks] = await Promise.all([
      getLastYoinkedBy(),
      getTotalYoinks(),
      getRecentYoinks(10),
    ]);

    let recentActivity: YoinkActivity[] | undefined;

    try {
      recentActivity = await getYoinksWithUsernames(recentYoinks);
    } catch (error) {
      console.error("Error converting addresses to usernames:", error);
    }

    processNotifications(recentYoinks, recentActivity);

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
