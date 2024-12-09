import { Suspense } from "react";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Leaderboard } from "../Leaderboard";
import { UserHeader } from "../UserHeader";
import { TotalYoinks } from "../TotalYoinks";
import { Hex } from "viem";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const address =
    typeof searchParams.address === "string"
      ? searchParams.address
      : "0xcA698e19280DFB59084A15f7E891778c483Be0DC";

  return (
    <div className="p-3 space-y-3">
      <ErrorBoundary>
        <Suspense>
          <UserHeader address={address as Hex} hasFlag />
          <TotalYoinks />
          <Leaderboard />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
