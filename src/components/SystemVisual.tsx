import { useId } from 'react';

export default function SystemVisual() {
  const id = useId().replaceAll(':', '');
  return (
    <div className="system-visual" aria-hidden="true">
      <div className="visual-topline">
        <span className="tiny-dot" /> SYSTEMS THINKING <span>01 — 03</span>
      </div>
      <svg className="system-svg" viewBox="0 0 560 440" fill="none">
        <defs>
          <linearGradient
            id={`${id}surface`}
            x1="110"
            y1="80"
            x2="450"
            y2="365"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2c4253" stopOpacity=".8" />
            <stop offset="1" stopColor="#131d24" stopOpacity=".6" />
          </linearGradient>
          <linearGradient
            id={`${id}edge`}
            x1="100"
            y1="40"
            x2="450"
            y2="390"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#93c6ee" stopOpacity=".8" />
            <stop offset="1" stopColor="#7bb8ea" stopOpacity=".08" />
          </linearGradient>
          <linearGradient
            id={`${id}top`}
            x1="100"
            y1="60"
            x2="420"
            y2="250"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2c4252" />
            <stop offset=".55" stopColor="#1b2933" />
            <stop offset="1" stopColor="#2b4152" />
          </linearGradient>
          <radialGradient id={`${id}ambient`}>
            <stop stopColor="#558bb8" stopOpacity=".18" />
            <stop offset="1" stopColor="#558bb8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="280" cy="250" rx="272" ry="186" fill={`url(#${id}ambient)`} />
        <path d="M31 319 280 174 528 319 280 462Z" stroke="#80a7c5" strokeOpacity=".07" />
        <path
          d="M63 319 280 193 497 319 280 444Z M97 319 280 213 463 319 280 424Z"
          stroke="#80a7c5"
          strokeOpacity=".07"
        />
        <path
          d="M106 159v143 M450 159v143 M280 260v136"
          stroke="#8bbbe0"
          strokeOpacity=".35"
          strokeDasharray="3 6"
        />
        <g className="stack-bottom">
          <path
            d="m106 280 165-96a18 18 0 0 1 18 0l153 90q18 10 0 21l-153 89a18 18 0 0 1-18 0l-157-91q-14-8-8-13Z"
            fill={`url(#${id}surface)`}
            stroke={`url(#${id}edge)`}
          />
          <path
            d="m107 291 164 95a18 18 0 0 0 18 0l154-90v10l-154 90a18 18 0 0 1-18 0l-164-95Z"
            fill="#15222d"
            stroke="#6992b2"
            strokeOpacity=".3"
          />
          <path d="m197 282 81-47 82 48-81 47Z" stroke="#89bbe3" strokeOpacity=".35" />
          <path d="m213 282 65-38 67 39-66 38Z" stroke="#89bbe3" strokeOpacity=".2" />
          <circle cx="279" cy="282" r="5" fill="#8fc2e9" />
        </g>
        <g className="stack-middle">
          <path
            d="m106 209 165-96a18 18 0 0 1 18 0l153 90q18 10 0 21l-153 89a18 18 0 0 1-18 0l-157-91q-14-8-8-13Z"
            fill={`url(#${id}surface)`}
            stroke={`url(#${id}edge)`}
          />
          <path
            d="m107 220 164 95a18 18 0 0 0 18 0l154-90v8l-154 90a18 18 0 0 1-18 0l-164-95Z"
            fill="#1a2934"
            stroke="#6992b2"
            strokeOpacity=".3"
          />
          <path
            d="m201 209 32-19 32 19-32 19Z m77-45 33-19 32 19-32 19Z m-1 91 33-19 32 19-32 19Z"
            fill="#395468"
            stroke="#80a7c5"
            strokeOpacity=".5"
          />
          <path d="m267 209 11-7 33 19-12 7Z" fill="#a5ceef" />
          <path d="m249 198 36-21m-36 46 35 20" stroke="#80a7c5" strokeOpacity=".6" />
        </g>
        <g className="stack-top">
          <path
            d="m106 132 165-96a18 18 0 0 1 18 0l153 90q18 10 0 21l-153 89a18 18 0 0 1-18 0l-157-91q-14-8-8-13Z"
            fill={`url(#${id}top)`}
            stroke={`url(#${id}edge)`}
          />
          <path
            d="m107 143 164 95a18 18 0 0 0 18 0l154-90v9l-154 90a18 18 0 0 1-18 0l-164-95Z"
            fill="#263948"
            stroke="#83b7df"
            strokeOpacity=".4"
          />
          <path
            d="m208 125 65-38 65 37-59 35-71-34Z m0 0 4 50 67-16 59 17v-52 M273 87l6 72m-67 16 68 24 58-23m-59-17 1 40"
            stroke="#9bc9ef"
            strokeOpacity=".5"
          />
          {[
            [208, 125],
            [273, 87],
            [338, 124],
            [212, 175],
            [279, 159],
            [338, 176],
            [280, 199],
          ].map(([x, y], i) => (
            <g key={i}>
              <ellipse
                cx={x}
                cy={y}
                rx={i === 4 ? 11 : 6}
                ry={i === 4 ? 6 : 3.5}
                fill={i === 4 ? '#cce4f7' : '#8dbbdf'}
              />
              <ellipse
                cx={x}
                cy={y}
                rx={i === 4 ? 19 : 11}
                ry={i === 4 ? 11 : 7}
                stroke="#97c8ee"
                strokeOpacity=".18"
              />
            </g>
          ))}
        </g>
        <path
          d="M359 92h63l25-15h59 M141 236H65l-22 15H16 M367 333h62l22 14h55"
          stroke="#81a3bd"
          strokeOpacity=".5"
        />
        <circle cx="358" cy="92" r="3" fill="#add4f2" />
        <circle cx="142" cy="236" r="3" fill="#a0c5e0" />
        <circle cx="367" cy="333" r="3" fill="#94bad8" />
        <text
          x="444"
          y="64"
          fill="#cce3f5"
          fontSize="10"
          fontFamily="monospace"
          letterSpacing="1.5"
        >
          AI / MODEL
        </text>
        <text x="14" y="275" fill="#a7c0d2" fontSize="10" fontFamily="monospace" letterSpacing="1">
          APPLICATION
        </text>
        <text x="416" y="370" fill="#a7c0d2" fontSize="10" fontFamily="monospace" letterSpacing="1">
          INFRASTRUCTURE
        </text>
      </svg>
      <div className="visual-bottomline">
        <span>MODEL</span>
        <span className="visual-line" />
        <span>APPLICATION</span>
        <span className="visual-line" />
        <span>DEPLOYMENT</span>
      </div>
    </div>
  );
}
