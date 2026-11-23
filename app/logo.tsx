/** The mark: two closing quote marks over an ember rule. Flat, matches public/logo.svg. */
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} aria-hidden>
      <rect width="512" height="512" rx="112" fill="#1b2230" />
      <g fill="#e8e0d2">
        <g id="logo-mark" transform="translate(190 190)">
          <circle r="52" />
          <path d="M52 0V10C52 74 14 118-42 132L-54 100C-18 88 0 64 0 36Z" />
        </g>
        <use href="#logo-mark" x="132" />
      </g>
      <rect x="150" y="372" width="212" height="22" rx="11" fill="#c8894b" />
    </svg>
  );
}
