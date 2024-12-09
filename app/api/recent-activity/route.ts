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
    const latest = await getCurrentYoinker();
    const notifyYoinkers = recentYoinks.filter(
      (y) => y.timestamp > (latest?.timestamp ?? 0),
    );

    if (!latest || notifyYoinkers.length === 0) {
      return;
    }

    for (let i = 0; i < notifyYoinkers.length; i++) {
      const yoinker = notifyYoinkers[i];
      if (!yoinker) break;

      const alreadySent = await hasNotificationBeenSent(yoinker.id);
      if (alreadySent) continue;

      const notificationToken = await getNotificationTokenForAddress(
        yoinker.from,
      );
      if (notificationToken) {
        const fullyQualifiedYoinker = recentActivity
          ? (recentActivity[i]?.by ?? "Someone")
          : "Someone";

        const res = await fetch(
          "https://api.warpcast.com/v1/frame-notifications",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              notificationId: uuidv4(),
              title: "You've been Yoinked!",
              body: `${fullyQualifiedYoinker} yoinked the flag from you. Yoink it back!`,
              targetUrl: "https://yoink.party/framesV2/",
              tokens: [notificationToken],
            }),
          },
        );

        await markNotificationAsSent(yoinker.id);
      }

      await setCurrentYoinker(yoinker.by, yoinker.timestamp);
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
