import type { Metadata } from "next";

import "./../globals.scss";
import Navigation, { URLS } from "./../components/Navigation";
import Search from "./../components/Search/Search";
import Footer from "../components/Footer";
import { AcuminSansLight, AcuminSansRegular, AcuminSansSemibold } from "../_fonts";
// import Search from "./components/Search/Search";

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
        <Navigation active={URLS.PEOPLE} type={'top-bar'} />
        <Search />
        {children}
        <Footer />
      </body>
    </html>
  );
}
