import { NextResponse } from "next/server";
import { getTotalYoinks } from "../../../lib/contract";

export const dynamic = "force-dynamic";

export type TotalYoinksResponse = {
  totalYoinks: string;
};

export async function GET() {
  try {
    const totalYoinks = await getTotalYoinks();

    return NextResponse.json({
      totalYoinks: totalYoinks.toLocaleString(),
    });
  } catch (error) {
    console.error("Error fetching total yoinks:", error);
    return NextResponse.json(
      { error: "Failed to fetch total yoinks" },
      { status: 500 },
    );
  }
}
