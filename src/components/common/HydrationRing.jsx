import { useState, useEffect, useRef } from 'react';

export default function HydrationRing({ currentMl = 0, targetMl = 2000 }) {
  const safeTarget = Math.max(Number(targetMl) || 2000, 1);
  const safeCurrent = Math.max(Number(currentMl) || 0, 0);
  const pct = Math.min(Math.round((safeCurrent / safeTarget) * 100), 100);
  const remaining = Math.max(safeTarget - safeCurrent, 0);

  const prevMlRef = useRef(safeCurrent);
  const isFirstRender = useRef(true);
  const [isPouring, setIsPouring] = useState(false);
  const [addedDelta, setAddedDelta] = useState(0);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevMlRef.current = safeCurrent;
      return;
    }

    const diff = safeCurrent - prevMlRef.current;
    prevMlRef.current = safeCurrent;

    if (diff > 0) {
      setAddedDelta(diff);
      setIsPouring(true);
      const timer = setTimeout(() => {
        setIsPouring(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [safeCurrent]);

  // Glass inner cavity vertical range: y = 26 (100% full) to y = 166 (0% empty)
  const glassTopY = 26;
  const glassBottomY = 166;
  const glassHeight = glassBottomY - glassTopY; // 140
  const fillHeight = (pct / 100) * glassHeight;
  const waterSurfaceY = glassBottomY - fillHeight;

  return (
    <div className="hydro-glass-card">
      <div className={`hydro-glass-stage ${isPouring ? 'is-pouring' : ''}`}>
        {/* Floating +ml delta badge when pouring */}
        {isPouring && addedDelta > 0 && (
          <div className="hydro-pour-badge" key={safeCurrent}>
            +{addedDelta.toLocaleString('id-ID')} ml
          </div>
        )}

        <svg
          className="hydro-glass-svg"
          width="160"
          height="184"
          viewBox="0 0 160 184"
          aria-label={`Gelas hidrasi ${pct}%`}
        >
          <defs>
            {/* Inner glass cavity clip path (tapered tumbler with rounded base) */}
            <clipPath id="glassCavityClip">
              <path d="M 31 22 L 129 22 L 116 152 Q 114 166 99 166 L 61 166 Q 46 166 44 152 Z" />
            </clipPath>

            {/* Calming blue water body gradient */}
            <linearGradient id="waterBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="55%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Lighter back wave gradient */}
            <linearGradient id="waterBackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.75" />
            </linearGradient>

            {/* Glass background subtle tint */}
            <linearGradient id="glassTintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.55" />
            </linearGradient>

            {/* Pouring stream gradient */}
            <linearGradient id="pourStreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Subtle shadow under glass */}
          <ellipse cx="80" cy="175" rx="40" ry="5" fill="#bae6fd" opacity="0.55" />

          {/* Glass backdrop */}
          <path
            d="M 29 20 L 131 20 L 117 153 Q 115 168 99 168 L 61 168 Q 45 168 43 153 Z"
            fill="url(#glassTintGrad)"
          />

          {/* Clipped Water & Waves Inside Glass */}
          <g clipPath="url(#glassCavityClip)">
            {/* Pouring stream coming from top into water when adding drink */}
            {isPouring && (
              <g className="hydro-pour-group">
                <rect
                  x="76"
                  y="14"
                  width="8"
                  rx="4"
                  height={Math.max(waterSurfaceY - 10, 20)}
                  fill="url(#pourStreamGrad)"
                  className="hydro-pour-stream"
                />
                {/* Splash droplets at surface */}
                <circle
                  cx="67"
                  cy={Math.max(waterSurfaceY - 4, 30)}
                  r="3.2"
                  fill="#38bdf8"
                  className="hydro-splash-drop hydro-splash-drop--left"
                />
                <circle
                  cx="93"
                  cy={Math.max(waterSurfaceY - 5, 30)}
                  r="3"
                  fill="#0ea5e9"
                  className="hydro-splash-drop hydro-splash-drop--right"
                />
                <circle
                  cx="73"
                  cy={Math.max(waterSurfaceY - 8, 28)}
                  r="2.2"
                  fill="#7dd3fc"
                  className="hydro-splash-drop hydro-splash-drop--mid"
                />
              </g>
            )}

            {/* Rising Water Group translated by waterSurfaceY */}
            <g
              className="hydro-water-level"
              style={{
                transform: `translateY(${waterSurfaceY}px)`,
              }}
            >
              {/* Back wave (slower, lighter blue) */}
              <path
                className={`hydro-wave hydro-wave--back ${
                  isPouring ? 'hydro-wave--fast' : ''
                }`}
                d="M -160 0 Q -120 -7 -80 0 T 0 0 T 80 0 T 160 0 T 240 0 T 320 0 L 320 180 L -160 180 Z"
                fill="url(#waterBackGrad)"
              />

              {/* Front wave + main water body */}
              <path
                className={`hydro-wave hydro-wave--front ${
                  isPouring ? 'hydro-wave--fast' : ''
                }`}
                d="M -160 2 Q -120 8 -80 2 T 0 2 T 80 2 T 160 2 T 240 2 T 320 2 L 320 180 L -160 180 Z"
                fill="url(#waterBodyGrad)"
              />
            </g>

            {/* Ambient & pouring bubbles inside water */}
            {pct > 5 && (
              <g className="hydro-bubbles">
                <circle
                  cx="62"
                  cy="155"
                  r="3"
                  fill="#ffffff"
                  opacity="0.45"
                  className="hydro-bubble hydro-bubble--1"
                />
                <circle
                  cx="85"
                  cy="160"
                  r="2.2"
                  fill="#ffffff"
                  opacity="0.4"
                  className="hydro-bubble hydro-bubble--2"
                />
                <circle
                  cx="98"
                  cy="152"
                  r="3.5"
                  fill="#ffffff"
                  opacity="0.35"
                  className="hydro-bubble hydro-bubble--3"
                />
                {isPouring && (
                  <>
                    <circle
                      cx="74"
                      cy="158"
                      r="4"
                      fill="#ffffff"
                      opacity="0.65"
                      className="hydro-bubble hydro-bubble--burst1"
                    />
                    <circle
                      cx="88"
                      cy="154"
                      r="3.2"
                      fill="#ffffff"
                      opacity="0.6"
                      className="hydro-bubble hydro-bubble--burst2"
                    />
                    <circle
                      cx="68"
                      cy="150"
                      r="2.6"
                      fill="#e0f2fe"
                      opacity="0.7"
                      className="hydro-bubble hydro-bubble--burst3"
                    />
                  </>
                )}
              </g>
            )}
          </g>

          {/* Measurement tick marks on right wall of glass */}
          <g stroke="#0284c7" strokeWidth="1.4" strokeLinecap="round" opacity="0.38">
            <line x1="115" y1="53" x2="122" y2="53" />
            <line x1="112" y1="88" x2="120" y2="88" />
            <line x1="109" y1="123" x2="116" y2="123" />
          </g>

          {/* Left glass shine highlight */}
          <path
            d="M 38 30 L 49 146"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Outer Glass Outline */}
          <path
            d="M 29 20 L 131 20 L 117 153 Q 115 168 99 168 L 61 168 Q 45 168 43 153 Z"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />

          {/* Top Glass Rim */}
          <ellipse
            cx="80"
            cy="20"
            rx="51"
            ry="5.5"
            fill="#f0f9ff"
            stroke="#0ea5e9"
            strokeWidth="2.8"
          />
        </svg>

        {/* Centered Percentage Pill on Glass */}
        <div className="hydro-glass-pct-pill">
          <span>{pct}%</span>
        </div>
      </div>

      {/* Clear, readable hydration readout below glass */}
      <div className="hydro-glass-info">
        <div className="hydro-glass-volume">
          <span className="hydro-glass-current">
            {safeCurrent.toLocaleString('id-ID')} ml
          </span>
          <span className="hydro-glass-target">
            / {safeTarget.toLocaleString('id-ID')} ml
          </span>
        </div>
        <div
          className={`hydro-glass-status ${
            remaining === 0 ? 'hydro-glass-status--done' : ''
          }`}
        >
          {remaining === 0
            ? 'Target Tercapai!'
            : `Sisa ${remaining.toLocaleString('id-ID')} ml`}
        </div>
      </div>
    </div>
  );
}
