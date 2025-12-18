import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { createExampleURL } from "./utils";
import { Frame } from "./components/Frame";

export async function generateMetadata(): Promise<Metadata> {
  const frameMetadata = await fetchMetadata(createExampleURL("/frames"));
  const filteredMetadata = Object.fromEntries(
    Object.entries(frameMetadata).filter(([, v]) => v !== undefined),
  );

  return {
    title: "Yoink",
    description: "Click to yoink the flag.",
    other: {
      ...filteredMetadata,
      "base:app_id": "68a5dbd5d3f637a5b9984597",
    },
  };
}

export default async function Home() {
  const metadata = await generateMetadata();

  return (
    <div className="flex flex-col max-w-[600px] w-full gap-2 mx-auto p-2">
      <Frame metadata={metadata} url={createExampleURL("/frames")} />
    </div>
  );
}
