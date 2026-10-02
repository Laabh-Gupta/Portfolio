import { useId } from 'react';

/** Original explanatory drawings, not screenshots or measured project outputs. */
export default function ProjectArtwork({ index }: { index: number }) {
  const id = useId().replaceAll(':', '');
  return (
    <svg viewBox="0 0 480 360" fill="none" aria-hidden="true" className="project-artwork">
      <defs>
        <linearGradient
          id={`${id}-metal`}
          x1="100"
          y1="60"
          x2="340"
          y2="300"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f2f1ec" />
          <stop offset=".5" stopColor="#777" />
          <stop offset="1" stopColor="#272727" />
        </linearGradient>
        <pattern id={`${id}-grid`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" stroke="#ffffff" strokeOpacity=".055" />
        </pattern>
      </defs>
      <rect width="480" height="360" fill="#101010" />
      <rect width="480" height="360" fill={`url(#${id}-grid)`} />
      <g stroke="#fff" strokeOpacity=".2">
        <path d="M24 42V24H42M438 24H456V42M24 318V336H42M438 336H456V318" />
      </g>
      {index === 0 && (
        <>
          <ellipse cx="240" cy="297" rx="116" ry="15" fill="#000" opacity=".4" />
          <path
            d="M192 70L145 91L104 150L151 177L170 150V285Q240 307 310 285V150L329 177L376 150L335 91L288 70Q280 102 240 102Q200 102 192 70Z"
            fill={`url(#${id}-metal)`}
            stroke="#aaa"
          />
          <path
            d="M192 70Q200 113 240 113Q280 113 288 70M170 150L181 115M310 150L299 115M170 270Q240 291 310 270M198 108L191 289M222 114L218 294M258 114L262 294M282 108L289 289M164 168Q240 195 316 168M170 198Q240 221 310 198M170 235Q240 259 310 235"
            stroke="#fff"
            strokeOpacity=".2"
          />
          <g stroke="#ddd" strokeDasharray="3 5" opacity=".45">
            <path d="M145 91H79V255M335 91H402V255M104 150H57M376 150H423" />
          </g>
          <g fill="#e9e8e3">
            {[
              [145, 91],
              [335, 91],
              [170, 150],
              [310, 150],
              [192, 70],
              [288, 70],
              [240, 102],
              [170, 285],
              [310, 285],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3" />
            ))}
          </g>
        </>
      )}
      {index === 1 && (
        <>
          <g stroke="#fff" strokeOpacity=".08">
            <path d="M70 100H410M70 140H410M70 180H410M70 220H410M70 260H410" />
          </g>
          {Array.from({ length: 54 }, (_, i) => {
            const height = 14 + Math.pow(Math.sin(i * 0.7), 2) * 90 * Math.sin((i / 54) * Math.PI);
            return (
              <path
                key={i}
                d={`M${78 + i * 6.1} ${180 - height}V${180 + height}`}
                stroke="#eae9e4"
                strokeWidth="2"
                opacity={0.25 + Math.sin(i * 0.2) ** 2 * 0.7}
              />
            );
          })}
          <rect x="196" y="66" width="88" height="228" rx="3" stroke="#fff" strokeOpacity=".6" />
          <path d="M196 51H284M240 51V39M196 309H284" stroke="#999" />
          <text x="240" y="327" fill="#888" textAnchor="middle" fontSize="9" fontFamily="monospace">
            SIGNAL → FEATURES → CLASSIFICATION
          </text>
        </>
      )}
      {index === 2 && (
        <>
          <g transform="translate(64 58) rotate(-5 176 120)">
            <rect x="10" y="12" width="352" height="246" rx="8" fill="#191919" stroke="#444" />
            <rect width="352" height="246" rx="8" fill="#e8e7e2" />
            <path d="M0 42H352M75 42V246" stroke="#111" strokeOpacity=".18" />
            <text x="19" y="28" fill="#111" fontSize="16" fontFamily="sans-serif" fontWeight="600">
              VXL
            </text>
            <circle cx="326" cy="22" r="6" fill="#aaa" />
            <g fill="#999">
              {[70, 98, 126, 154].map((y) => (
                <rect key={y} x="18" y={y} width="39" height="5" rx="2" />
              ))}
            </g>
            <rect x="97" y="67" width="146" height="13" rx="2" fill="#333" />
            <rect x="97" y="94" width="224" height="4" rx="2" fill="#aaa" />
            {[122, 158, 194].map((y, i) => (
              <g key={y}>
                <rect x="97" y={y} width="229" height="26" rx="3" fill="#d2d1cd" />
                <rect x="110" y={y + 10} width={102 - i * 17} height="5" fill="#777" />
                <circle cx="307" cy={y + 13} r="4" fill="#555" />
              </g>
            ))}
          </g>
        </>
      )}
      {index === 3 && (
        <>
          <g stroke="#ddd" strokeOpacity=".3">
            {[
              [240, 178, 92, 101],
              [240, 178, 133, 260],
              [240, 178, 319, 82],
              [240, 178, 394, 190],
              [240, 178, 312, 286],
              [92, 101, 319, 82],
              [133, 260, 312, 286],
              [319, 82, 394, 190],
            ].map(([x1, y1, x2, y2], i) => (
              <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} />
            ))}
          </g>
          {[
            [92, 101, 16],
            [133, 260, 21],
            [319, 82, 25],
            [394, 190, 15],
            [312, 286, 18],
          ].map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r + 8} stroke="#555" />
              <circle cx={x} cy={y} r={r} fill="#232323" stroke="#aaa" />
              <circle cx={x} cy={y} r="3" fill="#bbb" />
            </g>
          ))}
          <circle cx="240" cy="178" r="61" stroke="#666" strokeDasharray="2 7" />
          <circle cx="240" cy="178" r="42" fill="#e9e8e3" />
          <path d="M240 159V184M240 195V199" stroke="#222" strokeWidth="3" />
          <text x="240" y="327" fill="#888" textAnchor="middle" fontSize="9" fontFamily="monospace">
            TRANSACTION PATTERNS / ANOMALY STUDY
          </text>
        </>
      )}
      {index === 4 && (
        <>
          <g transform="rotate(9 240 180)">
            <rect x="145" y="52" width="210" height="266" rx="3" fill="#292929" stroke="#777" />
          </g>
          <g transform="rotate(-7 240 180)">
            <rect x="121" y="47" width="216" height="271" rx="3" fill="#e9e8e3" />
            <path d="M150 86H310" stroke="#999" />
            <text
              x="150"
              y="118"
              fill="#222"
              fontSize="24"
              fontFamily="sans-serif"
              letterSpacing="-1"
            >
              A place for
            </text>
            <text
              x="150"
              y="148"
              fill="#222"
              fontSize="24"
              fontFamily="sans-serif"
              letterSpacing="-1"
            >
              your thoughts.
            </text>
            {[179, 195, 211, 227, 263, 279].map((y, i) => (
              <path key={y} d={`M150 ${y}H${i === 3 ? 257 : i === 5 ? 279 : 308}`} stroke="#aaa" />
            ))}
            <path d="M309 47V87L297 80L285 87V47" fill="#333" />
          </g>
        </>
      )}
    </svg>
  );
}
