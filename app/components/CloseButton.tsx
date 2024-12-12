"use client";

import { useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { PrimaryButton } from "./PrimaryButton";

export function CloseButton() {
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleClose = useCallback(async () => {
    if (status === "loading") return;

    try {
      setStatus("loading");
      await sdk.actions.close();
    } catch (error) {
      console.error(error);
    } finally {
      setStatus("idle");
    }
  }, [status]);

  return (
    <PrimaryButton
      onClick={handleClose}
      disabled={status === "loading"}
      loading={status === "loading"}
    >
      {status === "loading" ? "Closing..." : "Close"}
    </PrimaryButton>
  );
}
