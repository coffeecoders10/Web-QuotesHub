import type { Metadata, Viewport } from "next";
import {
  Bodoni_Moda,
  Bricolage_Grotesque,
  Gloock,
  Hanken_Grotesk,
  IM_Fell_English,
  Jost,
  Marcellus,
  Spectral,
} from "next/font/google";
import "./globals.css";

// One typeface per voice (see quote-style.ts). Only the UI face is preloaded;
// the rest load when a quote that uses them is shown.
const gothic = IM_Fell_English({ variable: "--font-gothic", weight: "400", style: ["normal", "italic"], preload: false });
const epic = Marcellus({ variable: "--font-epic", weight: "400", preload: false });
const lyric = Spectral({ variable: "--font-lyric", weight: ["300", "400"], style: ["normal", "italic"], preload: false });
const romantic = Bodoni_Moda({ variable: "--font-romantic", weight: ["400", "500"], style: ["normal", "italic"], preload: false });
const modern = Jost({ variable: "--font-modern", weight: ["300", "400"], preload: false });
const casual = Bricolage_Grotesque({ variable: "--font-casual", weight: ["400", "500"], preload: false });
const drama = Gloock({ variable: "--font-drama", weight: "400", preload: false });
const ui = Hanken_Grotesk({ variable: "--font-ui", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Quote of the Day",
  description: "One line from a book, film, show or thread, every day.",
};

export const viewport: Viewport = {
  themeColor: "#14171c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const fonts = [gothic, epic, lyric, romantic, modern, casual, drama, ui].map((f) => f.variable).join(" ");
  return (
    <html lang="en" className={fonts}>
      <body>{children}</body>
    </html>
  );
}
