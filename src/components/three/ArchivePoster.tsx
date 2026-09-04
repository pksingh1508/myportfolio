type ArchivePosterProps = {
  readonly label?: string;
};

/**
 * Static poster: same 4/3 stage box as the live canvas, drawn as inline SVG
 * in plan palette. Used as the dynamic-import loading state and as the
 * full-failure fallback, so layout never shifts between states.
 */
export default function ArchivePoster({
  label = "Orbital archive preview",
}: ArchivePosterProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className="archive-poster"
    >
      <svg
        viewBox="0 0 400 300"
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="archive-poster-glow" cx="50%" cy="48%" r="56%">
            <stop offset="0" stopColor="#635BFF" stopOpacity="0.18" />
            <stop offset="0.72" stopColor="#635BFF" stopOpacity="0.025" />
            <stop offset="1" stopColor="#0C0E12" stopOpacity="0" />
          </radialGradient>
          <filter id="archive-edge-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <rect width="400" height="300" fill="#0C0E12" />
        <rect width="400" height="300" fill="url(#archive-poster-glow)" />
        <g stroke="#242833" strokeWidth="0.6" opacity="0.65">
          <path d="M0 60H400M0 120H400M0 180H400M0 240H400" />
          <path d="M80 0V300M160 0V300M240 0V300M320 0V300" />
        </g>
        <ellipse
          cx="200"
          cy="215"
          rx="118"
          ry="34"
          fill="none"
          stroke="#4A4E59"
          strokeWidth="1.5"
        />
        <ellipse
          cx="200"
          cy="215"
          rx="78"
          ry="22"
          fill="none"
          stroke="#343844"
          strokeWidth="1"
          strokeDasharray="4 5"
        />
        <rect
          x="188"
          y="72"
          width="24"
          height="148"
          rx="4"
          fill="#222630"
        />
        <rect
          x="187"
          y="71"
          width="26"
          height="150"
          rx="5"
          fill="none"
          stroke="#635BFF"
          strokeWidth="4"
          opacity="0.22"
          filter="url(#archive-edge-glow)"
        />
        <rect
          x="188"
          y="72"
          width="24"
          height="148"
          rx="4"
          fill="none"
          stroke="#635BFF"
          strokeWidth="1.5"
        />
        <g>
          <rect
            x="66"
            y="128"
            width="76"
            height="48"
            rx="8"
            fill="#E9EAF0"
            stroke="#818692"
            strokeWidth="1.5"
          />
          <rect x="75" y="136" width="58" height="30" rx="4" fill="#151820" />
          <path d="M82 145H111M82 151H126M82 157H101" stroke="#B9B6FF" strokeWidth="2" opacity="0.8" />
          <rect
            x="66"
            y="128"
            width="76"
            height="48"
            rx="8"
            fill="none"
            stroke="#635BFF"
            strokeWidth="1.5"
            strokeDasharray="10 178"
            strokeLinecap="round"
          />
        </g>
        <g>
          <rect
            x="258"
            y="108"
            width="76"
            height="48"
            rx="8"
            fill="#E9EAF0"
            stroke="#818692"
            strokeWidth="1.5"
          />
          <rect x="267" y="116" width="58" height="30" rx="4" fill="#151820" />
          <path d="M274 125H308M274 131H317M274 137H295" stroke="#B9B6FF" strokeWidth="2" opacity="0.8" />
          <rect
            x="258"
            y="108"
            width="76"
            height="48"
            rx="8"
            fill="none"
            stroke="#635BFF"
            strokeWidth="1.5"
            strokeDasharray="10 178"
            strokeLinecap="round"
          />
        </g>
        <g>
          <rect
            x="162"
            y="196"
            width="76"
            height="48"
            rx="8"
            fill="#E9EAF0"
            stroke="#818692"
            strokeWidth="1.5"
          />
          <rect x="171" y="204" width="58" height="30" rx="4" fill="#151820" />
          <path d="M178 213H210M178 219H220M178 225H197" stroke="#B9B6FF" strokeWidth="2" opacity="0.8" />
          <rect
            x="162"
            y="196"
            width="76"
            height="48"
            rx="8"
            fill="none"
            stroke="#635BFF"
            strokeWidth="1.5"
            strokeDasharray="10 178"
            strokeLinecap="round"
          />
        </g>
        <g fill="#B9B6FF" opacity="0.5">
          <circle cx="120" cy="70" r="2" />
          <circle cx="285" cy="60" r="1.6" />
          <circle cx="330" cy="200" r="2" />
          <circle cx="70" cy="230" r="1.6" />
          <circle cx="240" cy="45" r="1.4" />
        </g>
      </svg>
    </div>
  );
}
