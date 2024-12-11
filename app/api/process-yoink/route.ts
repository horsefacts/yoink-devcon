import { NextResponse } from "next/server";
import { getNotificationTokenForFid } from "../../../lib/kv";
import { getUserByAddress } from "../../../lib/neynar";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { v4 as uuidv4 } from "uuid";

async function handler(request: Request) {
  const body = await request.json();
  const { yoinkId, from, username } = body;

  try {
    const user = await getUserByAddress(from);
    if (!user?.fid) {
      return NextResponse.json({ status: "no_fid" });
    }
    const fid = user?.fid;

    const notificationToken = await getNotificationTokenForFid(user.fid);
    if (!notificationToken) {
      return NextResponse.json({ status: "no_token" });
    }

    const body = {
      notificationId: yoinkId,
      title: "You've been Yoinked!",
      body: `${username} yoinked the flag from you. Yoink it back!`,
      targetUrl: "https://yoink.party/framesV2/",
      tokens: [notificationToken],
    };
    const response = await fetch(
      "https://api.warpcast.com/v1/frame-notifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (response.status === 429) {
      throw new Error("Rate limited by Warpcast API");
    }

    if (!response.ok) {
      throw new Error(`Warpcast API error: ${response.status}`);
    }
    console.log(`Delivered yoink to fid ${fid}:`, body);

    return NextResponse.json({ status: "sent" });
  } catch (error) {
    console.error("Error processing yoink notification:", error);
    // Return 500 to trigger QStash retry
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = verifySignatureAppRouter(handler);
