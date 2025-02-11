import { NeynarAPIClient } from "@neynar/nodejs-sdk";

export const client = new NeynarAPIClient(
  process.env.NEYNAR_API_KEY ?? "NEYNAR_API_DOCS",
);

export const getUserByAddress = async (address: string) => {
  try {
    const user = await client.fetchBulkUsersByEthereumAddress([address]);
    const userData = user[address.toLowerCase()];
    if (userData) {
      return userData[0];
    }
  } catch {
    return undefined;
  }
};

type YoinkInput = {
  from: string;
  by: string;
  timestamp: number;
};

type YoinkWithUsername = {
  from: string;
  by: string;
  timestamp: number;
};

export const getYoinksWithUsernames = async (
  yoinks: YoinkInput[],
): Promise<YoinkWithUsername[]> => {
  const uniqueAddresses = [
    ...new Set(yoinks.flatMap((yoink) => [yoink.from, yoink.by])),
  ];
  if (yoinks.length === 0) {
    return [];
  }

  const users = await client.fetchBulkUsersByEthereumAddress(uniqueAddresses);

  const addressToUsername: Record<string, string> = Object.fromEntries(
    uniqueAddresses.map((address) => {
      const userData = users[address.toLowerCase()] ?? [];
      let username;
      if (userData.length > 1) {
        const user = userData.find((v) => !v.username.startsWith("!"));
        username = user?.username;
      } else if (userData.length == 1) {
        username = userData[0]?.username;
      }
      username = username ?? truncateAddress(address);
      return [address, username];
    }),
  );

  return yoinks.map((yoink) => ({
    from: addressToUsername[yoink.from] ?? "Someone",
    by: addressToUsername[yoink.by] ?? "Someone",
    timestamp: yoink.timestamp,
  }));
};

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
};
