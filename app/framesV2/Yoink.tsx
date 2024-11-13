"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-kit";
import { useConnect } from "wagmi";
import { revalidateFramesV2 } from "./actions";

import Flag from "../../public/flag.png";
import { WagmiProvider } from "../WagmiProvider";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";

export default function Yoink(props: {
  lastYoinkedBy: string;
  pfpUrl?: string;
  totalYoinks: string;
}) {
  return (
    <WagmiProvider>
      <YoinkInner {...props} />
    </WagmiProvider>
  );
}

function YoinkInner(props: {
  lastYoinkedBy: string;
  pfpUrl?: string;
  totalYoinks: string;
}) {
  return <YoinkStart {...props} />;
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

  const { connectors, connectAsync } = useConnect();
  const account = useAccount();
  const { data: hash, sendTransactionAsync: sendTransaction } =
    useSendTransaction();
  const txReceiptResult = useWaitForTransactionReceipt({ hash });

  const [timeLeft, setTimeLeft] = useState<number>();

  const yoinkOnchain = useCallback(async () => {
    try {
      sdk.setPrimaryButton({ text: "Yoink", disabled: true, loading: true });

      const params = new URLSearchParams({
        address: account.address ?? "unknown",
      });

      const res = await fetch(`/api/yoink-tx?${params}`);
      if (res.status !== 200) {
        const error = await res.json();

        if (error.timeLeft) {
          sdk.setPrimaryButton({ text: "Yoink", disabled: true });
          setTimeLeft(error.timeLeft);
        } else {
          sdk.setPrimaryButton({ text: "Yoink" });
          alert(error.message);
        }

        return;
      }

      const txData = await res.json();
      await sendTransaction({ to: txData.params.to, data: txData.params.data });
      sdk.setPrimaryButton({ text: "Yoinking", hidden: true });
    } catch {
      sdk.setPrimaryButton({ text: "Yoink" });
    }
  }, [account.address, sendTransaction]);

  const handleYoink = useCallback(async () => {
    try {
      if (!account.isConnected) {
        const connectResult = await connectAsync({ connector: connectors[0]! });
        if (connectResult.accounts.length) {
          await yoinkOnchain();
          return;
        } else {
          alert("Unable to connect: no addresses");
          return;
        }
      } else if (account.address) {
        await yoinkOnchain();
        return;
      } else {
        alert("Unexpected state");
        return;
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.startsWith("User rejected the request")) {
          // no-op
          return;
        }

        alert(`Unable to connect: ${e.message}`);
        return;
      }

      alert(`Unable to connect`);
    }
  }, [
    account.address,
    account.isConnected,
    connectors,
    connectAsync,
    yoinkOnchain,
  ]);

  const init = useCallback(async () => {
    await sdk.setPrimaryButton({ text: "Yoink" });
    sdk.hideSplashScreen();
  }, []);

  useEffect(() => {
    if (!pfpUrl) {
      void init();
    }
  }, [init, pfpUrl]);

  useEffect(() => {
    sdk.on("primaryButtonClicked", handleYoink);
    return () => {
      sdk.off("primaryButtonClicked", handleYoink);
    };
  }, [handleYoink]);

  useEffect(() => {
    if (txReceiptResult.isLoading) {
      sdk.setPrimaryButton({ text: "Yoinking", hidden: true });
    }
  }, [txReceiptResult.isLoading]);

  useEffect(() => {
    if (txReceiptResult.isSuccess) {
      void revalidateFramesV2();
      router.push(`/framesV2/yoinked?address=${account.address}`);
    }
  }, [account.address, router, txReceiptResult.isSuccess]);

  useEffect(() => {
    return () => {
      sdk.setPrimaryButton({ text: "", hidden: true });
    };
  }, []);

  // if (1 > 0) {
  //   return <SendTransaction />;
  // }

  if (typeof timeLeft === "number") {
    return (
      <>
        <div className="mt-3 p-3">
          <TimeLeft
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            yoink={yoinkOnchain}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mt-3 p-3">
        <div className="pb-8 px-8 flex flex-col items-center">
          {!!pfpUrl && (
            <div className="relative mb-1">
              <div className="flex overflow-hidden rounded-full h-[112px] w-[112px] border border-red-800">
                <Image
                  src={pfpUrl}
                  className="w-full h-full object-cover"
                  onLoadingComplete={init}
                  alt="avatar"
                  width="112"
                  height="112"
                />
              </div>
              <div className="absolute right-0 bottom-0 flex items-center justify-center bg-[#F7F7F7] border border-[#F5F3F4] rounded-full h-[36px] w-[36px]">
                <Image
                  src={Flag}
                  width={14.772}
                  height={19.286}
                  alt="yoink flag"
                />
              </div>
            </div>
          )}
          {txReceiptResult.isLoading || txReceiptResult.isSuccess ? (
            <div className="text-center text-2xl font-black text-[#BA181B]">
              grabbing that flag for you from {lastYoinkedBy} ...🤫
            </div>
          ) : (
            <>
              <div className="flex text-2xl font-black text-[#BA181B] uppercase mb-1">
                Yoink!
              </div>
              <div className="mb-1 font-bold text-sm text-center">
                {lastYoinkedBy} has the flag
              </div>
              <div className="text-xs">
                The flag has been yoinked{" "}
                <span className="text-[#BA181B]">{totalYoinks} times</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function TimeLeft({
  timeLeft,
  setTimeLeft,
  yoink,
}: {
  timeLeft: number;
  setTimeLeft: (v: number) => void;
  yoink: () => void;
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
        <AppFrameButton text="Yoink" onClick={yoink} />
      </>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl font-bold mb-1">hold yer horses</div>
      <div className="text-7xl font-black text-[#BA181B] uppercase mb-1 font-mono">
        {formatTime(timeLeft)}
      </div>
      <div className="text-sm font-semibold">before you can yoink again</div>
    </div>
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

function formatTime(seconds: number) {
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Pad each component to ensure two digits
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
