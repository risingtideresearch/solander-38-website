import type { Metadata } from "next";

import "./../globals.scss";
import Navigation, { URLS } from "../components/Navigation/Navigation";
import Search from "../components/Search/Search";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Solander 38 Stories",
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
        <Search />
        {children}
        <Footer />
      </body>
    </html>
  );
}
