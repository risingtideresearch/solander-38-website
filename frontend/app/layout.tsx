import type { Metadata } from "next";
import { AcuminPro } from "./_fonts";
import { SanityLive } from "@/sanity/lib/live";

import "./globals.scss";
import "./home.module.scss";

export const metadata: Metadata = {
  title: "Solander 38 | Rising Tide Research Foundation",
  description:
    "A self-sufficient, solar-electric, coastal cruising power catamaran.",
  icons: "https://solander38.netlify.app/rising-tide.svg",
  openGraph: {
    images: [
      {
        url: `https://cdn.sanity.io/images/qjczz6gi/production/63be9a7d70123bdba30eba1b8e1686adaac2c7c2-4032x3024.jpg`,
        width: 1600,
        height: 840,
        alt: `Solander 38`,
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
      <body>
        {children}
        {process.env.NEXT_PUBLIC_PREVIEW_SITE === "true" && <SanityLive />}
      </body>
    </html>
  );
}
