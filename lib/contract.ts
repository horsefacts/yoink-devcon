import { createPublicClient, http, type Address } from "viem";
import { base } from "viem/chains";
import { client, truncateAddress } from "./neynar";
import { abi, YOINK_ADDRESS } from "./constants";

export const publicClient = createPublicClient({
  chain: base,
  transport: http(
    process.env.NEXT_PUBLIC_ALCHEMY_RPC ?? "https://mainnet.base.org",
  ),
});

export const getLastYoinkedBy = () => {
  return publicClient.readContract({
    address: YOINK_ADDRESS,
    abi: abi,
    functionName: "lastYoinkedBy",
  });
};

export const getTotalYoinks = async () => {
  return publicClient.readContract({
    address: YOINK_ADDRESS,
    abi: abi,
    functionName: "totalYoinks",
  });
};

export type ScoreByAddressResult = {
  yoinks: bigint;
  time: bigint;
  lastYoinkedAt: bigint;
};

export const getScoreByAddress = (address: Address) => {
  return publicClient.readContract({
    address: YOINK_ADDRESS,
    abi: abi,
    functionName: "score",
    args: [address],
  });
};

export const simulateYoink = (address: Address) => {
  return publicClient.simulateContract({
    address: YOINK_ADDRESS,
    abi: abi,
    functionName: "yoink",
    account: address,
  });
};

type YoinkEvent = {
  id: string;
  by: string;
  from: string;
  timestamp: number;
};

export const getIndexerYoinks = async (): Promise<YoinkEvent[]> => {
  const response = await fetch(
    "https://yoink-indexer-production.up.railway.app/recent",
    { cache: "no-store" },
  );
  return response.json();
};

export const processRecentYoinks = (
  events: YoinkEvent[],
  count: number = 10,
) => {
  return events.slice(0, count).map((event) => ({
    id: event.id,
    by: event.by as Address,
    from: event.from as Address,
    timestamp: event.timestamp,
  }));
};

export const getRecentYoinks = async (count: number = 10) => {
  const events = await getIndexerYoinks();
  return processRecentYoinks(events, count);
};

export type LeaderboardEntry = {
  address: string;
  yoinks: number;
};

export type LeaderboardEntryWithUserData = {
  address: string;
  yoinks: number;
  username?: string;
  pfpUrl?: string;
};

export type LeaderboardResult = LeaderboardEntryWithUserData[];

export const getLeaderboard = async (count: number = 5) => {
  const response = await fetch(
    "https://yoink-indexer-production.up.railway.app/leaderboard",
    {
      cache: "no-store",
    },
  );
  const leaderboard: LeaderboardEntry[] = await response.json();

  const topEntries = leaderboard.slice(0, count);

  const addressesToLookup = topEntries.map((entry) => entry.address);
  const users = await client.fetchBulkUsersByEthereumAddress(addressesToLookup);

  return topEntries.map((entry) => {
    const userData = users[entry.address.toLowerCase()];
    const username =
      userData && userData[0]
        ? userData[0].username
        : truncateAddress(entry.address);
    return {
      ...entry,
      username: username,
      pfpUrl: userData && userData[0] && userData[0].pfp_url,
    };
  });
};

export const getRecentYoinkers = async (
  count: number = 5,
): Promise<LeaderboardResult> => {
  const events = await getIndexerYoinks();
  const recentYoinks = processRecentYoinks(events, count);

  const yoinkCounts = new Map<string, number>();
  recentYoinks.forEach((yoink) => {
    const byCount = yoinkCounts.get(yoink.by) || 0;
    yoinkCounts.set(yoink.by, byCount + 1);
  });

  const entries: LeaderboardEntry[] = Array.from(yoinkCounts.entries()).map(
    ([address, yoinks]) => ({
      address,
      yoinks,
    }),
  );

  entries.sort((a, b) => b.yoinks - a.yoinks);

  const addressesToLookup = entries.map((entry) => entry.address);
  const users = await client.fetchBulkUsersByEthereumAddress(addressesToLookup);

  return entries.map((entry) => {
    const userData = users[entry.address.toLowerCase()];
    const username =
      userData && userData[0]
        ? userData[0].username
        : truncateAddress(entry.address);
    return {
      ...entry,
      username: username,
      pfpUrl: userData && userData[0] && userData[0].pfp_url,
    };
  });
};

export type RankingResponse = {
  targetRank: number;
  rankings: {
    rank: number;
    address: string;
    yoinks: number;
  }[];
};

export const getAddressRankings = async (
  address: string,
): Promise<RankingResponse> => {
  const response = await fetch(
    `https://yoink-indexer-production.up.railway.app/leaderboard/${address}`,
    {
      cache: "no-store",
    },
  );
  return response.json();
};
