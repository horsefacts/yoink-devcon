import { createPublicClient, http, type Address } from "viem";
import { base } from "viem/chains";
import { client, truncateAddress } from "./neynar";

export const publicClient = createPublicClient({
  chain: base,
  transport: http(
    process.env.NEXT_PUBLIC_ALCHEMY_RPC ?? "https://mainnet.base.org",
  ),
});

export const abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "AccountBalanceOverflow", type: "error" },
  { inputs: [], name: "ArrayLengthsMismatch", type: "error" },
  { inputs: [], name: "InsufficientBalance", type: "error" },
  { inputs: [], name: "NotOwnerNorApproved", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "timeRemaining", type: "uint256" },
    ],
    name: "SlowDown",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToNonERC1155ReceiverImplementer",
    type: "error",
  },
  { inputs: [], name: "TransferToZeroAddress", type: "error" },
  { inputs: [], name: "Unauthorized", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isApproved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "value", type: "string" },
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "URI",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "by", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "timeHeld",
        type: "uint256",
      },
    ],
    name: "Yoinked",
    type: "event",
  },
  {
    inputs: [],
    name: "COOLDOWN",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "FLAG_ID",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TROPHY_ID",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "owners", type: "address[]" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    ],
    name: "balanceOfBatch",
    outputs: [
      { internalType: "uint256[]", name: "balances", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      {
        components: [
          { internalType: "uint256", name: "yoinks", type: "uint256" },
          { internalType: "uint256", name: "time", type: "uint256" },
          { internalType: "uint256", name: "lastYoinkedAt", type: "uint256" },
        ],
        internalType: "struct Score",
        name: "holderScore",
        type: "tuple",
      },
    ],
    name: "generateFlagJSON",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      {
        components: [
          { internalType: "uint256", name: "yoinks", type: "uint256" },
          { internalType: "uint256", name: "time", type: "uint256" },
          { internalType: "uint256", name: "lastYoinkedAt", type: "uint256" },
        ],
        internalType: "struct Score",
        name: "holderScore",
        type: "tuple",
      },
    ],
    name: "generateFlagSVG",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      {
        components: [
          { internalType: "uint256", name: "yoinks", type: "uint256" },
          { internalType: "uint256", name: "time", type: "uint256" },
          { internalType: "uint256", name: "lastYoinkedAt", type: "uint256" },
        ],
        internalType: "struct Score",
        name: "holderScore",
        type: "tuple",
      },
    ],
    name: "generateScoreJSON",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      {
        components: [
          { internalType: "uint256", name: "yoinks", type: "uint256" },
          { internalType: "uint256", name: "time", type: "uint256" },
          { internalType: "uint256", name: "lastYoinkedAt", type: "uint256" },
        ],
        internalType: "struct Score",
        name: "holderScore",
        type: "tuple",
      },
    ],
    name: "generateScoreSVG",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      {
        components: [
          { internalType: "uint256", name: "yoinks", type: "uint256" },
          { internalType: "uint256", name: "time", type: "uint256" },
          { internalType: "uint256", name: "lastYoinkedAt", type: "uint256" },
        ],
        internalType: "struct Score",
        name: "holderScore",
        type: "tuple",
      },
    ],
    name: "generateTrophyJSON",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      {
        components: [
          { internalType: "uint256", name: "yoinks", type: "uint256" },
          { internalType: "uint256", name: "time", type: "uint256" },
          { internalType: "uint256", name: "lastYoinkedAt", type: "uint256" },
        ],
        internalType: "struct Score",
        name: "holderScore",
        type: "tuple",
      },
    ],
    name: "generateTrophySVG",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "result", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastYoinkedAt",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastYoinkedBy",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mostYoinks",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "yoinker", type: "address" }],
    name: "score",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "yoinks", type: "uint256" },
          { internalType: "uint256", name: "time", type: "uint256" },
          { internalType: "uint256", name: "lastYoinkedAt", type: "uint256" },
        ],
        internalType: "struct Score",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "isApproved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "result", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "topYoinker",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalYoinks",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "uri",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "yoink",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const YOINK_ADDRESS = "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878";

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
