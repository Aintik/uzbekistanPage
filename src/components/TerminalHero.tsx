import { useState, useEffect, useRef } from 'react'

interface Props {
  dismissed: boolean
  onDismiss: () => void
}

type LineEntry = {
  text: string
  type: 'dim' | 'normal' | 'amber' | 'large' | 'italic' | 'sep' | 'button'
  delay: number
}

const LINES: LineEntry[] = [
  { text: '> GEOSPATIAL INTELLIGENCE MODULE v4.1', type: 'dim', delay: 300 },
  { text: '> SATELLITE UPLINK ░░░░░░░░░░ ESTABLISHED', type: 'dim', delay: 750 },
  { text: '> SCANNING SECTOR 12 — CENTRAL ASIA...', type: 'dim', delay: 1200 },
  { text: '──────────────────────────────────────────────', type: 'sep', delay: 1600 },
  { text: 'OPERATION: IDENTITY', type: 'large', delay: 1850 },
  { text: 'TARGET ACQUIRED', type: 'amber', delay: 2150 },
  { text: '──────────────────────────────────────────────', type: 'sep', delay: 2400 },
  { text: 'LOCATION    ///   CENTRAL ASIA', type: 'normal', delay: 2650 },
  { text: 'COUNTRY     ///   UZBEKISTAN', type: 'normal', delay: 3100 },
  { text: "COORDINATES ///   41°18'N   69°16'E", type: 'normal', delay: 3550 },
  { text: '──────────────────────────────────────────────', type: 'sep', delay: 4050 },
  { text: 'You\'ve probably heard of the "-stan" countries.', type: 'italic', delay: 4300 },
  { text: 'But can you point to this one on a map?', type: 'italic', delay: 4950 },
  { text: '', type: 'dim', delay: 5500 },
  { text: '[ LOCATE UZBEKISTAN ]', type: 'button', delay: 5800 },
]

export default function TerminalHero({ dismissed, onDismiss }: Props) {
  const [mouse, setMouse] = useState({ x: 200, y: 200 })
  const [visible, setVisible] = useState(0)
  const [fading, setFading] = useState(false)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  useEffect(() => {
    const timers = LINES.map((l, i) =>
      setTimeout(() => setVisible(v => Math.max(v, i + 1)), l.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  /* Live timestamp in status bar */
  const [ts, setTs] = useState(() => new Date().toISOString().slice(0, 19) + 'Z')
  useEffect(() => {
    tickRef.current = setInterval(() => setTs(new Date().toISOString().slice(0, 19) + 'Z'), 1000)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [])

  function handleDismiss() {
    setFading(true)
    setTimeout(onDismiss, 900)
  }

  const lineStyle = (type: LineEntry['type']): React.CSSProperties => {
    switch (type) {
      case 'dim':    return { color: 'rgba(0,255,65,0.35)', fontSize: 13 }
      case 'normal': return { color: '#00ff41', fontSize: 14 }
      case 'amber':  return { color: '#ffd60a', fontSize: 15, letterSpacing: '0.35em', fontWeight: 700 }
      case 'large':  return { color: '#00ff41', fontSize: 28, letterSpacing: '0.5em', fontWeight: 700, lineHeight: 1.2 }
      case 'italic': return { color: 'rgba(0,255,65,0.6)', fontSize: 14, fontStyle: 'italic' }
      case 'sep':    return { color: 'rgba(0,255,65,0.2)', fontSize: 13 }
      case 'button': return { color: '#00ff41', fontSize: 14 }
    }
  }

  return (
    <div
      className="font-terminal"
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: '#050a05',
        opacity: fading ? 0 : 1,
        display: fading ? 'none' : "block",
        transition: 'opacity 0.9s ease',
        overflow: 'hidden',
      }}
    >
      {/* Scanline */}
      <div className="scan-line" style={{ zIndex: 10 }} />

      {/* Corner HUD brackets */}
      {[
        { top: 20, left: 20, borderTop: '1.5px solid rgba(0,255,65,0.5)', borderLeft: '1.5px solid rgba(0,255,65,0.5)' },
        { top: 20, right: 20, borderTop: '1.5px solid rgba(0,255,65,0.5)', borderRight: '1.5px solid rgba(0,255,65,0.5)' },
        { bottom: 52, left: 20, borderBottom: '1.5px solid rgba(0,255,65,0.5)', borderLeft: '1.5px solid rgba(0,255,65,0.5)' },
        { bottom: 52, right: 20, borderBottom: '1.5px solid rgba(0,255,65,0.5)', borderRight: '1.5px solid rgba(0,255,65,0.5)' },
      ].map((style, i) => (
        <div key={i} style={{ position: 'absolute', width: 36, height: 36, ...style }} />
      ))}

      {/* Crosshair SVG */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 6 }}
      >
        <line x1="0" y1={mouse.y} x2="9999" y2={mouse.y} stroke="rgba(0,255,65,0.2)" strokeWidth="0.5" />
        <line x1={mouse.x} y1="0" x2={mouse.x} y2="9999" stroke="rgba(0,255,65,0.2)" strokeWidth="0.5" />
        <circle cx={mouse.x} cy={mouse.y} r="22" fill="none" stroke="rgba(0,255,65,0.4)" strokeWidth="0.8" />
        <circle cx={mouse.x} cy={mouse.y} r="4" fill="rgba(0,255,65,0.7)" />
        {/* Corner marks around cursor */}
        <line x1={mouse.x - 32} y1={mouse.y - 32} x2={mouse.x - 22} y2={mouse.y - 32} stroke="rgba(0,255,65,0.5)" strokeWidth="1" />
        <line x1={mouse.x - 32} y1={mouse.y - 32} x2={mouse.x - 32} y2={mouse.y - 22} stroke="rgba(0,255,65,0.5)" strokeWidth="1" />
        <line x1={mouse.x + 22} y1={mouse.y - 32} x2={mouse.x + 32} y2={mouse.y - 32} stroke="rgba(0,255,65,0.5)" strokeWidth="1" />
        <line x1={mouse.x + 32} y1={mouse.y - 32} x2={mouse.x + 32} y2={mouse.y - 22} stroke="rgba(0,255,65,0.5)" strokeWidth="1" />
        <line x1={mouse.x - 32} y1={mouse.y + 32} x2={mouse.x - 22} y2={mouse.y + 32} stroke="rgba(0,255,65,0.5)" strokeWidth="1" />
        <line x1={mouse.x - 32} y1={mouse.y + 32} x2={mouse.x - 32} y2={mouse.y + 22} stroke="rgba(0,255,65,0.5)" strokeWidth="1" />
        <line x1={mouse.x + 22} y1={mouse.y + 32} x2={mouse.x + 32} y2={mouse.y + 32} stroke="rgba(0,255,65,0.5)" strokeWidth="1" />
        <line x1={mouse.x + 32} y1={mouse.y + 32} x2={mouse.x + 32} y2={mouse.y + 22} stroke="rgba(0,255,65,0.5)" strokeWidth="1" />
      </svg>

      {/* Cursor coordinate readout */}
      <div
        style={{
          position: 'absolute',
          left: mouse.x + 18,
          top: mouse.y + 18,
          fontSize: 10,
          color: 'rgba(0,255,65,0.5)',
          pointerEvents: 'none',
          zIndex: 7,
          letterSpacing: '0.05em',
        }}
      >
        X:{mouse.x.toFixed(0)} Y:{mouse.y.toFixed(0)}
      </div>

      {/* Terminal content */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '80px 40px 80px',
        }}
      >
        <div style={{ maxWidth: 720, width: '100%' }}>
          {LINES.map((line, i) => {
            if (i >= visible) return null
            const style = lineStyle(line.type)

            if (line.type === 'button') {
              return (
                <div key={i} style={{ marginTop: 32 }}>
                  <button
                    onClick={handleDismiss}
                    style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: 14,
                      letterSpacing: '0.25em',
                      color: '#050a05',
                      background: '#00ff41',
                      border: 'none',
                      padding: '12px 32px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLButtonElement).style.background = '#ffd60a'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLButtonElement).style.background = '#00ff41'
                    }}
                  >
                    {line.text}
                  </button>
                </div>
              )
            }

            if (line.type === 'large') {
              return (
                <div key={i} style={{ ...style, marginBottom: 8, animation: 'glitch 8s ease-in-out infinite' }}>
                  {line.text}
                </div>
              )
            }

            return (
              <div key={i} style={{ ...style, marginBottom: line.type === 'sep' ? 10 : 5 }}>
                {line.text}
                {i === visible - 1 && line.type !== 'sep' && (
                  <span className="blink" style={{ marginLeft: 2, color: '#00ff41' }}>█</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Status bar */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '10px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 11, letterSpacing: '0.08em',
          color: 'rgba(0,255,65,0.3)',
          borderTop: '1px solid rgba(0,255,65,0.08)',
          zIndex: 9,
        }}
      >
        <span>GEO-INT MODULE v4.1</span>
        <span>SECTOR-12 // CENTRAL ASIA</span>
        <span>{ts}</span>
      </div>
    </div>
  )
}
