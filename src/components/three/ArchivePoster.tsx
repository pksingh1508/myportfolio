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
      style={{
        aspectRatio: "4 / 3",
        width: "100%",
        borderRadius: "var(--radius-frame-lg)",
        border: "1px solid var(--color-line)",
        backgroundColor: "var(--color-white)",
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 400 300"
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="xMidYMid slice"
      >
        <ellipse
          cx="200"
          cy="215"
          rx="118"
          ry="34"
          fill="none"
          stroke="#DDE1E8"
          strokeWidth="1.5"
        />
        <ellipse
          cx="200"
          cy="215"
          rx="78"
          ry="22"
          fill="none"
          stroke="#DDE1E8"
          strokeWidth="1"
          strokeDasharray="4 5"
        />
        <rect
          x="188"
          y="72"
          width="24"
          height="148"
          rx="4"
          fill="#15171B"
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
            fill="#F7F8FC"
            stroke="#6F737B"
            strokeWidth="1.5"
          />
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
            fill="#F7F8FC"
            stroke="#6F737B"
            strokeWidth="1.5"
          />
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
            fill="#F7F8FC"
            stroke="#6F737B"
            strokeWidth="1.5"
          />
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
        <g fill="#6F737B" opacity="0.55">
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
