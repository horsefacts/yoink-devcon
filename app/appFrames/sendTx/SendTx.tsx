"use client";

import { useCallback, useEffect, useRef } from "react";
import { sdk } from "@farcaster/frame-kit";
import { useChainId, useConnect, useSwitchChain } from "wagmi";
import { BaseError, parseEther } from "viem";

import { WagmiProvider } from "../../WagmiProvider";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { base } from "wagmi/chains";

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
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const {
    data: hash,
    sendTransactionAsync: sendTransaction,
    isPending: sendIsPending,
  } = useSendTransaction();
  const txResult = useWaitForTransactionReceipt({ hash });
  const formRef = useRef<HTMLFormElement>(null);

  const submit = useCallback(async () => {
    try {
      const formData = new FormData(formRef.current as HTMLFormElement);
      const to = formData.get("address") as `0x${string}`;
      const value = formData.get("value") as string;
      await sendTransaction({ to, value: parseEther(value), chainId: base.id });
    } catch (e) {
      if (e instanceof BaseError) {
        // Coinbase Wallet
        if (e.details.startsWith("User denied request")) {
          // no-op
          return;
        }
      }

      alert(`Error sending tx: ${e}`);
    }
  }, [sendTransaction]);

  const handleSubmit = useCallback(async () => {
    try {
      if (!account.isConnected) {
        await connectAsync({
          connector: connectors[0]!,
          chainId: base.id,
        });

        return await submit();
      } else {
        if (chainId !== base.id) {
          await switchChainAsync({ chainId: base.id });
        }

        return await submit();
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
    account.isConnected,
    chainId,
    connectAsync,
    connectors,
    submit,
    switchChainAsync,
  ]);

  const handleClose = useCallback(async () => {
    sdk.close();
  }, []);

  useEffect(() => {
    sdk.hideSplashScreen();
  }, []);

  return (
    <>
      <div className="p-3">
        {account.address && (
          <>
            <div className="mb-1">
              <div className="text-gray-700 text-xs">Connected as</div>
              <div className="text-sm font-mono">{account.address}</div>
            </div>
            <div className="mb-1">
              <div className="text-gray-700 text-xs">Chain</div>
              <div className="text-sm font-mono">{chainId}</div>
            </div>
          </>
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
      {txResult.isLoading || txResult.isSuccess ? (
        <AppFrameButton text="Close" onClick={handleClose} />
      ) : (
        <AppFrameButton
          text="Send"
          onClick={handleSubmit}
          loading={sendIsPending}
        />
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
