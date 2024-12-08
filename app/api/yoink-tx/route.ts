import {
  encodeFunctionData,
  BaseError,
  ContractFunctionRevertedError,
  Hex,
} from "viem";
import { NextRequest, NextResponse } from "next/server";
import { transaction } from "frames.js/core";
import { abi, YOINK_ADDRESS, simulateYoink } from "../../../lib/contract";
import { formatDuration } from "../../../lib/time";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    if (!address || address === "unknown") {
      return NextResponse.json(
        {
          message: "Missing address",
        },
        { status: 400 },
      );
    }
    await simulateYoink(address as Hex);
  } catch (err) {
    if (err instanceof BaseError) {
      const revertError = err.walk(
        (err) => err instanceof ContractFunctionRevertedError,
      );
      if (revertError instanceof ContractFunctionRevertedError) {
        const errorName = revertError.data?.errorName ?? "";
        if (errorName === "Unauthorized") {
          return NextResponse.json(
            {
              message: "You have the flag. You can't yoink from yourself.",
            },
            { status: 403 },
          );
        } else if (errorName === "SlowDown") {
          const [timeLeft] = revertError.data?.args ?? [];
          return NextResponse.json(
            {
              message: `You're yoinking too fast. Try again in ${formatDuration(Number(timeLeft))}.`,
              timeLeft: Number(timeLeft),
            },
            { status: 403 },
          );
        } else {
          return NextResponse.json(
            {
              message: `Something went wrong`,
            },
            { status: 403 },
          );
        }
      }
    }
  }

  const calldata = encodeFunctionData({
    abi,
    functionName: "yoink",
  });

  return transaction({
    chainId: "eip155:84532",
    method: "eth_sendTransaction",
    params: {
      abi,
      to: YOINK_ADDRESS,
      data: calldata,
    },
  });
}
