import {
  encodedJsonFarcasterSignatureSchema,
  jsonFarcasterSignatureHeaderSchema,
  serverEventSchema,
} from "@farcaster/frame-sdk";
import { NextRequest } from "next/server";
import { ed25519 } from "@noble/curves/ed25519";
import {
  setNotificationTokenForFid,
  deleteNotificationTokenForFid,
} from "../../../lib/kv";
import { createPublicClient, http, Hex } from "viem";
import { optimism } from "viem/chains";
import { KEY_REGISTRY_ADDRESS, keyRegistryABI } from "@farcaster/core";

export async function POST(request: NextRequest) {
  const requestJson = await request.json();

  const requestBody =
    encodedJsonFarcasterSignatureSchema.safeParse(requestJson);

  if (requestBody.success === false) {
    return Response.json(
      { success: false, errors: requestBody.error.errors },
      { status: 400 },
    );
  }

  const headerData = JSON.parse(
    Buffer.from(requestBody.data.header, "base64url").toString("utf-8"),
  );
  const header = jsonFarcasterSignatureHeaderSchema.safeParse(headerData);
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
  const payload = serverEventSchema.safeParse(payloadData);

  if (payload.success === false) {
    return Response.json(
      { success: false, errors: payload.error.errors },
      { status: 400 },
    );
  }

  // Verify signature
  const signedInput = new Uint8Array(
    Buffer.from(requestBody.data.header + "." + requestBody.data.payload),
  );
  const signature = new Uint8Array(
    Buffer.from(requestBody.data.signature, "base64url"),
  );
  const verifyResult = ed25519.verify(
    signature,
    signedInput,
    header.data.key.slice(2),
  );

  if (!verifyResult) {
    return Response.json(
      { success: false, errors: ["Invalid signature"] },
      { status: 400 },
    );
  }

  // Verify key is registered in KeyRegistry contract
  const optimismClient = createPublicClient({
    chain: optimism,
    transport: http("https://mainnet.optimism.io"),
  });

  try {
    const keyData = await optimismClient.readContract({
      address: KEY_REGISTRY_ADDRESS,
      abi: keyRegistryABI,
      functionName: "keyDataOf",
      args: [BigInt(fid), header.data.key as Hex],
    });

    if (!keyData || keyData.keyType !== 1 || keyData.state !== 1) {
      return Response.json(
        { success: false, errors: ["Invalid signer key"] },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error verifying key in registry:", error);
    return Response.json(
      { success: false, error: "Failed to verify signer key" },
      { status: 500 },
    );
  }

  try {
    switch (payload.data.event) {
      case "frame_added":
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

      case "frame_removed":
        await deleteNotificationTokenForFid(fid);
        console.log(`Removed notification token for fid ${fid}`);
        break;

      case "notifications_enabled":
        await setNotificationTokenForFid(
          fid,
          payload.data.notificationDetails.token,
        );
        console.log(
          `Updated notification token for fid ${fid}: ${payload.data.notificationDetails.token}`,
        );
        break;

      case "notifications_disabled":
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
