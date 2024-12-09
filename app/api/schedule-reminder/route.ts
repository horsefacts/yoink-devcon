import { NextRequest, NextResponse } from "next/server";
import { scheduleReminder } from "../../../lib/kv";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, timeLeft } = body;

    if (!address || typeof timeLeft !== "number") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const sendAt = Math.floor(Date.now() / 1000) + timeLeft;
    await scheduleReminder(address, sendAt);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error scheduling reminder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}