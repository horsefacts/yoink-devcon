"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sdk } from "@farcaster/frame-kit";
import { Connector, useConnect } from "wagmi";
import { Hex, parseEther } from "viem";

import { WagmiProvider } from "../../WagmiProvider";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";

export default function SendTx() {
  return (
    <WagmiProvider>
      <SendTxInner />
    </WagmiProvider>
  );
}

function SendTxInner() {
  const { connectors, connectAsync } = useConnect();
  const account = useAccount();
  const { data: hash, sendTransactionAsync: sendTransaction } =
    useSendTransaction();
  const txResult = useWaitForTransactionReceipt({ hash });
  const formRef = useRef<HTMLFormElement>(null);

  const submit = useCallback(async () => {
    try {
      const formData = new FormData(formRef.current as HTMLFormElement);
      const to = formData.get("address") as `0x${string}`;
      const value = formData.get("value") as string;
      await sendTransaction({ to, value: parseEther(value) });
    } catch {
      // no-op
    }
  }, [sendTransaction]);

  const handleSubmit = useCallback(async () => {
    try {
      if (!account.isConnected) {
        const connectResult = await connectAsync({ connector: connectors[0]! });
        if (connectResult.accounts.length) {
          await submit();
        }
      } else if (account.address) {
        await submit();
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
  }, [account.address, account.isConnected, connectAsync, connectors, submit]);

  useEffect(() => {
    sdk.hideSplashScreen();
  }, []);

  return (
    <>
      <div className="p-3">
        {account.address && (
          <div className="mb-1">
            <div className="text-gray-700 text-xs">Connected as</div>
            <div className="text-sm font-mono">{account.address}</div>
          </div>
        )}
        <form onSubmit={submit} ref={formRef}>
          <div className="text-gray-700 text-xs mt-1">To:</div>
          <input
            name="address"
            defaultValue={"0xefE45908DfBEef7A00ED2e92d3b88afD7a32c95C"}
            className="w-full"
            required
          />
          <div className="text-gray-700 text-xs mt-1">Amount:</div>
          <input
            name="value"
            required
            defaultValue="0.0000001"
            className="w-full"
          />
          {hash && (
            <div className="mt-2">
              <div className="text-gray-700 text-xs mt-1">Tx hash:</div>
              <div
                className="text-sm font-mono"
                onClick={() => {
                  sdk.openUrl(`https://basescan.org/tx/${hash}`);
                }}
              >
                {hash}
              </div>
            </div>
          )}
          {(txResult.isLoading || txResult.isSuccess) && (
            <div className="mt-2">
              <div className="text-gray-700 text-xs mt-1 truncate">
                Tx status:
              </div>
              {txResult.isLoading && (
                <div className="text-green-700 text-sm font-semibold">
                  Confirming...
                </div>
              )}
              {txResult.isSuccess && (
                <div className="text-green-700 text-sm font-semibold">
                  Confirmed
                </div>
              )}
              {txResult.isError && (
                <div className="text-red-700 text-sm font-semibold">Error</div>
              )}
            </div>
          )}
        </form>
      </div>
      {!(txResult.isLoading || txResult.isSuccess) && (
        <AppFrameButton text="Send" onClick={handleSubmit} />
      )}
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
