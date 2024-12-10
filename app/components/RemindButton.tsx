import { useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { toast } from "react-toastify";
import { PrimaryButton } from "./PrimaryButton";

export function RemindButton({ timeLeft }: { timeLeft: number }) {
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [hasSetReminder, setHasSetReminder] = useState(false);

  const handleRemind = useCallback(async () => {
    if (status === "loading" || hasSetReminder) return;

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
          setHasSetReminder(true);
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
  }, [timeLeft, status, hasSetReminder]);

  return (
    <div className="mt-4 w-full">
      <PrimaryButton
        onClick={handleRemind}
        disabled={status === "loading" || hasSetReminder}
        loading={status === "loading"}
      >
        {status === "loading"
          ? "Setting reminder..."
          : hasSetReminder
            ? "Reminder set"
            : "Remind me"}
      </PrimaryButton>
    </div>
  );
}
