import { Hex } from "viem";
import { NextResponse } from "next/server";
import { getScoreByAddress } from "../../../lib/contract";
import { getUserByAddress } from "../../../lib/neynar";

export const dynamic = "force-dynamic";

export type UserStatsResponse = {
  username: string;
  pfpUrl?: string;
  yoinks: bigint;
  timeHeld: bigint;
  lastYoinkedAt: bigint;
};

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

    const [scoreByAddress, userByAddress] = await Promise.all([
      getScoreByAddress(address as Hex),
      getUserByAddress(address),
    ]);

    return NextResponse.json({
      username: userByAddress?.username ?? address,
      pfpUrl: userByAddress?.pfp_url,
      yoinks: Number(scoreByAddress.yoinks),
      timeHeld: Number(scoreByAddress.time),
      lastYoinkedAt: Number(scoreByAddress.lastYoinkedAt),
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 },
    );
  }
}
