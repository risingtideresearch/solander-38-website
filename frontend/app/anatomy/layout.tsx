import type { Metadata } from "next";

import "./../globals.scss";
import Search from "./../components/Search/Search";
import { AcuminPro } from "../_fonts";

export const metadata: Metadata = {
  title: "Anatomy | Solander 38",
  description: "",
  icons: "https://solander38.netlify.app/rising-tide.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={AcuminPro.variable}>
        <Search type="float" />
        {children}
      </body>
    </html>
  );
}
