import type { Metadata } from "next";
import QuoteScreen from "../quote-screen";

export const metadata: Metadata = { title: "Quote of the Day", robots: { index: false, follow: false } };

export default function WidgetPage() {
  return <QuoteScreen mode="widget" />;
}
