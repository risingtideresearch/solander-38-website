import type { Metadata } from "next";

import "./../globals.scss";
import Search from "./../components/Search/Search";

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
      <body>
        <Search type='float' />
        {children}
      </body>
    </html>
  );
}
