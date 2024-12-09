import { useAccount } from "wagmi";
import { useCallback } from "react";
import sdk from "@farcaster/frame-sdk";

export function RemindButton({ timeLeft }: { timeLeft: number }) {
  const account = useAccount();

  const handleRemind = useCallback(async () => {
    try {
      const result = await sdk.actions.addFrame();

      if (result.added) {
        if (result.notificationDetails) {
          // Save notification token
          await fetch("/api/notification-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: account.address,
              token: result.notificationDetails.token,
            }),
          });

          // Schedule reminder
          await fetch("/api/schedule-reminder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: account.address,
              timeLeft,
            }),
          });

          alert("We'll remind you when it's time to yoink!");
        } else {
          alert("Notification token already saved.");
        }
      } else if (result.reason === "rejected-by-user") {
        alert("User dismissed add frame.");
      }
    } catch (error) {
      alert("Failed to schedule reminder.");
    }
  }, [account.address, timeLeft]);

  return (
    <button
      onClick={handleRemind}
      className="mt-4 px-4 py-2 bg-[#BA181B] text-white rounded-lg font-semibold hover:bg-[#A41618] transition-colors"
    >
      Remind me when ready
    </button>
  );
}
