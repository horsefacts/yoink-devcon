import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";
export const alt = "Yoink Castout Event";
export const size = {
  width: 1260,
  height: 660,
};

export const contentType = "image/png";
export const revalidate = 300;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        tw="h-full w-full flex flex-col justify-center items-center"
        style={{
          backgroundImage: "url(https://yoink.party/frame.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div tw="flex flex-col items-center p-12 rounded-xl">
          <img
            src="https://yoink.party/castout.png"
            alt="Castout Logo"
            tw="h-48 w-48 object-contain"
          />
          <div tw="flex text-[50px] mt-4 text-white">Yoink! Castout</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
