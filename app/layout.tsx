import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Montserrat,
  Noto_Serif_Devanagari,
  Noto_Serif_JP,
  Noto_Serif_KR,
} from "next/font/google";
import "./globals.css";

const latin = Cormorant_Garamond({
  variable: "--font-latin",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const ui = Montserrat({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const deva = Noto_Serif_Devanagari({
  variable: "--font-deva",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500"],
  preload: false,
});

const jp = Noto_Serif_JP({
  variable: "--font-jp",
  weight: ["400"],
  preload: false,
});

const kr = Noto_Serif_KR({
  variable: "--font-kr",
  weight: ["400"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Quote of the Day",
  description: "One line from the movies, every day.",
};

export const viewport: Viewport = {
  themeColor: "#14171c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${latin.variable} ${ui.variable} ${deva.variable} ${jp.variable} ${kr.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
