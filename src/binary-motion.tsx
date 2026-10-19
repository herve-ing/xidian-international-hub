import React from 'react';
import sequences from './binary-sequences.json';
export function AnimatedHubLogo() {
  return (
    <svg
      className="animated-hub-logo"
      viewBox="30 34 150 126"
      role="img"
      aria-label="Xidian Hub"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="hub-code-window">
          <rect x="100" y="45" width="65" height="78" />
        </clipPath>
        <linearGradient id="hub-code-fade">
          <stop stopColor="white" />
          <stop offset=".75" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id="hub-code-mask">
          <rect x="99" y="44" width="68" height="80" fill="url(#hub-code-fade)" />
        </mask>
      </defs>
      <image href="./media/hub-logo.jpg" width="200" height="200" />
      <g className="logo-live-code" aria-hidden="true">
        <rect x="130" y="43" width="37" height="79" fill="#fdfdfd" />
        <g clipPath="url(#hub-code-window)" mask="url(#hub-code-mask)">
          {sequences.logo.map((bits, i) => (
            <g
              key={i}
              className="logo-code-row"
              style={
                {
                  '--row-delay': `${-i * 1.3}s`,
                  '--row-duration': `${5 + i * 0.6}s`,
                } as React.CSSProperties
              }
            >
              <text x="97" y={56 + i * 14}>
                {bits}
              </text>
              <text x="223" y={56 + i * 14}>
                {bits}
              </text>
            </g>
          ))}
        </g>
        {Array.from({ length: 12 }, (_, i) => (
          <rect
            key={i}
            className="logo-code-pixel"
            x={105 + ((i * 7) % 27)}
            y={49 + ((i * 13) % 66)}
            width={i % 3 === 0 ? 2 : 1}
            height={i % 3 === 0 ? 2 : 1}
            style={{ animationDelay: `${-i * 0.47}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
export function BinaryBackground() {
  return (
    <div className="binary-background" aria-hidden="true">
      {sequences.columns.map((bits, i) => (
        <div
          key={i}
          className="binary-watermark-column"
          style={
            {
              left: `${(i * 100) / 24}%`,
              '--rise-duration': `${32 + ((i * 7) % 29)}s`,
              '--rise-delay': `${-(i * 11) % 57}s`,
            } as React.CSSProperties
          }
        >
          <span>{bits}</span>
          <span>{bits}</span>
        </div>
      ))}
    </div>
  );
}
