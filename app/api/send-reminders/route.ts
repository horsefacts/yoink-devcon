import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  getNotificationTokenForAddress,
  getScheduledReminders,
  setNotificationState,
} from "../../../lib/kv";

export const dynamic = "force-dynamic";

async function processReminder(reminder: {
  id: string;
  address: string;
  sendAt: number;
}) {
  await setNotificationState("reminder", reminder.id, "pending");

  const notificationToken = await getNotificationTokenForAddress(
    reminder.address,
  );
  if (!notificationToken) {
    await setNotificationState("reminder", reminder.id, "skipped");
    return;
  }

  const notificationId = uuidv4();

  try {
    await fetch("https://api.warpcast.com/v1/frame-notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId,
        title: "It's time to Yoink!",
        body: "Your cooldown has expired. Time to yoink the flag!",
        targetUrl: "https://yoink.party/framesV2/",
        tokens: [notificationToken],
      }),
    });
    await setNotificationState("reminder", reminder.id, "sent", notificationId);
  } catch (error) {
    console.error("Error sending reminder notification:", error);
    await setNotificationState("reminder", reminder.id, "failed");
  }
}

export async function GET() {
  try {
    const reminders = await getScheduledReminders();

    await Promise.all(reminders.map((reminder) => processReminder(reminder)));

    return NextResponse.json({ processed: reminders.length });
  } catch (error) {
    console.error("Error processing reminders:", error);
    return NextResponse.json(
      { error: "Failed to process reminders" },
      { status: 500 },
    );
  }
}
