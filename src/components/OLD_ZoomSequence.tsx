import { useState, useEffect, useRef } from 'react'

const STAGES = [
  {
    scan: '000',
    label: 'SPACE',
    title: 'INITIATING SCAN',
    alt: '35,785 KM',
    region: 'GEOSTATIONARY ORBIT',
    coords: "0°00'N  0°00'E",
    status: 'ESTABLISHING LOCK...',
    bg: 'radial-gradient(ellipse at center, #060a18 0%, #020408 100%)',
    dotSize: 4,
  },
  {
    scan: '001',
    label: 'EARTH',
    title: 'EARTH ACQUIRED',
    alt: '12,000 KM',
    region: 'EURASIAN PLATE',
    coords: "40°00'N  60°00'E",
    status: 'NARROWING FIELD...',
    bg: 'radial-gradient(ellipse at center, #081828 0%, #020610 100%)',
    dotSize: 30,
  },
  {
    scan: '002',
    label: 'ASIA',
    title: 'CONTINENT IDENTIFIED',
    alt: '5,000 KM',
    region: 'ASIA — EAST SECTOR',
    coords: "42°00'N  62°00'E",
    status: 'ZOOMING IN...',
    bg: 'radial-gradient(ellipse at center, #0a1e32 0%, #030810 100%)',
    dotSize: 80,
  },
  {
    scan: '003',
    label: 'CENTRAL ASIA',
    title: 'REGION: CENTRAL ASIA',
    alt: '1,500 KM',
    region: 'CENTRAL ASIA — STEPPE',
    coords: "41°30'N  66°00'E",
    status: 'SCANNING...',
    bg: 'radial-gradient(ellipse at center, #0c2240 0%, #040a14 100%)',
    dotSize: 160,
  },
  {
    scan: '004',
    label: 'UZBEKISTAN',
    title: 'COUNTRY: UZBEKISTAN',
    alt: '500 KM',
    region: 'REPUBLIC OF UZBEKISTAN',
    coords: "41°18'N  69°16'E",
    status: 'TARGET IDENTIFIED',
    bg: 'radial-gradient(ellipse at center, #0e2848 0%, #040c18 100%)',
    dotSize: 240,
    showCountry: true,
  },
  {
    scan: '005',
    label: 'TASHKENT',
    title: 'CAPITAL: TASHKENT',
    alt: '100 KM',
    region: 'TASHKENT REGION',
    coords: "41°17'N  69°17'E",
    status: 'CITY LOCK...',
    bg: 'radial-gradient(ellipse at center, #102c50 0%, #050d1c 100%)',
    dotSize: 300,
  },
  {
    scan: '006',
    label: 'SAMARKAND',
    title: 'SITE: REGISTAN, SAMARKAND',
    alt: '14 KM',
    region: 'SAMARKAND PROVINCE',
    coords: "39°39'N  66°57'E",
    status: 'CULTURAL TARGET LOCKED',
    bg: 'radial-gradient(ellipse at center, #0d2848 0%, #030a1a 100%)',
    dotSize: 360,
  },
  {
    scan: '007',
    label: 'CERAMIC TILE',
    title: 'TARGET LOCKED',
    alt: '0.3 KM',
    region: 'REGISTAN MADRASSA — EAST FACADE',
    coords: "39°39'23\"N  66°58'34\"E",
    status: '██ LOCK CONFIRMED',
    bg: 'radial-gradient(ellipse at center, #1a3a6e 0%, #060e26 100%)',
    dotSize: 420,
    isLocked: true,
  },
]

export default function ZoomSequence() {
  const outerRef = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState(0)
  const [lockedFlash, setLockedFlash] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!outerRef.current) return
      const rect = outerRef.current.getBoundingClientRect()
      const scrolled = -rect.top
      const scrollable = outerRef.current.offsetHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, scrolled / scrollable))
      const newStage = Math.min(7, Math.floor(progress * 8))
      setStage(newStage)
      if (newStage === 7 && !lockedFlash) setLockedFlash(true)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lockedFlash])

  const s = STAGES[stage]

  return (
    /* 800vh outer — scroll height for sticky effect */
    <div ref={outerRef} style={{ height: '800vh' }}>
      <div
        className="font-terminal"
        style={{
          position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
          background: s.bg, transition: 'background 0.8s ease',
        }}
      >
        {/* Stars (visible in early stages) */}
        {stage <= 2 && (
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: Math.max(0, 1 - stage * 0.4) }}>
            {Array.from({ length: 120 }, (_, i) => (
              <circle
                key={i}
                cx={`${(i * 137.5) % 100}%`}
                cy={`${(i * 89.3) % 100}%`}
                r={i % 7 === 0 ? 1.5 : 0.7}
                fill="white"
                opacity={0.3 + (i % 5) * 0.1}
              />
            ))}
          </svg>
        )}

        {/* Zoom indicator — expanding ring */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div
            style={{
              width: s.dotSize, height: s.dotSize,
              borderRadius: '50%',
              border: '1px solid rgba(0,255,65,0.15)',
              transition: 'width 0.8s ease, height 0.8s ease',
              position: 'relative',
            }}
          >
            {/* Pulse ring */}
            <div style={{
              position: 'absolute', inset: -10,
              borderRadius: '50%',
              border: '1px solid rgba(0,255,65,0.3)',
              animation: 'pulseRing 2.5s ease-out infinite',
            }} />
            {/* Uzbekistan SVG outline (stage 4+) */}
            {stage >= 4 && (
              <svg viewBox="0 0 460 360" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: Math.min(1, (stage - 3) * 0.5) }}>
                <path
                  d="M 80,50 L 350,28 L 430,55 L 455,88 L 480,108 L 475,138 L 445,148 L 395,158 L 375,195 L 355,225 L 315,248 L 265,255 L 205,262 L 155,242 L 105,222 L 48,178 L 40,138 L 52,100 Z"
                  fill="rgba(0,150,199,0.1)"
                  stroke="rgba(0,255,65,0.5)"
                  strokeWidth="1.5"
                />
                {/* Cities */}
                {stage >= 5 && [
                  { cx: 425, cy: 78, label: 'TASHKENT' },
                  { cx: 280, cy: 200, label: 'SAMARKAND' },
                  { cx: 155, cy: 190, label: 'BUKHARA' },
                  { cx: 80, cy: 180, label: 'KHIVA' },
                  { cx: 460, cy: 125, label: 'FERGANA' },
                ].map(c => (
                  <g key={c.label}>
                    <circle cx={c.cx} cy={c.cy} r="4" fill="#ffd60a" opacity="0.9" />
                    <circle cx={c.cx} cy={c.cy} r="10" fill="none" stroke="#ffd60a" strokeWidth="0.5" opacity="0.5" />
                    <text x={c.cx + 8} y={c.cy + 4} fontSize="9" fill="rgba(255,214,10,0.7)" fontFamily="Space Mono, monospace">{c.label}</text>
                  </g>
                ))}
              </svg>
            )}
          </div>
        </div>

        {/* Scan overlay — corners and data */}
        {/* Top-left HUD */}
        <div style={{ position: 'absolute', top: 24, left: 24, color: 'rgba(0,255,65,0.7)', fontSize: 12, letterSpacing: '0.1em' }}>
          <div style={{ color: '#ffd60a', fontSize: 20, fontWeight: 700, letterSpacing: '0.2em' }}>
            SCAN // {s.scan}
          </div>
          <div style={{ marginTop: 8, color: 'rgba(0,255,65,0.5)', fontSize: 11 }}>
            {s.region}
          </div>
          <div style={{ marginTop: 4, color: 'rgba(0,255,65,0.4)', fontSize: 11 }}>
            {s.coords}
          </div>
        </div>

        {/* Top-right altitude */}
        <div style={{ position: 'absolute', top: 24, right: 24, textAlign: 'right', color: 'rgba(0,255,65,0.6)', fontSize: 12, letterSpacing: '0.1em' }}>
          <div style={{ color: '#00ff41', fontSize: 13, letterSpacing: '0.08em' }}>ALTITUDE</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#00ff41', letterSpacing: '0.05em', lineHeight: 1.1 }}>{s.alt}</div>
        </div>

        {/* Center title */}
        <div style={{
          position: 'absolute', bottom: 100, left: 0, right: 0,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: s.isLocked ? 36 : 16,
            color: s.isLocked ? '#ffd60a' : 'rgba(0,255,65,0.8)',
            letterSpacing: s.isLocked ? '0.4em' : '0.25em',
            fontWeight: 700,
            transition: 'font-size 0.6s ease, color 0.6s ease',
            animation: s.isLocked ? 'glitch 0.5s step-end 3' : 'none',
          }}>
            {s.title}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(0,255,65,0.45)', letterSpacing: '0.2em' }}>
            {s.status}
          </div>
        </div>

        {/* Stage progress bar */}
        <div style={{
          position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 6,
        }}>
          {STAGES.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === stage ? 28 : 8, height: 3,
                background: i <= stage ? '#00ff41' : 'rgba(0,255,65,0.15)',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>

        {/* Scroll hint (visible on first stage) */}
        {stage === 0 && (
          <div style={{
            position: 'absolute', bottom: 24, left: 0, right: 0,
            textAlign: 'center', fontSize: 11,
            color: 'rgba(0,255,65,0.3)', letterSpacing: '0.3em',
            animation: 'blink 2s ease-in-out infinite',
          }}>
            SCROLL TO INITIATE DESCENT
          </div>
        )}

        {/* Corner brackets */}
        {[
          { top: 16, left: 16, borderTop: '1px solid rgba(0,255,65,0.3)', borderLeft: '1px solid rgba(0,255,65,0.3)' },
          { top: 16, right: 16, borderTop: '1px solid rgba(0,255,65,0.3)', borderRight: '1px solid rgba(0,255,65,0.3)' },
          { bottom: 16, left: 16, borderBottom: '1px solid rgba(0,255,65,0.3)', borderLeft: '1px solid rgba(0,255,65,0.3)' },
          { bottom: 16, right: 16, borderBottom: '1px solid rgba(0,255,65,0.3)', borderRight: '1px solid rgba(0,255,65,0.3)' },
        ].map((style, i) => (
          <div key={i} style={{ position: 'absolute', width: 32, height: 32, ...style }} />
        ))}

        {/* Scanline */}
        <div className="scan-line" />
      </div>
    </div>
  )
}
