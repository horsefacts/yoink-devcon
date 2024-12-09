import { NextResponse } from "next/server";
import { getLeaderboard } from "../../../lib/contract";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leaderboard = await getLeaderboard(10);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
