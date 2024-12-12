import sdk from "@farcaster/frame-sdk";

const TRIBE_CHANNELS: Record<string, string> = {
  Based: "base",
  BurrFrens: "burrfrens",
  FCOF: "fcof",
  Fomies: "fomies",
  "Girthy Gang": "girth",
  Pkok: "pkok",
  Purple: "purple",
  Yellow: "yellow",
};

export function navigateToProfile(username: string) {
  sdk.actions.openUrl(`https://warpcast.com/${username}`);
}

export function navigateToTribe(tribe: string) {
  const channelKey = TRIBE_CHANNELS[tribe];
  if (channelKey) {
    sdk.actions.openUrl(`https://warpcast.com/~/channel/${channelKey}`);
  }
}
