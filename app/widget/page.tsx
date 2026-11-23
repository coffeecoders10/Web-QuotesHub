import type { Metadata } from "next";
import QuoteScreen from "../quote-screen";

export const metadata: Metadata = { title: "Coffee Quotes", robots: { index: false, follow: false } };

export default function WidgetPage() {
  return <QuoteScreen mode="widget" />;
}
