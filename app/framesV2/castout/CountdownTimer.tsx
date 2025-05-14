"use client";

import sdk from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";

const END_DATE = new Date("2025-05-15T16:00:00.000Z");

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    sdk.actions.ready();
    function updateTimer() {
      const now = new Date();
      const diff = END_DATE.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Event ended");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center my-2">
      <div className="text-base font-bold mb-1">
        {timeLeft === "Event ended"
          ? "🚩 Final Scores"
          : "🚩 challenge ends in:"}
      </div>
      {timeLeft !== "Event ended" && (
        <div className="text-3xl font-black text-[#BA181B] font-mono">
          {timeLeft}
        </div>
      )}
    </div>
  );
}
