export default function AnimatedTick({ size = 96, delay = 0.2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      aria-label="Success"
    >
      <defs>
        <linearGradient id="tick-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <filter id="tick-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#22c55e" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Soft glow ring */}
      <circle cx="50" cy="50" r="48" fill="#22c55e" opacity="0.12" />

      {/* Solid gradient circle */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="url(#tick-gradient)"
        filter="url(#tick-shadow)"
      >
        <animate
          attributeName="r"
          from="0"
          to="40"
          dur="0.4s"
          begin={`${delay}s`}
          fill="freeze"
          calcMode="spline"
          keySplines="0.34 1.56 0.64 1"
        />
      </circle>

      {/* Tick stroke — draws itself */}
      <path
        d="M30 52 L44 66 L70 38"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray="120"
        strokeDashoffset="120"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="120"
          to="0"
          dur="0.45s"
          begin={`${delay + 0.35}s`}
          fill="freeze"
        />
      </path>
    </svg>
  )
}