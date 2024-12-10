"use client";

import { useCallback, useState, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";
import { useNotificationToken } from "../hooks/api";
import { useQueryClient } from "@tanstack/react-query";
import { PrimaryButton } from "./PrimaryButton";

export function AddFrameButton() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "loading"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fid, setFid] = useState<number>();

  const { data, isLoading } = useNotificationToken({ fid });

  useEffect(() => {
    const init = async () => {
      const context = await sdk.context;
      setFid(context.user.fid);
    };
    init();
  });

  const handleAddFrame = useCallback(async () => {
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
          setStatus("success");
          queryClient.invalidateQueries({ queryKey: ["notification-token"] });
        } else {
          setStatus("success");
        }
      } else if (result.reason === "rejected-by-user") {
        setStatus("error");
        setErrorMessage("You dismissed the frame request");
      } else if (result.reason === "invalid-domain-manifest") {
        setStatus("error");
        setErrorMessage("Invalid frame manifest");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to store notification token");
    }
  }, [status, queryClient]);

  if (isLoading || data?.hasToken) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <PrimaryButton
        onClick={handleAddFrame}
        disabled={status === "loading" || status === "success"}
        loading={status === "loading"}
      >
        {status === "loading" ? "Adding frame..." : "Add Frame"}
      </PrimaryButton>

      {status === "success" && (
        <div className="text-sm text-green-600 font-medium">
          Frame added successfully!
        </div>
      )}

      {status === "error" && (
        <div className="text-sm text-red-600 font-medium">{errorMessage}</div>
      )}
    </div>
  );
}
