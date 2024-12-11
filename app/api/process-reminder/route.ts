import { NextResponse } from "next/server";
import { getNotificationTokenForFid } from "../../../lib/kv";

export async function POST(request: Request) {
  const body = await request.json();
  const { reminderId, fid } = body;

  try {
    const notificationToken = await getNotificationTokenForFid(fid);
    if (!notificationToken) {
      return new Response(JSON.stringify({ status: "no_token" }), {
        headers: { "Content-Type": "application/json" },
      });
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

    return new Response(JSON.stringify({ status: "sent" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing reminder notification:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
