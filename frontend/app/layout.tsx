import type { Metadata } from "next";
import { AcuminPro } from "./_fonts";

import "./globals.scss";
import "./home.scss";

export const metadata: Metadata = {
  title: "Solander 38 | Rising Tide Research Foundation",
  description:
    "A self-sufficient, solar-electric, coastal cruising power catamaran.",
  icons: "https://solander38.netlify.app/rising-tide.svg",
  openGraph: {
    images: [
      {
        url: `https://solander38.netlify.app/preview.solander-38.png`,
        width: 1600,
        height: 840,
        alt: `Model of Solander 38`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={AcuminPro.variable}>
      <body>{children}</body>
    </html>
  );
}
