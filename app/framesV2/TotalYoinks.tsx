"use client";

import { useTotalYoinks } from "../hooks/api";

export function TotalYoinks() {
  const { data: totalYoinks } = useTotalYoinks();

  if (!totalYoinks) {
    return null;
  }

  return (
    <div className="text-sm text-center text-[#8B99A4]">
      The flag has been yoinked {totalYoinks.totalYoinks} times
    </div>
  );
}
