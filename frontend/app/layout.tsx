import type { Metadata } from "next";

import "./globals.scss";
import "./home.scss";

export const metadata: Metadata = {
  title: "Solander 38 | Rising Tide Research Foundation",
  description: "A self-sufficient, solar-electric, coastal cruising power catamaran.",
  icons: "https://solander38.netlify.app/rising-tide.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
