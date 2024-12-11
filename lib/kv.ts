import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const setNotificationTokenForFid = async (
  fid: number,
  token: string,
) => {
  return redis.set(`tokens:fid:${fid}`, token);
};

export const getNotificationTokenForFid = async (fid: number) => {
  return redis.get<string>(`tokens:fid:${fid}`);
};

export const deleteNotificationTokenForFid = async (fid: number) => {
  return redis.del(`tokens:fid:${fid}`);
};

export const getLastProcessedYoinkId = async () => {
  return redis.get<string>("notifications:last_yoink");
};

export const setLastProcessedYoinkId = async (id: string) => {
  return redis.set("notifications:last_yoink", id);
};
