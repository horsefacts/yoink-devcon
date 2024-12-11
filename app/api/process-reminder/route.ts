import { NextResponse } from "next/server";
import { getNotificationTokenForFid } from "../../../lib/kv";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { v4 as uuidv4 } from "uuid";

async function handler(request: Request) {
  const body = await request.json();
  const { reminderId, fid } = body;

  try {
    const notificationToken = await getNotificationTokenForFid(fid);
    if (!notificationToken) {
      return NextResponse.json({ status: "no_token" });
    }

    const response = await fetch(
      "https://api.warpcast.com/v1/frame-notifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId: uuidv4(),
          title: "It's time to Yoink!",
          body: "Your cooldown has expired. Time to yoink the flag!",
          targetUrl: "https://yoink.party/framesV2/",
          tokens: [notificationToken],
        }),
      },
    );

    if (response.status === 429) {
      throw new Error("Rate limited by Warpcast API");
    }

    if (!response.ok) {
      throw new Error(`Warpcast API error: ${response.status}`);
    }

    return NextResponse.json({ status: "sent" });
  } catch (error) {
    console.error("Error processing reminder notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = verifySignatureAppRouter(handler);
