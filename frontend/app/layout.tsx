import type { Metadata } from "next";
import { DepartureMono } from "./_fonts";

import "./globals.scss";
import Navigation from "./components/Navigation";
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
        <Navigation />
        {children}
        {/* <Search /> */}
        <footer>
          <div className="wide">
            <h6>
              <svg
                width="59"
                height="78"
                viewBox="0 0 59 78"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.9 77.6C20 68.8 24.8 54.9 26.7 49.5H0L7.7 40.7C18.5 37.7 23.4 39.9 28.3 42C32.8 44 37.2 45.9 44.5 45.3L16.9 77.6Z"
                  fill="#000"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M42.4 0C39.3 8.8 34.5 22.7 32.6 28.1H58.9L51.7 36.8C40.8 39.9 36 37.8 31.1 35.7C26.7 33.8 22.2 31.8 15 32.4L42.4 0Z"
                  fill="#000"
                />
              </svg>
              Rising Tide Research Foundation
            </h6>
            <h6>info@risingtideresearch.org</h6>
          </div>
        </footer>
      </body>
    </html>
  );
}
