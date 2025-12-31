import type { Metadata } from "next";

import "./../globals.scss";
import Search from "./../components/Search/Search";
import { AcuminSansLight, AcuminSansRegular, AcuminSansSemibold } from "../_fonts";

export const metadata: Metadata = {
  title: "Rising Tide Research Foundation",
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
      <body className={`${AcuminSansLight.variable} ${AcuminSansRegular.variable} ${AcuminSansSemibold.variable}`}>
        <Search type='float' />
        {children}
      </body>
    </html>
  );
}
