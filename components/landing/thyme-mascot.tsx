export function ThymeMascot({
  size = 240,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Thyme"
    >
      <title>Thyme</title>
      <path
        d="M 75 72 Q 120 70 165 72"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M 120 72 Q 121 118 119 156 Q 117 186 120 198"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <g transform="translate(120 102) rotate(198)">
        <path
          d="M 0 0 C 3.6 -7.56, 13.2 -10.08, 24 0 C 13.2 10.08, 3.6 7.56, 0 0 Z"
          fill="currentColor"
        />
      </g>
      <g transform="translate(120 102) rotate(-18)">
        <path
          d="M 0 0 C 3.6 -7.56, 13.2 -10.08, 24 0 C 13.2 10.08, 3.6 7.56, 0 0 Z"
          fill="currentColor"
        />
      </g>
      <g transform="translate(119 132) rotate(208)">
        <path
          d="M 0 0 C 3 -6.3, 11 -8.4, 20 0 C 11 8.4, 3 6.3, 0 0 Z"
          fill="currentColor"
        />
      </g>
      <g transform="translate(120 132) rotate(-28)">
        <path
          d="M 0 0 C 3 -6.3, 11 -8.4, 20 0 C 11 8.4, 3 6.3, 0 0 Z"
          fill="currentColor"
        />
      </g>
      <g transform="translate(118 160) rotate(218)">
        <path
          d="M 0 0 C 2.4 -5.04, 8.8 -6.72, 16 0 C 8.8 6.72, 2.4 5.04, 0 0 Z"
          fill="currentColor"
        />
      </g>
      <g transform="translate(119 160) rotate(-38)">
        <path
          d="M 0 0 C 2.4 -5.04, 8.8 -6.72, 16 0 C 8.8 6.72, 2.4 5.04, 0 0 Z"
          fill="currentColor"
        />
      </g>
      <circle cx="118" cy="188" r="1.8" fill="currentColor" />
      <circle cx="122" cy="190" r="1.5" fill="currentColor" />
      <circle cx="120" cy="194" r="1.6" fill="currentColor" />
      <circle cx="116" cy="194" r="1.3" fill="currentColor" />
      <circle cx="123" cy="197" r="1.3" fill="currentColor" />
    </svg>
  );
}
