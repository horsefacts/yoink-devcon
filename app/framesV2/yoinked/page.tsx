import { Suspense } from "react";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { UserHeader } from "../UserHeader";
import { TotalYoinks } from "../TotalYoinks";
import { Hex } from "viem";
import { AddFrameButton } from "../../components/AddFrameButton";
import { ActionButtonContainer } from "../../components/ActionButtonContainer";
import { LeaderboardToggle } from "../../components/LeaderboardToggle";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const address =
    typeof searchParams.address === "string"
      ? searchParams.address
      : "0xcA698e19280DFB59084A15f7E891778c483Be0DC";

  return (
    <div className="flex flex-col min-h-[100vh]">
      <div className="flex-1 overflow-hidden p-3 space-y-3">
        <ErrorBoundary>
          <Suspense>
            <UserHeader address={address as Hex} hasFlag />
            <TotalYoinks />
            <LeaderboardToggle address={address as string} />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="flex-shrink-0 p-3">
        <ActionButtonContainer>
          <AddFrameButton />
        </ActionButtonContainer>
      </div>
    </div>
  );
}
