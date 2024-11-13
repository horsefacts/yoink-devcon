import {
  encodeFunctionData,
  BaseError,
  ContractFunctionRevertedError,
} from "viem";
import { frames } from "../frames";
import { abi, YOINK_ADDRESS, simulateYoink } from "../../../lib/contract";
import { transaction, error } from "frames.js/core";
import { formatDuration } from "../../../lib/time";

export const POST = frames(async (ctx) => {
  if (!ctx?.message?.address) {
    throw new Error("Invalid frame message");
  }

  try {
    await simulateYoink(ctx.message.address);
  } catch (err) {
    if (err instanceof BaseError) {
      const revertError = err.walk(
        (err) => err instanceof ContractFunctionRevertedError,
      );
      if (revertError instanceof ContractFunctionRevertedError) {
        const errorName = revertError.data?.errorName ?? "";
        if (errorName === "Unauthorized") {
          return error(
            "You have the flag. You can't yoink from yourself.",
            403,
          );
        } else if (errorName === "SlowDown") {
          const [timeLeft] = revertError.data?.args ?? [];
          return error(
            `You're yoinking too fast. Try again in ${formatDuration(Number(timeLeft))}.`,
            403,
          );
        } else {
          return error("Something went wrong.", 403);
        }
      }
    }
  }

  const calldata = encodeFunctionData({
    abi,
    functionName: "yoink",
  });

  return transaction({
    chainId: "eip155:8453",
    method: "eth_sendTransaction",
    params: {
      abi,
      to: YOINK_ADDRESS,
      data: calldata,
    },
  });
});
