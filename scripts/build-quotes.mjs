// Builds app/quotes.json from docs/quotes.json, the merged + recolored list from recolor-quotes.mjs (slim keys, cleaned attribution).
import { readFileSync, writeFileSync } from "node:fs";

const src = JSON.parse(readFileSync("docs/quotes.json", "utf8"));
const seen = new Set();
const out = [];
for (const q of src) {
  const text = q.Quote?.trim();
  if (!text || seen.has(text)) continue;
  seen.add(text);
  let speaker = (q["Speaker / Character"] ?? "").replace(/\s*\((?:attribution|speaker)[^)]*\)\s*$/i, "").trim();
  if (/^u\/unknown$/i.test(speaker)) speaker = "";
  out.push({
    id: q.ID,
    text,
    speaker,
    source: q.Source,
    medium: q.Medium,
    genre: q["Genre / Mood"],
    c0: q.Primary,
    c1: q.Secondary,
    c2: q.Accent,
    url: q["Source URL"] || null,
  });
}
writeFileSync("app/quotes.json", JSON.stringify(out));
console.log(out.length, "quotes");
