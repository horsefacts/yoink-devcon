import Image from "next/image";
import Link from "next/link";
import { getLeaderboard } from "../../lib/contract";

export async function Leaderboard() {
  const leaderboard = await getLeaderboard(10);

  return (
    <div className="px-3">
      <div className="text-[#8B99A4] font-semibold">Leaderboard</div>
      {leaderboard.map((leader, index) => (
        <Link
          key={leader.address}
          href={`/framesV2/stats?address=${leader.address}`}
          className="flex flex-row justify-between py-2"
        >
          <div className="flex-1 flex flex-row items-center gap-[10px]">
            {leader.pfpUrl && (
              <Image
                src={leader.pfpUrl}
                className="rounded-full h-[38px] w-[38px]"
                alt={leader.username}
                height={38}
                width={38}
              />
            )}
            <div className="flex-shrink">
              <div className="font-semibold text-sm leading-5">
                {leader.username}
              </div>
              <div className="text-xs text-[#8B99A4]">
                {leader.yoinks} yoinks
              </div>
            </div>
          </div>
          <div className="flex-none text-[#546473] font-semibold">
            #{index + 1}
          </div>
        </Link>
      ))}
    </div>
  );
}
