import { NextResponse } from "next/server";
import { getNotificationTokenForFid } from "../../../lib/kv";
import { getUserByAddress } from "../../../lib/neynar";

export async function POST(request: Request) {
  const body = await request.json();
  const { yoinkId, from, username } = body;

  try {
    const user = await getUserByAddress(from);
    if (!user?.fid) {
      return NextResponse.json({ status: "no_fid" });
    }

    const notificationToken = await getNotificationTokenForFid(user.fid);
    if (!notificationToken) {
      return NextResponse.json({ status: "no_token" });
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

    return NextResponse.json({ status: "sent" });
  } catch (error) {
    console.error("Error processing yoink notification:", error);
    throw error;
  }
}
