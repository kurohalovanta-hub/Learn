"use client";

// The HALO mark, drawn — not generated. A crisp perspective ring of light with
// an orbiting node and concentric echoes. Pure SVG, scales to any size, sharp
// on every display. Used as the login centrepiece, the nav emblem, and accents.

export function Halo({ size = 320, className = "", spin = true }: { size?: number; className?: string; spin?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="halo-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8ff0ff" />
          <stop offset="50%" stopColor="#4dd6e8" />
          <stop offset="100%" stopColor="#7c6bff" />
        </linearGradient>
        <radialGradient id="halo-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4dd6e8" stopOpacity="0.28" />
          <stop offset="70%" stopColor="#4dd6e8" stopOpacity="0" />
        </radialGradient>
        <filter id="halo-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* soft inner bloom */}
      <circle cx="100" cy="100" r="82" fill="url(#halo-core)" />

      {/* a crossing orbital ring — reads as real 3D depth, not a flat circle */}
      <g transform="rotate(64 100 100)" opacity="0.55">
        <ellipse cx="100" cy="100" rx="78" ry="26" stroke="url(#halo-stroke)" strokeWidth="1.25" strokeOpacity="0.6" />
      </g>

      {/* concentric echo rings */}
      <g opacity="0.4" transform="rotate(-24 100 100)">
        <ellipse cx="100" cy="100" rx="90" ry="36" stroke="#4dd6e8" strokeOpacity="0.28" strokeWidth="0.75" />
        <ellipse cx="100" cy="100" rx="60" ry="23" stroke="#7c6bff" strokeOpacity="0.24" strokeWidth="0.75" />
      </g>

      {/* the primary ring, tilted in perspective, with a glow underlay */}
      <g transform="rotate(-24 100 100)">
        <ellipse cx="100" cy="100" rx="78" ry="31" stroke="url(#halo-stroke)" strokeWidth="6" filter="url(#halo-blur)" opacity="0.95" />
        <ellipse cx="100" cy="100" rx="78" ry="31" stroke="url(#halo-stroke)" strokeWidth="2" />
        {/* the travelling node — a point of progress on the ring */}
        <g style={spin ? { animation: "halo-orbit 7s linear infinite", transformOrigin: "100px 100px" } : undefined}>
          <circle cx="178" cy="100" r="4" fill="#eafcff" />
          <circle cx="178" cy="100" r="9" fill="#4dd6e8" opacity="0.55" filter="url(#halo-blur)" />
        </g>
      </g>
    </svg>
  );
}

/* small solid emblem for the nav / favicon-scale use */
export function HaloMark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="halomark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8ff0ff" />
          <stop offset="100%" stopColor="#4dd6e8" />
        </linearGradient>
      </defs>
      <g transform="rotate(-24 16 16)">
        <ellipse cx="16" cy="16" rx="12" ry="5" stroke="url(#halomark)" strokeWidth="2" />
        <circle cx="28" cy="16" r="2.4" fill="#eafcff" />
      </g>
    </svg>
  );
}
