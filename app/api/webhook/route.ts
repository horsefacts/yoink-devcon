import {
  eventHeaderSchema,
  eventPayloadSchema,
  eventSchema,
} from "@farcaster/frame-sdk";
import { NextRequest } from "next/server";
import {
  setNotificationTokenForFid,
  deleteNotificationTokenForFid,
} from "../../../lib/kv";

export async function POST(request: NextRequest) {
  const requestJson = await request.json();

  const requestBody = eventSchema.safeParse(requestJson);

  if (requestBody.success === false) {
    return Response.json(
      { success: false, errors: requestBody.error.errors },
      { status: 400 },
    );
  }

  // TODO: verify signature

  const headerData = JSON.parse(
    Buffer.from(requestBody.data.header, "base64url").toString("utf-8"),
  );
  const header = eventHeaderSchema.safeParse(headerData);
  if (header.success === false) {
    return Response.json(
      { success: false, errors: header.error.errors },
      { status: 400 },
    );
  }
  const fid = header.data.fid;

  const payloadData = JSON.parse(
    Buffer.from(requestBody.data.payload, "base64url").toString("utf-8"),
  );
  const payload = eventPayloadSchema.safeParse(payloadData);

  if (payload.success === false) {
    return Response.json(
      { success: false, errors: payload.error.errors },
      { status: 400 },
    );
  }

  try {
    switch (payload.data.event) {
      case "frame-added":
        if (payload.data.notificationDetails) {
          await setNotificationTokenForFid(
            fid,
            payload.data.notificationDetails.token,
          );
          console.log(
            `Saved notification token for fid ${fid}: ${payload.data.notificationDetails.token}`,
          );
        }
        break;

      case "frame-removed":
        await deleteNotificationTokenForFid(fid);
        console.log(`Removed notification token for fid ${fid}`);
        break;

      case "notifications-enabled":
        await setNotificationTokenForFid(
          fid,
          payload.data.notificationDetails.token,
        );
        console.log(
          `Updated notification token for fid ${fid}: ${payload.data.notificationDetails.token}`,
        );
        break;

      case "notifications-disabled":
        await deleteNotificationTokenForFid(fid);
        console.log(`Disabled notifications for fid ${fid}`);
        break;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
