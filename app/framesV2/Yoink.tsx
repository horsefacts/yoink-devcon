"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-kit";

import Flag from "../../public/flag.png";
import { WagmiProvider } from "../WagmiProvider";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";

export function Yoink(props: {
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
  const account = useAccount();
  const { data: hash, sendTransaction } = useSendTransaction();
  const txReceiptResult = useWaitForTransactionReceipt({ hash });
  const [timeLeft, setTimeLeft] = useState<number>();

  const yoinkOnchain = useCallback(async () => {
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
    sendTransaction({ to: txData.params.to, data: txData.params.data });
  }, [account.address, sendTransaction]);

  useEffect(() => {
    sdk.hideSplashScreen();
    sdk.setPrimaryButton({ text: "Yoink" });
  }, []);

  useEffect(() => {
    sdk.on("primaryButtonClicked", yoinkOnchain);
    return () => {
      sdk.off("primaryButtonClicked", yoinkOnchain);
    };
  }, [yoinkOnchain]);

  useEffect(() => {
    if (txReceiptResult.isLoading) {
      sdk.setPrimaryButton({ text: "Yoinking", disabled: true, loading: true });
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
              <div className="flex object-cover rounded-full">
                <Image
                  src={pfpUrl}
                  className="rounded-full"
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
        </div>
      </div>
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

function formatTime(seconds: number) {
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Pad each component to ensure two digits
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

import { Connector, useConnect } from "wagmi";
import { parseEther } from "viem";
import { revalidateFramesV2 } from "./actions";

export function SendTransaction() {
  const { data: hash, sendTransaction } = useSendTransaction();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get("address") as `0x${string}`;
    const value = formData.get("value") as string;
    sendTransaction({ to, value: parseEther(value) });
  }

  return (
    <form onSubmit={submit}>
      <input
        name="address"
        placeholder="0xA0Cf…251e"
        defaultValue={"0xefE45908DfBEef7A00ED2e92d3b88afD7a32c95C"}
        required
      />
      <input name="value" placeholder="0.05" required defaultValue="0.000001" />
      <button type="submit">Send</button>
      {hash && <div>Transaction Hash: {hash}</div>}
    </form>
  );
}

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => (
    <WalletOption
      key={connector.uid}
      connector={connector}
      onClick={() => {
        connect({ connector });
      }}
    />
  ));
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <button disabled={!ready} onClick={onClick}>
      {connector.name}
    </button>
  );
}
