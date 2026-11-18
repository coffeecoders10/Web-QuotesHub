// Builds app/quotes.json from docs/movie_dialogues_enriched.json (keeps palette, drops avatar SVGs).
import { readFileSync, writeFileSync } from "node:fs";

const src = JSON.parse(readFileSync("docs/movie_dialogues_enriched.json", "utf8"));
const seen = new Set();
const out = [];
for (const q of src) {
  const text = q.dialogue_original?.trim();
  if (!text || seen.has(text)) continue;
  seen.add(text);
  const colors = q.character_svg.match(/stop-color="(#[0-9A-Fa-f]{6})"/g)?.map((s) => s.slice(12, 19)) ?? [];
  out.push({
    text,
    translation: q.language !== "English" ? q.english_translation?.trim() || null : null,
    lang: q.language,
    movie: q.movie,
    speaker: q.who_said_it,
    year: q.catalogue_year ?? null,
    c0: colors[0] ?? "#243B55",
    c1: colors[1] ?? "#C99A6B",
  });
}
writeFileSync("app/quotes.json", JSON.stringify(out));
console.log(out.length, "quotes");
