"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sdk } from "@farcaster/frame-kit";

export default function FollowChannel() {
  const [followedKey, setFollowedKey] = useState<string>();
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = useCallback(async () => {
    try {
      const formData = new FormData(formRef.current as HTMLFormElement);
      const key = formData.get("key") as `0x${string}`;
      const { followed } = await sdk.followChannel({ key });
      if (followed) {
        setFollowedKey(key);
      }
    } catch (e) {
      alert(`Failed: ${e}`);
    }
  }, []);

  useEffect(() => {
    sdk.hideSplashScreen();
  }, []);

  return (
    <>
      <div className="p-3">
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="text-gray-700 text-xs mt-1">Channel:</div>
          <input name="key" defaultValue="90s" className="w-full" required />
        </form>
        {followedKey && (
          <div className="mt-3">
            <div className="text-sm text-green-700">
              You followed /{followedKey}
            </div>
          </div>
        )}
      </div>
      <AppFrameButton text="Follow" onClick={handleSubmit} />
    </>
  );
}

function AppFrameButton({
  text,
  disabled = false,
  loading = false,
  onClick,
}: {
  text: string;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}) {
  // Update button
  useEffect(() => {
    sdk.setPrimaryButton({ text, disabled, loading });
  }, [text, disabled, loading]);

  // Bind onClick
  useEffect(() => {
    sdk.on("primaryButtonClicked", onClick);
    return () => {
      sdk.off("primaryButtonClicked", onClick);
    };
  }, [onClick]);

  // Hide button on unmount
  useEffect(() => {
    return () => {
      sdk.setPrimaryButton({ text: "", hidden: true });
    };
  }, []);

  return null;
}
