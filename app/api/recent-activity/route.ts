import { getRecentYoinks } from "../../../lib/contract";
import {
  getCurrentYoinker,
  getNotificationTokenForAddress,
  setCurrentYoinker,
} from "../../../lib/kv";
import { getYoinksWithUsernames } from "../../../lib/neynar";
import { NextResponse } from "next/server";

export type YoinkActivityResponse = {
  from: string;
  by: string;
  timestamp: number;
};

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const latest = await getCurrentYoinker();
    const recentYoinks = await getRecentYoinks(10);

    const notifyYoinkers = recentYoinks.filter(
      (y) => y.timestamp > (latest?.timestamp ?? 0),
    );

    let yoinksWithUsernames:
      | {
          from: string | undefined;
          by: string | undefined;
          timestamp: number;
        }[]
      | undefined;

    try {
      yoinksWithUsernames = await getYoinksWithUsernames(recentYoinks);
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
            const fullyQualifiedYoinker = yoinksWithUsernames
              ? (yoinksWithUsernames[i]?.by ?? "Someone")
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
      console.error("Error fetching recent activity:", error);
      return NextResponse.json(
        { error: "Failed to fetch recent activity" },
        { status: 500 },
      );
    }

    if (yoinksWithUsernames) {
      return NextResponse.json({ yoinksWithUsernames });
    } else {
      return NextResponse.json({ yoinksWithUsernames: recentYoinks });
    }
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity" },
      { status: 500 },
    );
  }
}
