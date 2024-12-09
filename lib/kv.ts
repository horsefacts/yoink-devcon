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

export const setNotificationTokenForAddress = async (
  address: string,
  token: string,
) => {
  return redis.set(`tokens:${address.toLowerCase()}`, token);
};

export const getNotificationTokenForAddress = async (address: string) => {
  return redis.get<string>(`tokens:${address.toLowerCase()}`);
};

export const setNotificationState = async (
  type: NotificationType,
  id: string,
  state: NotificationState,
  notificationId?: string,
) => {
  const multi = redis.multi();

  multi.set(`notification:state:${id}`, state);

  if (
    type === "reminder" &&
    (state === "sent" || state === "failed" || state === "skipped")
  ) {
    multi.zrem("notification:scheduled_reminders", id);
  }

  if (state === "sent" && notificationId) {
    multi.set(`notification:uuid:${notificationId}`, id);
    multi.expire(`notification:state:${id}`, 60 * 60 * 24 * 30);
  }

  return multi.exec();
};

export const getYoinkIdFromNotificationId = async (notificationId: string) => {
  return redis.get<string>(`notification:uuid:${notificationId}`);
};

export const markNotificationPending = async (
  type: NotificationType,
  id: string,
): Promise<boolean> => {
  const result = await redis.setnx(`notification:state:${id}`, "pending");
  return result === 1;
};

export const scheduleReminder = async (
  address: string,
  sendAt: number,
): Promise<string> => {
  const id = `reminder:${address}:${sendAt}`;

  await redis
    .multi()
    .set(`notification:state:${id}`, "scheduled")
    .zadd("notification:scheduled_reminders", { score: sendAt, member: id })
    .exec();

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

  const reminders: Array<{ id: string; address: string; sendAt: number }> = [];

  for (const id of dueReminders) {
    const state = await redis.get(`notification:state:${id}`);
    if (state === "scheduled") {
      const [_, address, sendAtStr] = id.split(":");
      if (address && sendAtStr) {
        reminders.push({
          id,
          address,
          sendAt: parseInt(sendAtStr),
        });
      }
    }
  }

  return reminders;
};
