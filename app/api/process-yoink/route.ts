import { NextResponse } from "next/server";
import { getNotificationTokenForFid } from "../../../lib/kv";
import { getUserByAddress } from "../../../lib/neynar";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler(request: Request) {
  const body = await request.json();
  const { yoinkId, from, username } = body;

  try {
    const user = await getUserByAddress(from);
    if (!user?.fid) {
      return NextResponse.json({ status: "no_fid" });
    }
    console.log(user);

    const notificationToken = await getNotificationTokenForFid(user.fid);
    if (!notificationToken) {
      return NextResponse.json({ status: "no_token" });
    }

    const res = await fetch("https://api.warpcast.com/v1/frame-notifications", {
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
    console.log(res);

    return NextResponse.json({ status: "sent" });
  } catch (error) {
    console.error("Error processing yoink notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = verifySignatureAppRouter(handler);
