import { ImageResponse } from "next/og";

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
          backgroundImage: "url(https://yoink.party/blank_frame.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div tw="flex flex-col items-center p-12 rounded-xl">
          <img
            src="https://yoink.party/castout.png"
            alt="Castout Logo"
            style={{ width: 400, marginTop: 200 }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    },
  );
}
