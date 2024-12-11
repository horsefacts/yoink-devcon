import {
  getLastYoinkedBy,
  getRecentYoinks,
  getTotalYoinks,
} from "../../../lib/contract";
import {
  getUserByAddress,
  getYoinksWithUsernames,
  truncateAddress,
} from "../../../lib/neynar";
import { NextResponse } from "next/server";
import { queueMessage } from "../../../lib/queue";

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
      const username =
        recentActivity?.find(
          (activity) => activity.by && activity.timestamp === yoink.timestamp,
        )?.by ?? "Someone";

      const yoinkId = `yoink:${yoink.id}`;
      const res = await queueMessage({
        messageId: yoinkId,
        url: "api/process-yoink",
        body: {
          yoinkId,
          from: yoink.from,
          by: yoink.by,
          username,
        },
      });
      console.log(res);
    }
  } catch (error) {
    console.error("Error queueing notifications:", error);
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
