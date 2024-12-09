import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export type NotificationType = "yoink" | "reminder";
export type NotificationState =
  | "scheduled" // Scheduled reminder
  | "pending" // In process
  | "sent" // Delivered
  | "skipped" // No notification token
  | "failed"; // Delivery failed

type ReminderId = `reminder:${string}:${string}`;
type YoinkId = `yoink:${string}`;
type NotificationId = ReminderId | YoinkId;

export const setNotificationTokenForFid = async (
  fid: number,
  token: string,
) => {
  return redis.set(`tokens:fid:${fid}`, token);
};

export const getNotificationTokenForFid = async (fid: number) => {
  return redis.get<string>(`tokens:fid:${fid}`);
};

export const setNotificationState = async (
  type: NotificationType,
  id: string,
  state: NotificationState,
  apiUUID?: string,
) => {
  const notificationId =
    type === "yoink"
      ? (`yoink:${id}` as YoinkId)
      : (`reminder:${id}` as ReminderId);

  const multi = redis.multi();

  multi.set(`notification:${type}:state:${notificationId}`, state);

  if (
    type === "reminder" &&
    (state === "sent" || state === "failed" || state === "skipped")
  ) {
    multi.zrem("notification:scheduled_reminders", notificationId);
  }

  if (state === "sent" && apiUUID) {
    multi.set(`notification:${type}:uuid:${apiUUID}`, notificationId);
    multi.expire(
      `notification:${type}:state:${notificationId}`,
      60 * 60 * 24 * 30,
    );
  }

  return multi.exec();
};

export const getYoinkIdFromApiUUID = async (apiUUID: string) => {
  return redis.get<string>(`notification:yoink:uuid:${apiUUID}`);
};

export const markNotificationPending = async (
  type: NotificationType,
  id: string,
): Promise<boolean> => {
  const notificationId =
    type === "yoink"
      ? (`yoink:${id}` as YoinkId)
      : (`reminder:${id}` as ReminderId);

  const result = await redis.setnx(
    `notification:${type}:state:${notificationId}`,
    "pending",
  );
  return result === 1;
};

export const scheduleReminder = async (
  fid: number,
  sendAt: number,
): Promise<string> => {
  const existingReminders = await redis.zrange<ReminderId[]>(
    "notification:scheduled_reminders",
    "-inf",
    "+inf",
    {
      byScore: true,
    },
  );

  const existingReminder = existingReminders.find((id) => {
    const [_, reminderFid] = id.split(":");
    return reminderFid === fid.toString();
  });

  const multi = redis.multi();
  const id = `reminder:${fid}:${sendAt}`;

  if (existingReminder) {
    multi
      .del(`notification:reminder:state:${existingReminder}`)
      .zrem("notification:scheduled_reminders", existingReminder);
  }

  multi
    .set(`notification:reminder:state:${id}`, "scheduled")
    .zadd("notification:scheduled_reminders", { score: sendAt, member: id });

  await multi.exec();

  return id;
};

export const getScheduledReminders = async () => {
  const now = Math.floor(Date.now() / 1000);

  const dueReminders = await redis.zrange<ReminderId[]>(
    "notification:scheduled_reminders",
    0,
    now,
    {
      byScore: true,
    },
  );

  const reminders: Array<{ id: string; fid: number; sendAt: number }> = [];

  for (const id of dueReminders) {
    const state = await redis.get(`notification:reminder:state:${id}`);
    if (state === "scheduled") {
      const [_, fid, sendAtStr] = id.split(":");
      if (fid && sendAtStr) {
        reminders.push({
          id,
          fid: parseInt(fid),
          sendAt: parseInt(sendAtStr),
        });
      }
    }
  }

  return reminders;
};
