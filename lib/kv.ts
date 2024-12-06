import { kv } from "@vercel/kv";

type Yoinker = { address: string; timestamp: number };

export const setCurrentYoinker = async (address: string, timestamp: number) => {
  await kv.set<string>(
    "current-yoinker",
    JSON.stringify({ address, timestamp }),
  );
};

export const getCurrentYoinker = async () => {
  const current = await kv.get<string>("current-yoinker");
  if (current != null) {
    return JSON.parse(current) as Yoinker;
  }

  return null;
};

export const setNotificationTokenForAddress = async (
  address: string,
  token: string,
) => {
  await kv.set<string>("notification-" + address, token);
};

export const getNotificationTokenForAddress = async (address: string) => {
  return await kv.get<string>("notification-" + address);
};
