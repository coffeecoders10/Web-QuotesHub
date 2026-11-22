import type { CSSProperties } from "react";
import styles from "./quote-backdrop.module.css";

/** Small seeded PRNG so a quote always gets the same arrangement. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

// Tone mix: mostly secondary, some accent so the light is warm, a little ground to add depth.
const TONES = ["--c1", "--c1", "--c1", "--c2", "--c2", "--c0"] as const;

function blobs(id: string) {
  const rand = mulberry32(hash(id));
  const between = (a: number, b: number) => a + rand() * (b - a);
  return TONES.map((tone, i) => {
    const size = between(38, 78); // % of the screen's width
    const accent = tone === "--c2";
    return {
      key: i,
      style: {
        left: `${between(-15, 90)}%`,
        top: `${between(-20, 85)}%`,
        width: `${size}%`,
        aspectRatio: `${between(0.7, 1.6)}`,
        rotate: `${between(0, 180)}deg`,
        "--tone": `var(${tone})`,
        "--strength": `${tone === "--c0" ? 70 : accent ? between(18, 30) : between(55, 82)}%`,
        "--blur": `${between(30, 70)}px`,
      } as CSSProperties,
    };
  });
}

/** Soft, structureless colour fields drawn from the quote's own palette. */
export default function Backdrop({ id }: { id: string }) {
  return (
    <div className={styles.backdrop} aria-hidden>
      {blobs(id).map((b) => (
        <i key={b.key} className={styles.blob} style={b.style} />
      ))}
    </div>
  );
}
