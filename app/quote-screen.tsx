"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { ALL_QUOTES, dailyIndex as computeDaily, randomIndex } from "./quote-engine";
import Backdrop from "./quote-backdrop";
import Logo from "./logo";
import { sizeTier, typeset, voiceOf } from "./quote-style";
import styles from "./quote-screen.module.css";

/**
 * today: the landing page.
 * random: the unlisted /random page, with a button to draw another quote.
 * widget: today's quote, scaled to fill whatever frame it is embedded in.
 */
export type Mode = "today" | "random" | "widget";

const SWAP_MS = 320;

const dayFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" });

const subscribeNever = () => () => {};
const getServerNull = () => null;

// Drawn once per page load, so the first /random quote is stable across re-renders.
let firstRandom: number | null = null;
const getFirstRandom = () => (firstRandom ??= randomIndex(computeDaily()));

export default function QuoteScreen({ mode = "today" }: { mode?: Mode }) {
  // Today's quote depends on the visitor's local date: null on the server, resolved on the client.
  const start = useSyncExternalStore(subscribeNever, mode === "random" ? getFirstRandom : computeDaily, getServerNull);
  const [picked, setPicked] = useState<number | null>(null);
  const index = picked ?? start;
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const screen = useRef<HTMLElement>(null);
  const figure = useRef<HTMLElement>(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const shuffle = useCallback(() => {
    if (mode !== "random" || index === null) return;
    clearTimeout(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPicked(randomIndex(index));
      return;
    }
    setLeaving(true);
    timer.current = setTimeout(() => {
      setPicked(randomIndex(index));
      setLeaving(false);
    }, SWAP_MS);
  }, [mode, index]);

  useEffect(() => {
    if (mode !== "random") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "arrowright" || k === "r") shuffle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, shuffle]);

  // Widget: find the largest type size at which the quote and its attribution fit the frame.
  useLayoutEffect(() => {
    const el = screen.current;
    const fig = figure.current;
    if (mode !== "widget" || !el || !fig) return;
    const fit = () => {
      const cs = getComputedStyle(el);
      const room = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      let lo = 6;
      let hi = Math.max(lo, Math.min(el.clientWidth, el.clientHeight) * 0.5);
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        el.style.setProperty("--fs", String(mid));
        if (fig.offsetHeight <= room) lo = mid;
        else hi = mid;
      }
      el.style.setProperty("--fs", String(lo));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    // Fonts swap in after first paint and change the text's shape.
    document.fonts.addEventListener("loadingdone", fit);
    void document.fonts.ready.then(fit);
    return () => {
      ro.disconnect();
      document.fonts.removeEventListener("loadingdone", fit);
    };
  }, [mode, index]);

  const q = index === null ? null : ALL_QUOTES[index];
  const sameName = q !== null && q.source === q.speaker;

  return (
    <main
      ref={screen}
      className={styles.screen}
      data-mode={mode}
      style={q ? ({ "--c0": q.c0, "--c1": q.c1, "--c2": q.c2 } as CSSProperties) : undefined}
    >
      {q && <Backdrop key={`bg-${index}`} id={q.id} />}
      {mode !== "widget" && (
        <div className={styles.brand}>
          <Logo size={28} />
          <span>Coffee Quotes</span>
        </div>
      )}
      {q && (
        <figure
          ref={figure}
          className={styles.figure}
          data-leaving={leaving ? "" : undefined}
          data-voice={voiceOf(q)}
          data-size={sizeTier(q.text)}
          key={index}
          aria-live="polite"
        >
          <blockquote className={styles.quote}>
            <p>{typeset(q.text)}</p>
          </blockquote>
          <figcaption className={styles.caption}>
            <span className={styles.byline}>
              <span aria-hidden>— </span>
              <span className={styles.speaker}>{q.speaker || q.source}</span>
            </span>
            <span className={styles.medium}>
              {q.speaker && !sameName && (
                <cite className={styles.source}>
                  {q.url ? (
                    <a href={q.url} target="_blank" rel="noopener noreferrer">
                      {q.source}
                    </a>
                  ) : (
                    q.source
                  )}
                </cite>
              )}
              {q.speaker && !sameName && <span aria-hidden> · </span>}
              {q.medium}
            </span>
          </figcaption>
        </figure>
      )}

      {q && mode === "today" && <p className={styles.date}>{dayFormat.format(new Date())}</p>}

      {mode !== "widget" && (
        <p className={styles.credit}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/coffeecoders_logo.png" alt="" width={22} height={22} />
          <span>Built by CoffeeCoders</span>
        </p>
      )}

      {mode === "random" && (
        <div className={styles.controls}>
          <button type="button" className={styles.refresh} onClick={shuffle} title="Another quote (R)">
            <svg
              viewBox="0 0 16 16"
              width="16"
              height="16"
              aria-hidden
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9" />
              <path d="M13.5 2.5v2.6h-2.6" />
            </svg>
            Refresh quote
          </button>
        </div>
      )}
    </main>
  );
}
