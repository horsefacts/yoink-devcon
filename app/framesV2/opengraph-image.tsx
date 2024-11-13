import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "yoink the flag";
export const size = {
  width: 1200,
  height: 1200,
};

export const contentType = "image/png";
export const metadataBase = new URL(
  "https://regarding-waterproof-within-ve.trycloudflare.com",
);

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex justify-center items-center">
        <div tw="flex flex-col">
          <div tw="font-bold text-8xl text-red-500">Yoink!</div>
          <div tw="text-6xl">Click start to yoink the flag. 🚩</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
