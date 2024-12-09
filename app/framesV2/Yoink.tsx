"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, Suspense } from "react";
import sdk, { FrameContext } from "@farcaster/frame-sdk";
import { useQueryClient } from "@tanstack/react-query";

import Flag from "../../public/flag_simple.png";
import FlagAvatar from "../../public/flag.png";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { RecentActivity } from "./RecentActivity";
import { revalidateFramesV2 } from "./actions";
import { YoinkButton } from "../components/YoinkButton";
import { useYoinkData } from "../hooks/api";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useLongPress } from "../hooks/useLongPress";

export default function Yoink() {
  return (
    <ErrorBoundary>
      <Suspense>
        <YoinkInner />
      </Suspense>
    </ErrorBoundary>
  );
}

function YoinkInner() {
  const { data } = useYoinkData();

  if (!data) {
    return null;
  }

  return (
    <YoinkStart
      lastYoinkedBy={data.lastYoinkedBy}
      pfpUrl={data.pfpUrl}
      totalYoinks={data.totalYoinks}
    />
  );
}

function YoinkStart({
  lastYoinkedBy,
  pfpUrl,
  totalYoinks,
}: {
  lastYoinkedBy: string;
  pfpUrl?: string;
  totalYoinks: string;
}) {
  const router = useRouter();
  const account = useAccount();
  const { data: hash } = useSendTransaction();
  const txReceiptResult = useWaitForTransactionReceipt({ hash });
  const queryClient = useQueryClient();

  const [context, setContext] = useState<FrameContext>();
  const [timeLeft, setTimeLeft] = useState<number>();

  const pfp = pfpUrl ?? FlagAvatar;

  const init = useCallback(async () => {
    const context = await sdk.context;
    setContext(context);
    sdk.actions.ready();
  }, []);

  useEffect(() => {
    if (!pfp) {
      void init();
    }
  }, [init, pfp]);

  useEffect(() => {
    if (txReceiptResult.isLoading) {
      setTimeLeft(undefined);
    }
  }, [txReceiptResult.isLoading]);

  useEffect(() => {
    if (txReceiptResult.isSuccess) {
      void revalidateFramesV2();
      queryClient.invalidateQueries({ queryKey: ["yoink-data"] });
      router.push(`/framesV2/yoinked?address=${account.address}`);
    }
  }, [account.address, router, txReceiptResult.isSuccess, queryClient]);

  const addFrame = useCallback(async () => {
    try {
      const result = await sdk.actions.addFrame();
      console.log(result);

      if (result.added && result?.notificationDetails) {
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
      }
    } catch (error) {
      alert("Failed to store notification token.");
    }
  }, [account.address]);

  const isWarpcastUsername = (username: string) => !username.includes("…");

  const handleProfileClick = useCallback(() => {
    sdk.actions.openUrl(`https://warpcast.com/${lastYoinkedBy}`);
  }, [lastYoinkedBy]);

  const longPressHandlers = useLongPress(addFrame);

  if (typeof timeLeft === "number") {
    return (
      <div className="mt-3 p-3">
        <TimeLeft timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
      </div>
    );
  }

  return (
    <div className="p-3 pt-9 flex flex-col items-center h-[100vh] justify-between">
      <div className="pb-8 px-8 flex flex-col items-center">
        <div className="relative mb-1">
          <div
            className="flex overflow-hidden rounded-full h-[112px] w-[112px]"
            {...longPressHandlers}
          >
            <Image
              src={pfpUrl ?? FlagAvatar}
              className="w-full h-full object-cover object-center"
              onLoadingComplete={init}
              alt="avatar"
              width="112"
              height="112"
            />
          </div>
          <div className="absolute right-0 bottom-0 flex items-center justify-center bg-[#F7F7F7] border border-[#F5F3F4] rounded-full h-[36px] w-[36px]">
            <Image src={Flag} width={14.772} height={19.286} alt="yoink flag" />
          </div>
        </div>
        {txReceiptResult.isLoading || txReceiptResult.isSuccess ? (
          <div className="text-center text-2xl font-black text-[#BA181B]">
            <div>Yoinking the flag from</div>
            <div>
              <span className="inline-block animate-spin">🚩</span>{" "}
              <span className="animate-pulse">{lastYoinkedBy}</span>{" "}
              <span className="inline-block animate-spin">🚩</span>
            </div>
          </div>
        ) : (
          <>
            <div
              className="flex text-2xl font-black text-[#BA181B] uppercase mb-1 select-none touch-none"
              {...longPressHandlers}
            >
              Yoink!
            </div>
            <div className="mb-1 font-bold text-sm text-center">
              {lastYoinkedBy} has the flag
            </div>
            <div className="text-sm">
              The flag has been yoinked{" "}
              <span className="text-[#BA181B]">{totalYoinks} times</span>
            </div>
          </>
        )}
      </div>
      <RecentActivity />
      <div className="flex flex-col grow"></div>
      {/*
        <div
          className="rounded-lg text-sm font-semibold bg-slate-200 py-3 w-full text-center"
          onClick={addFrame}
        >
          Add Frame
        </div>
      */}
      <div className="mt-4 w-full">
        <YoinkButton
          onTimeLeft={setTimeLeft}
          onYoinkSuccess={() => {
            void revalidateFramesV2();
            router.push(`/framesV2/yoinked?address=${account.address}`);
          }}
        />
      </div>
    </div>
  );
}

function TimeLeft({
  timeLeft,
  setTimeLeft,
}: {
  timeLeft: number;
  setTimeLeft: (v: number) => void;
}) {
  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [setTimeLeft, timeLeft]);

  if (timeLeft === 0) {
    return (
      <>
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold mb-1">it&apos;s time to</div>
          <div className="text-7xl font-black text-[#BA181B] uppercase">
            YOINK!
          </div>
        </div>
        <YoinkButton onTimeLeft={setTimeLeft} />
      </>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl font-bold mb-1">🐎 hold yer horses</div>
      <div className="text-7xl font-black text-[#BA181B] uppercase mb-1 font-mono">
        {formatTime(timeLeft)}
      </div>
      <div className="text-sm font-semibold">before you can yoink again</div>
    </div>
  );
}
function formatTime(seconds: number) {
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Pad each component to ensure two digits
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
