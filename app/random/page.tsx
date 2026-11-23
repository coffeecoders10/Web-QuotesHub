import type { Metadata } from "next";
import QuoteScreen from "../quote-screen";

// Unlisted: nothing links here and search engines are asked to skip it.
export const metadata: Metadata = { title: "Random quote", robots: { index: false, follow: false } };

export default function RandomPage() {
  return <QuoteScreen mode="random" />;
}
