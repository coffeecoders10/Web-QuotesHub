import type { Voice } from "./quote-style";
import styles from "./quote-backdrop.module.css";

/**
 * One quiet geometric motif per voice, drawn with the quote's own secondary (fill)
 * and accent (hairline) colors. Shapes sit off-centre so the quote keeps the middle.
 */
function Motif({ voice }: { voice: Voice }) {
  switch (voice) {
    case "gothic": // a pointed-arch window, the cathedral nave behind a tragedy
      return (
        <>
          <path className={styles.fill} opacity=".13" d="M1090 1000V430C1090 330 1180 250 1290 170C1400 250 1490 330 1490 430V1000Z" />
          <path className={styles.line} opacity=".4" d="M1130 1000V440C1130 355 1205 285 1290 225C1375 285 1450 355 1450 440V1000" />
          <path className={styles.line} opacity=".22" d="M1170 1000V450C1170 385 1225 335 1290 290C1355 335 1410 385 1410 450V1000" />
          <path className={styles.fill} opacity=".07" d="M120 1000V640C120 590 160 550 210 500C260 550 300 590 300 640V1000Z" />
        </>
      );
    case "epic": // a sun or moon rising behind a horizon, ringed like a map
      return (
        <>
          <circle className={styles.fill} opacity=".16" cx="800" cy="930" r="330" />
          <circle className={styles.line} opacity=".34" cx="800" cy="930" r="330" />
          <circle className={styles.line} opacity=".2" cx="800" cy="930" r="450" />
          <circle className={styles.line} opacity=".12" cx="800" cy="930" r="590" />
          <circle className={styles.line} opacity=".07" cx="800" cy="930" r="750" />
        </>
      );
    case "lyric": // strata of land and water, each layer a little closer
      return (
        <>
          <path className={styles.fill} opacity=".07" d="M0 640C260 570 480 700 800 640S1340 560 1600 630V1000H0Z" />
          <path className={styles.fill} opacity=".1" d="M0 720C300 660 520 780 820 720S1360 650 1600 710V1000H0Z" />
          <path className={styles.fill} opacity=".14" d="M0 810C320 760 560 860 860 810S1380 750 1600 800V1000H0Z" />
          <path className={styles.line} opacity=".4" d="M0 640C260 570 480 700 800 640S1340 560 1600 630" />
          <circle className={styles.fill} opacity=".2" cx="1230" cy="250" r="64" />
        </>
      );
    case "romantic": // two circles that overlap, one pulled toward the other
      return (
        <>
          <circle className={styles.fill} opacity=".15" cx="1130" cy="400" r="310" />
          <circle className={styles.line} opacity=".4" cx="1330" cy="560" r="310" />
          <circle className={styles.line} opacity=".18" cx="1130" cy="400" r="410" />
        </>
      );
    case "modern": // orbits around a body, tilted off axis
      return (
        <g transform="rotate(-16 1180 340)">
          <ellipse className={styles.line} opacity=".3" cx="1180" cy="340" rx="560" ry="190" />
          <ellipse className={styles.line} opacity=".17" cx="1180" cy="340" rx="760" ry="290" />
          <circle className={styles.fill} opacity=".22" cx="1180" cy="340" r="120" />
          <circle className={styles.dot} opacity=".7" cx="1460" cy="505" r="9" />
        </g>
      );
    case "casual": // plain Bauhaus shapes, a little loose
      return (
        <>
          <circle className={styles.fill} opacity=".2" cx="1290" cy="250" r="230" />
          <path className={styles.dot} opacity=".16" d="M-40 1000A340 340 0 0 1 640 1000Z" />
          <circle className={styles.line} opacity=".4" cx="1180" cy="820" r="70" />
        </>
      );
    default: // drama: a single beam, as if from a stage light
      return (
        <>
          <path className={styles.fill} opacity=".12" d="M1180-30L1540-30L1010 1030L330 1030Z" />
          <path className={styles.line} opacity=".3" d="M1180-30L330 1030" />
        </>
      );
  }
}

export default function Backdrop({ voice }: { voice: Voice }) {
  return (
    <svg className={styles.backdrop} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false">
      <Motif voice={voice} />
    </svg>
  );
}
