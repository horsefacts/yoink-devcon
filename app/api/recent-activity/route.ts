import { getRecentYoinks } from "../../../lib/contract";
import { getYoinksWithUsernames } from "../../../lib/neynar";
import { NextResponse } from "next/server";

export type YoinkActivityResponse = {
  from: string;
  by: string;
  timestamp: number;
};

export async function GET() {
  try {
    const recentYoinks = await getRecentYoinks(10);
    const yoinksWithUsernames = await getYoinksWithUsernames(recentYoinks);

    return NextResponse.json({ yoinksWithUsernames });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity" },
      { status: 500 },
    );
  }
}
