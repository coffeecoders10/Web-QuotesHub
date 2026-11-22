"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { ALL_QUOTES, dailyIndex as computeDaily, randomIndex } from "./quote-engine";
import Backdrop from "./quote-backdrop";
import { describe, hostOf, sizeTier, typeset, voiceOf } from "./quote-style";
import styles from "./quote-screen.module.css";

const SWAP_MS = 320;

const STATUS_NOTE: Record<string, string> = {
  unverified: "Attribution unverified",
  disputed: "Attribution disputed",
};

const dayFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" });

const subscribeNever = () => () => {};
const getServerToday = () => null;

export default function QuoteScreen() {
  // Today's quote depends on the visitor's local date: null on the server, resolved on the client.
  const today = useSyncExternalStore(subscribeNever, computeDaily, getServerToday);
  const [picked, setPicked] = useState<number | null>(null);
  const index = picked ?? today;
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const go = useCallback(
    (next: (cur: number) => number) => {
      if (index === null) return;
      clearTimeout(timer.current);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPicked(next(index));
        return;
      }
      setLeaving(true);
      timer.current = setTimeout(() => {
        setPicked(next(index));
        setLeaving(false);
      }, SWAP_MS);
    },
    [index],
  );

  const shuffle = useCallback(() => go(randomIndex), [go]);
  const backToToday = useCallback(() => {
    if (today !== null) go(() => today);
  }, [go, today]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "arrowright" || k === "r") shuffle();
      if (k === "t") backToToday();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shuffle, backToToday]);

  const q = index === null ? null : ALL_QUOTES[index];
  const away = q !== null && index !== today;

  return (
    <main
      className={styles.screen}
      style={q ? ({ "--c0": q.c0, "--c1": q.c1, "--c2": q.c2 } as CSSProperties) : undefined}
    >
      {q && <Backdrop key={`bg-${index}`} voice={voiceOf(q)} />}
      {q && (
        <figure
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
            <span className={styles.speaker}>{q.speaker || "Unknown author"}</span>
            {q.source !== q.speaker && (
              <cite className={styles.source}>
                {q.url ? (
                  <a href={q.url} target="_blank" rel="noopener noreferrer" title={`Open on ${hostOf(q.url)}`}>
                    {q.source}
                  </a>
                ) : (
                  q.source
                )}
              </cite>
            )}
            <span className={styles.kind}>{describe(q)}</span>
            {STATUS_NOTE[q.status] && <span className={styles.note}>{STATUS_NOTE[q.status]}</span>}
          </figcaption>
        </figure>
      )}

      {q && (
        <p className={styles.date}>{away ? "Not today’s quote" : dayFormat.format(new Date())}</p>
      )}

      <div className={styles.controls}>
        {away && (
          <button
            type="button"
            className={styles.ghost}
            onClick={backToToday}
            aria-label="Back to today’s quote"
            title="Today’s quote (T)"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden fill="currentColor">
              <circle cx="8" cy="8" r="2.5" />
            </svg>
          </button>
        )}
        <button
          type="button"
          className={styles.ghost}
          onClick={shuffle}
          aria-label="Show another quote"
          title="Another quote (R)"
        >
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
        </button>
      </div>
    </main>
  );
}
