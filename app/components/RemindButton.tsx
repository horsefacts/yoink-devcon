import { useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { toast } from "react-toastify";

export function RemindButton({ timeLeft }: { timeLeft: number }) {
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleRemind = useCallback(async () => {
    if (status === "loading") return;

    try {
      setStatus("loading");
      const result = await sdk.actions.addFrame();

      if (result.added) {
        if (result.notificationDetails) {
          const context = await sdk.context;

          await fetch("/api/notification-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fid: context.user.fid,
              token: result.notificationDetails.token,
            }),
          });

          await fetch("/api/schedule-reminder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fid: context.user.fid,
              timeLeft,
            }),
          });

          toast.success("We'll remind you when it's time to yoink!");
        }
        setStatus("idle");
      } else if (result.reason === "rejected-by-user") {
        toast.error("You dismissed the frame request");
        setStatus("idle");
      }
    } catch (error) {
      toast.error("Failed to schedule reminder");
      setStatus("idle");
    }
  }, [timeLeft, status]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleRemind}
        disabled={status === "loading"}
        className={`mt-4 px-4 py-2 bg-[#BA181B] text-white rounded-lg font-semibold transition-colors ${
          status === "loading"
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#A41618]"
        }`}
      >
        {status === "loading" ? "Setting reminder..." : "Remind me"}
      </button>
    </div>
  );
}
