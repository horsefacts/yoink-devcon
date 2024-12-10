import { useCallback, useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { BaseError, Hex } from "viem";
import { useConnect, useSwitchChain, useChainId } from "wagmi";
import { base } from "viem/chains";
import { PrimaryButton } from "./PrimaryButton";
import { toast } from "react-toastify";

type ButtonState = {
  text: string;
  disabled: boolean;
  loading: boolean;
  hidden: boolean;
};

interface YoinkButtonProps {
  onYoinkStart?: () => void;
  onYoinkSuccess?: (txHash: Hex) => void;
  onTimeLeft?: (timeLeft: number) => void;
}

export function YoinkButton({
  onYoinkStart,
  onYoinkSuccess,
  onTimeLeft,
}: YoinkButtonProps) {
  const { connectors, connectAsync } = useConnect();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const account = useAccount();
  const { sendTransactionAsync: sendTransaction } = useSendTransaction();

  const [buttonState, setButtonState] = useState<ButtonState>({
    text: "Yoink",
    disabled: false,
    loading: false,
    hidden: false,
  });

  const yoinkOnchain = useCallback(async () => {
    try {
      setButtonState({
        text: "Yoink",
        disabled: true,
        loading: true,
        hidden: false,
      });

      onYoinkStart?.();

      const params = new URLSearchParams({
        address: account.address ?? "unknown",
      });

      const res = await fetch(`/api/yoink-tx?${params}`, {
        cache: "no-store",
      });
      if (res.status !== 200) {
        const error = await res.json();

        if (error.timeLeft) {
          setButtonState({
            text: "Yoink",
            disabled: true,
            loading: false,
            hidden: false,
          });
          onTimeLeft?.(error.timeLeft);
        } else {
          setButtonState({
            text: "Yoink",
            disabled: false,
            loading: false,
            hidden: false,
          });
          toast.error(error.message);
        }
        return;
      }

      const txData = await res.json();
      const txHash = await sendTransaction({
        to: txData.params.to,
        data: txData.params.data,
        chainId: 8453,
      });
      onYoinkSuccess?.(txHash);

      setButtonState({
        text: "Yoinking",
        disabled: true,
        loading: true,
        hidden: true,
      });
    } catch (e) {
      setButtonState({
        text: "Yoink",
        disabled: false,
        loading: false,
        hidden: false,
      });

      if (e instanceof BaseError) {
        if (
          e.details &&
          (e.details.startsWith("User denied request") ||
            e.details.startsWith("User rejected request"))
        ) {
          return;
        }
      }
      toast.error("Something went wrong.");
      console.error(e);
    }
  }, [
    account.address,
    sendTransaction,
    onYoinkStart,
    onYoinkSuccess,
    onTimeLeft,
  ]);

  const handleYoink = useCallback(async () => {
    try {
      if (!account.isConnected) {
        const connectResult = await connectAsync({
          connector: connectors[0]!,
          chainId: base.id,
        });

        if (connectResult.accounts.length) {
          await yoinkOnchain();
          return;
        } else {
          toast.error("Unable to connect: no addresses");
          return;
        }
      } else {
        if (chainId !== base.id) {
          await switchChainAsync({ chainId: base.id });
        }

        await yoinkOnchain();
        return;
      }
    } catch (e) {
      if (e instanceof BaseError) {
        if (
          e.details &&
          (e.details.startsWith("User denied request") ||
            e.details.startsWith("User rejected request"))
        ) {
          return;
        }
      }

      toast.error("Unable to connect.");
      console.error(e);
    }
  }, [
    account.isConnected,
    connectAsync,
    connectors,
    yoinkOnchain,
    chainId,
    switchChainAsync,
  ]);

  return (
    <PrimaryButton
      onClick={handleYoink}
      disabled={buttonState.disabled}
      loading={buttonState.loading}
      hidden={buttonState.hidden}
    >
      {buttonState.text}
    </PrimaryButton>
  );
}
