import {
  getLastYoinkedBy,
  getRecentYoinks,
  getTotalYoinks,
} from "../../../lib/contract";
import {
  setNotificationState,
  markNotificationPending,
  getNotificationTokenForFid,
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
      const acquired = await markNotificationPending("yoink", yoink.id);
      if (!acquired) continue;

      const user = await getUserByAddress(yoink.from);
      if (!user?.fid) {
        await setNotificationState("yoink", yoink.id, "skipped");
        continue;
      }

      const notificationToken = await getNotificationTokenForFid(user.fid);
      if (!notificationToken) {
        await setNotificationState("yoink", yoink.id, "skipped");
        continue;
      }

      const username =
        recentActivity?.find(
          (activity) => activity.by && activity.timestamp === yoink.timestamp,
        )?.by ?? "Someone";

      const apiUUID = uuidv4();

      try {
        await fetch("https://api.warpcast.com/v1/frame-notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notificationId: apiUUID,
            title: "You've been Yoinked!",
            body: `${username} yoinked the flag from you. Yoink it back!`,
            targetUrl: "https://yoink.party/framesV2/",
            tokens: [notificationToken],
          }),
        });
        await setNotificationState("yoink", yoink.id, "sent", apiUUID);
      } catch (error) {
        console.error("Error sending notification:", error);
        await setNotificationState("yoink", yoink.id, "failed");
      }
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
