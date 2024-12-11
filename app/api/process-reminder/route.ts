import { NextResponse } from "next/server";
import { getNotificationTokenForFid } from "../../../lib/kv";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

// Wrap the handler function and export with verification
async function handler(request: Request) {
  const body = await request.json();
  const { reminderId, fid } = body;

  try {
    const notificationToken = await getNotificationTokenForFid(fid);
    if (!notificationToken) {
      return NextResponse.json({ status: "no_token" });
    }

    await fetch("https://api.warpcast.com/v1/frame-notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId: reminderId,
        title: "It's time to Yoink!",
        body: "Your cooldown has expired. Time to yoink the flag!",
        targetUrl: "https://yoink.party/framesV2/",
        tokens: [notificationToken],
      }),
    });

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
