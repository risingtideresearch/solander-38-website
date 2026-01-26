import type { Metadata } from "next";

import "./../globals.scss";
import Search from "./../components/Search/Search";
import Footer from "../components/Footer";
// import Search from "./components/Search/Search";

export const metadata: Metadata = {
  title: "Drawings | Solander 38",
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
