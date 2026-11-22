// Spreads each quote's palette apart (keeps hues) and merges the two source files into docs/quotes.json.
// Primary → deep, Secondary → vivid mid-tone, Accent → near-white. Idempotent.
import { readFileSync, writeFileSync } from "node:fs";

const toLin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toSrgb = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

function hexToOklch(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => toLin(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), h: Math.atan2(B, A) };
}

function oklchToRgb({ L, C, h }) {
  const A = C * Math.cos(h), B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function fit(L, C, h) {
  for (let c = C; c >= 0; c -= 0.002) {
    const rgb = oklchToRgb({ L, C: c, h });
    if (rgb.every((v) => v >= -0.0005 && v <= 1.0005)) {
      return "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, toSrgb(Math.max(0, v)))) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
    }
  }
  return "#000000";
}

function recolor(q) {
  const p = hexToOklch(q.Primary), s = hexToOklch(q.Secondary), a = hexToOklch(q.Accent);
  return {
    ...q,
    Primary: fit(0.2, Math.min(0.09, Math.max(p.C, 0.04) * 1.2), p.h),
    Secondary: fit(0.68, Math.min(0.17, Math.max(s.C * 1.5, 0.11)), s.h),
    Accent: fit(0.95, Math.min(0.045, Math.max(a.C, 0.02)), a.h),
  };
}

const files = ["docs/quotes_800.json", "docs/quotes_400.json"];
const merged = [];
for (const f of files) {
  const recolored = JSON.parse(readFileSync(f, "utf8")).map(recolor);
  writeFileSync(f, JSON.stringify(recolored, null, 2) + "\n");
  merged.push(...recolored);
}
const ids = new Set(merged.map((q) => q.ID));
if (ids.size !== merged.length) throw new Error("duplicate IDs across files");
writeFileSync("docs/quotes.json", JSON.stringify(merged, null, 2) + "\n");
console.log(merged.length, "quotes merged");
