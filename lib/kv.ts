import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

type Yoinker = { address: string; timestamp: number };

export const setCurrentYoinker = async (address: string, timestamp: number) => {
  return redis.set("current-yoinker", JSON.stringify({ address, timestamp }));
};

export const getCurrentYoinker = async () => {
  const current = await redis.get<Yoinker>("current-yoinker");
  if (current != null) {
    return current;
  }

  return null;
};

export const setNotificationTokenForAddress = async (
  address: string,
  token: string,
) => {
  return redis.set(`tokens:${address.toLowerCase()}`, token);
};

export const getNotificationTokenForAddress = async (address: string) => {
  return redis.get<string>(`tokens:${address}`);
};

export const hasNotificationBeenSent = async (yoinkId: string) => {
  return redis.get<boolean>(`sent:${yoinkId}`);
};

export const markNotificationAsSent = async (
  yoinkId: string,
  notificationId: string,
) => {
  return redis
    .multi()
    .set(`sent:${yoinkId}`, true, { ex: 60 * 60 * 24 * 30 })
    .set(`notification:${notificationId}`, yoinkId)
    .exec();
};

export const getYoinkIdFromNotificationId = async (notificationId: string) => {
  return redis.get<string>(`notification:${notificationId}`);
};
