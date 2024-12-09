import { useAccount } from "wagmi";
import { useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";

export function RemindButton({ timeLeft }: { timeLeft: number }) {
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "loading"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleRemind = useCallback(async () => {
    if (status === "loading" || status === "success") return;

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

          setStatus("success");
        } else {
          setStatus("success");
        }
      } else if (result.reason === "rejected-by-user") {
        setStatus("error");
        setErrorMessage("You dismissed the frame request");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to schedule reminder");
    }
  }, [timeLeft, status]);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleRemind}
        disabled={status === "loading" || status === "success"}
        className={`mt-4 px-4 py-2 bg-[#BA181B] text-white rounded-lg font-semibold transition-colors ${
          status === "loading" || status === "success"
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#A41618]"
        }`}
      >
        {status === "loading" ? "Setting reminder..." : "Remind me"}
      </button>

      {status === "success" && (
        <div className="text-sm text-green-600 font-medium">
          We&apos;ll remind you when it&apos;s time to yoink!
        </div>
      )}

      {status === "error" && (
        <div className="text-sm text-red-600 font-medium">{errorMessage}</div>
      )}
    </div>
  );
}
