"use client";

import { getTotalYoinks } from "../../lib/contract";

export const revalidate = 10;

export async function TotalYoinks() {
  const totalYoinks = await getTotalYoinks();

  return (
    <div className="text-sm text-center text-[#8B99A4]">
      The flag has been yoinked {totalYoinks.toLocaleString()} times
    </div>
  );
}
