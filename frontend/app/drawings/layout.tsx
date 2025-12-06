import type { Metadata } from "next";
import { DepartureMono } from "./../_fonts";

import "./../globals.scss";
import Navigation, { URLS } from "./../components/Navigation";
import Search from "./../components/Search/Search";
import Footer from "../components/Footer";
// import Search from "./components/Search/Search";

export const metadata: Metadata = {
  title: "Rising Tide Research Foundation",
  description: "",
  icons: "/rising-tide.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${DepartureMono.variable}`}>
        <Navigation type={'top-bar'} active={URLS.DRAWINGS} />
        <Search />
        {children}
        <Footer />
      </body>
    </html>
  );
}
