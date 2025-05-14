import { client } from "../../../lib/neynar";

export type CastoutPlayer = {
  address: string;
  username: string;
  tribe: string;
  yoinks: number;
  pfpUrl?: string;
};

export type CastoutTribe = {
  tribe: string;
  totalYoinks: number;
};

export type CastoutResponse = {
  players: CastoutPlayer[];
  tribes: CastoutTribe[];
};

export async function GET() {
  const response = await fetch(
    "https://yoink-indexer-production-1b27.up.railway.app/castout",
    { cache: "no-store" },
  );
  const data: CastoutResponse = await response.json();

  // Fetch user data for all players
  const addressesToLookup = data.players.map((player) => player.address);
  const users = await client.fetchBulkUsersByEthereumAddress(addressesToLookup);

  // Enhance players with pfp URLs
  const playersWithPfp = data.players.map((player) => {
    const userData = users[player.address.toLowerCase()];
    return {
      ...player,
      pfpUrl: userData && userData[0] ? userData[0].pfp_url : undefined,
    };
  });

  return Response.json({
    ...data,
    players: playersWithPfp,
  });
}
