import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "yoink the flag";
export const size = {
  width: 800,
  height: 420,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        tw="h-full w-full flex justify-center items-center relative"
        style={{
          backgroundImage: "url(https://yoink.party/frame.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div tw="flex flex-col items-center bg-white/80 p-12 rounded-xl">
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
