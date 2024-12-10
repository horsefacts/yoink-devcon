import { useCallback, useState } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { BaseError, ContractFunctionRevertedError, Hex } from "viem";
import { useConnect, useSwitchChain, useChainId } from "wagmi";
import { base } from "viem/chains";
import { PrimaryButton } from "./PrimaryButton";
import { toast } from "react-toastify";
import { abi, YOINK_ADDRESS } from "../../lib/constants";
import { formatDuration } from "../../lib/time";

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
  const { writeContractAsync: writeContract } = useWriteContract();
  const publicClient = usePublicClient();

  const [buttonState, setButtonState] = useState<ButtonState>({
    text: "Yoink",
    disabled: false,
    loading: false,
    hidden: false,
  });

  const yoinkOnchain = useCallback(async () => {
    if (!publicClient || !account.address) return;

    try {
      onYoinkStart?.();

      // Simulate the transaction
      try {
        await publicClient.simulateContract({
          address: YOINK_ADDRESS,
          abi: abi,
          functionName: "yoink",
          account: account.address,
          chain: base,
        });
      } catch (err) {
        if (err instanceof BaseError) {
          const revertError = err.walk(
            (err) => err instanceof ContractFunctionRevertedError,
          );
          if (revertError instanceof ContractFunctionRevertedError) {
            const errorName = revertError.data?.errorName ?? "";
            if (errorName === "Unauthorized") {
              setButtonState({
                text: "Yoink",
                disabled: false,
                loading: false,
                hidden: false,
              });
              toast.error("You have the flag. You can't yoink from yourself.");
              return;
            } else if (errorName === "SlowDown") {
              const [timeLeft] = revertError.data?.args ?? [];
              setButtonState({
                text: "Yoink",
                disabled: true,
                loading: false,
                hidden: false,
              });
              onTimeLeft?.(Number(timeLeft));
              toast.error(
                `You're yoinking too fast. Try again in ${formatDuration(Number(timeLeft))}.`,
              );
              return;
            }
          }
          throw err;
        }
      }

      // Proceed with transaction
      setButtonState({
        text: "Yoink",
        disabled: true,
        loading: true,
        hidden: false,
      });

      const txHash = await writeContract({
        address: YOINK_ADDRESS,
        abi: abi,
        functionName: "yoink",
      });

      setButtonState({
        text: "Yoinking",
        disabled: true,
        loading: true,
        hidden: true,
      });

      onYoinkSuccess?.(txHash);
    } catch (e) {
      setButtonState({
        text: "Yoink",
        disabled: false,
        loading: false,
        hidden: false,
      });

      if (e instanceof BaseError) {
        if (
          e.details?.startsWith("User denied") ||
          e.details?.startsWith("User rejected")
        ) {
          return;
        }
      }
      toast.error("Something went wrong.");
      console.error(e);
    }
  }, [
    publicClient,
    account.address,
    writeContract,
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
    <div className="flex flex-col items-center gap-2">
      <PrimaryButton
        onClick={handleYoink}
        disabled={buttonState.disabled}
        loading={buttonState.loading}
        hidden={buttonState.hidden}
      >
        {buttonState.text}
      </PrimaryButton>
    </div>
  );
}
