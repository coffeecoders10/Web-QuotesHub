import type { Quote } from "./quote-engine";

/**
 * Each quote gets a "voice" (typeface + background motif) from its genre.
 * The genre string is "Main / angle / angle", so the first segment that matches wins.
 */
export type Voice = "gothic" | "epic" | "lyric" | "romantic" | "modern" | "casual" | "drama";

const RULES: [Voice, RegExp][] = [
  ["gothic", /gothic|tragedy|horror|mortality|grief|mystery|death|psychological|dark fantasy/],
  ["romantic", /romance|regency|\blove\b/],
  ["modern", /science fiction|dystopi|superhero|action|thriller|crime|heist|technology|apocalyptic|sports|disaster|noir/],
  ["casual", /comedy|satire|animation|coming of age|family|absurd|young adult|holiday|children|friendship|humou?r|kindness|growing up|slice of life/],
  ["epic", /fantasy|adventure|histor|stoic|strategy|survival|power|politic|resolve|resilience|courage|duty|morality/],
  ["lyric", /poetry|philosoph|nature|spiritual|reflection|existential|memory|impermanence|literary|identity|introspection|beauty|wonder|wisdom|time|perception|mindfulness|humanism|transcendental|mortality|ecology/],
];

export function voiceOf(q: Pick<Quote, "genre" | "medium">): Voice {
  if (q.medium === "Reddit" || q.medium === "Tumblr") return "casual";
  for (const seg of q.genre.toLowerCase().split("/")) {
    for (const [voice, re] of RULES) if (re.test(seg)) return voice;
  }
  return "drama";
}

/** Longer quotes step down a size so the block stays a comfortable shape. */
export function sizeTier(text: string) {
  const n = text.length;
  return n <= 55 ? "s" : n <= 100 ? "m" : n <= 140 ? "l" : "xl";
}

/** Curly quotes and apostrophes; the source data uses straight ones. */
export function typeset(text: string) {
  return text
    .replace(/(^|[\s([—-])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/(^|[\s([—-])'/g, "$1‘")
    .replace(/'/g, "’");
}

export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}
