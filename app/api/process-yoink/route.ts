import { NextResponse } from "next/server";
import { getNotificationTokenForFid } from "../../../lib/kv";
import { getUserByAddress } from "../../../lib/neynar";

export async function POST(request: Request) {
  const body = await request.json();
  const { yoinkId, from, username } = body;

  try {
    const user = await getUserByAddress(from);
    if (!user?.fid) {
      return new Response(JSON.stringify({ status: "no_fid" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const notificationToken = await getNotificationTokenForFid(user.fid);
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
        notificationId: yoinkId,
        title: "You've been Yoinked!",
        body: `${username} yoinked the flag from you. Yoink it back!`,
        targetUrl: "https://yoink.party/framesV2/",
        tokens: [notificationToken],
      }),
    });

    return new Response(JSON.stringify({ status: "sent" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing yoink notification:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
