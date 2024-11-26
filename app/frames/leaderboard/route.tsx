/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../frames";
import { getLeaderboard } from "../../../lib/contract";
import { truncateAddress } from "../../../lib/neynar";

const frameHandler = frames(async (ctx) => {
  const leaderboard = await getLeaderboard(10);

  return {
    title: "Leaderboard",
    image: (
      <div tw="flex flex-col w-full h-full py-8 px-16 gap-16 justify-between">
        <div tw="flex flex-col gap-2">
          <div tw="flex text-6xl font-bold mb-4">🏆 Leaderboard</div>
          {leaderboard.map((entry, idx) => (
            <div tw="flex text-4xl items-center w-full">
              <div tw="flex w-[80px]">{idx + 1}.</div>
              <div tw="flex flex-grow truncate">{entry.username}</div>
              <div tw="flex w-[300px] text-gray-500 text-right">
                {truncateAddress(entry.address)}
              </div>
              <div tw="flex w-[200px] text-right">{entry.yoinks} yoinks</div>
            </div>
          ))}
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target={{ pathname: "/" }}>
        Back
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
