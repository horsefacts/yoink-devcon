import { NextResponse } from "next/server";
import { getAddressRankings } from "../../../lib/contract";
import { client } from "../../../lib/neynar";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address parameter is required" },
        { status: 400 },
      );
    }

    const rankings = await getAddressRankings(address);
    const addresses = rankings.rankings.map((r) => r.address);
    const users = await client.fetchBulkUsersByEthereumAddress(addresses);

    const rankingsWithUserData = rankings.rankings.map((ranking) => {
      const userData = users[ranking.address.toLowerCase()];
      const username =
        userData && userData[0] ? userData[0].username : ranking.address;
      const pfpUrl = userData && userData[0] ? userData[0].pfp_url : undefined;

      return {
        ...ranking,
        username,
        pfpUrl,
      };
    });

    return NextResponse.json({
      targetRank: rankings.targetRank,
      rankings: rankingsWithUserData,
    });
  } catch (error) {
    console.error("Error fetching rankings:", error);
    return NextResponse.json(
      { error: "Failed to fetch rankings" },
      { status: 500 },
    );
  }
}
