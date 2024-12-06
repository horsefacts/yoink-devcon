import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

type Yoinker = { address: string; timestamp: number };

export const setCurrentYoinker = async (address: string, timestamp: number) => {
  await redis.set("current-yoinker", JSON.stringify({ address, timestamp }));
};

export const getCurrentYoinker = async () => {
  const current = await redis.get<string>("current-yoinker");
  if (current != null) {
    return JSON.parse(current) as Yoinker;
  }

  return null;
};

export const setNotificationTokenForAddress = async (
  address: string,
  token: string,
) => {
  await redis.set("notification-" + address, token);
};

export const getNotificationTokenForAddress = async (address: string) => {
  return await redis.get<string>("notification-" + address);
};
