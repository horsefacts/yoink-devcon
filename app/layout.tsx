import type { Metadata } from "next";
import "./globals.css";
import { WagmiProvider } from "./WagmiProvider";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Yoink!",
  description: "Click to yoink the flag.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#F5F0EC]">
      <body className="max-w-screen-sm mx-auto overflow-x-hidden">
        <WagmiProvider>{children}</WagmiProvider>
        <ToastContainer
          position="bottom-center"
          theme="light"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeButton={false}
          closeOnClick
          pauseOnHover
          style={{ bottom: "80px" }}
        />
      </body>
    </html>
  );
}
