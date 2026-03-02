import localFont from "next/font/local";

export const AcuminPro = localFont({
  src: [
    { path: "./acuminpro-light-webfont.woff2", weight: "300" },
    { path: "./acuminpro-regular-webfont.woff2", weight: "400" },
    { path: "./acuminpro-semibold-webfont.woff2", weight: "600" },
  ],
  variable: "--font-acumin",
});
