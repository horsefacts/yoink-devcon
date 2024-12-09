import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export type NotificationState = "pending" | "sent" | "skipped" | "failed";

export const setNotificationTokenForAddress = async (
  address: string,
  token: string,
) => {
  return redis.set(`tokens:${address.toLowerCase()}`, token);
};

export const getNotificationTokenForAddress = async (address: string) => {
  return redis.get<string>(`tokens:${address}`);
};

export const setNotificationState = async (
  yoinkId: string,
  state: NotificationState,
  notificationId?: string,
) => {
  const multi = redis.multi();

  multi.set(`notification:state:${yoinkId}`, state);

  if (state === "sent" && notificationId) {
    multi.set(`notification:uuid:${notificationId}`, yoinkId);
    multi.expire(`notification:state:${yoinkId}`, 60 * 60 * 24 * 30);
  }

  return multi.exec();
};

export const getYoinkIdFromNotificationId = async (notificationId: string) => {
  return redis.get<string>(`notification:uuid:${notificationId}`);
};

export const markNotificationPending = async (
  yoinkId: string,
): Promise<boolean> => {
  const result = await redis.setnx(`notification:state:${yoinkId}`, "pending");
  return result === 1;
};
