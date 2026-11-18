import quotes from "./quotes.json";

export type Quote = (typeof quotes)[number];
export const ALL_QUOTES: Quote[] = quotes;

/** Small seeded PRNG so the daily order is the same for every visitor. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fixed shuffle: every quote appears once before any repeats.
const ORDER = (() => {
  const idx = ALL_QUOTES.map((_, i) => i);
  const rand = mulberry32(20260101);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
})();

/** Index of today's quote, using the visitor's local calendar day. */
export function dailyIndex(now = new Date()) {
  const day = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000,
  );
  return ORDER[day % ORDER.length];
}

/** Random index that never repeats the current one. */
export function randomIndex(current: number) {
  const n = ALL_QUOTES.length;
  return (current + 1 + Math.floor(Math.random() * (n - 1))) % n;
}
