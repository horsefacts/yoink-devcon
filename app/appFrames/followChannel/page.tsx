import dynamicI from "next/dynamic";

const FollowChannel = dynamicI(() => import("./FollowChannel"), { ssr: false });

export const dynamic = "force-dynamic";

export default async function Page() {
  return <FollowChannel />;
}
