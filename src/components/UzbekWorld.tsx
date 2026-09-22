import { useState, useEffect, useRef } from 'react'

/* ─── shared colours ─── */
const C = {
  deep:   '#03045e',
  blue:   '#023e8a',
  cyan:   '#0096c7',
  teal:   '#48cae4',
  light:  '#90e0ef',
  gold:   '#e9c46a',
  white:  '#f0f8ff',
  rust:   '#e76f51',
}

/* ─── Uzbek Reveal ─── */
function UzbekReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${C.deep} 0%, ${C.blue} 60%, ${C.cyan} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Geometric pattern overlay */}
      <div className="uzbek-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

      {/* Image backdrop */}
      {/*<div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1759518158486-59839bfc01b5?w=1600&h=1000&fit=crop&auto=format)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.15,
      }} />*/}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: 0.6,
      }}>
        <video autoPlay muted loop>
          <source src='https://r1---sn-4g5e6ns7.googlevideo.com/videoplayback?expire=1790117074&ei=crCyau7MLtrFmLAP1N3g2Qs&ip=2a02%3A3032%3A77%3A6d03%3A824%3Ad9ff%3Afec9%3A4f06&id=o-AKLGODp4kRdty2XmKaPDPVnqRzy8yBf_DT6i3xyuj7DA&itag=313&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C271%2C278%2C313%2C394%2C395%2C396%2C397%2C398%2C399%2C400%2C401&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&rms=au%2Cau&bui=AR3QkAnbE-XKX_XM_AGFrfxfn40afG0wVkbicuG2W72140gjNbHSgcFubfuoENYNKxPJrmdwyUYjhpIS&spc=I-rgIYaRZgzbLXsYqUBGQqhDocRiaTnkiMcFEPCtcqcim-VY6onjOw&vprv=1&svpuc=1&mime=video%2Fwebm&ns=06md3y1WzSseiffVds-gycIY&rqh=1&gir=yes&clen=900791032&dur=480.947&lmt=1721326148629232&keepalive=yes&fexp=51565115,52112904&c=TVHTML5_SIMPLY&sefc=1&txp=530F224&n=xKt9CvRXsWmo2w&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&sig=AE0s2JYwRAIgDQui4oeQD7XmGPzMT62pfg7k-loX1HRzkxeM60obs3MCIBzLBiUAk8Rk3u-yyf05DfNn7gPBRFOGrL8ibbzYAQPj&pot=MtYEwM5V7shrqt3AirGqFi_Paf-vvkyY4oxbzhNHKuyPqHNTenZ7BT22M6VAkNYZTIoSLOgIIl4JbHNGkjo60S1q_3GCrydhI9NGpp2Sq7eGOIL-0hVfJQPulIWErK5GVCDMi7wBcIF73dnX70-guap5M7KU7eFcFXnau_ySPqhGtlh4oC5EvkuwhGSAyIDgHf6y17Z1_GV86aTEo65DqnbK1v-X8SZ3pfBzmLYM-4uEx5bb8e-C4rvgA4WuIfVjxcy6d3KECVcQZ8tK2XDCR59VyFkPWRaHYlPVHXqUhUxLWho47eT6brOy1WOtDgiv5cwaVfIwvzgox1AEC8py0SjeBIVLzPWTQ-r5PM3nHVrrEDEMUEoDgYB7RsRCJj0NIV3UloStvlZIRhMTcXk-aev829VqiKFdV3F7nc0qKeEc72viIkAGT-cy5SJv1Qo_n_J6hz6PnawD8xYSIGBGLt3QX1YCfJFE2LddKh25rSNv_P1mFTK33oUaEoB9Vyv050LXgjBKoJsHaVFTJk84hnekA3q7BuOGZyrLEh3GH21GyP38-suTxrMG6oH7K9Je4XO-cDp9Ea5WExBcOCZxqeygBSyxaBLAiufYOp_q3znqiIbpfnMknZ4ElP8DOqeDSA7ZnpMH5QhPp4D2feQ-x4h8t_1ZqPiXrB_2a-_IVm3JXcisXvneZ3OlCrZmcsRdyNiBx0zXgVudWj0DWodFzk4iunUSXubD5ihNDSLefeG8KBmYUdAg5kuLfnoiIRVfAGBi6I5LMHBAoQFkqNzRPw0OyzAXC7LQIw==&cps=418&cm2rm=sn-q0-qmcd7e,sn-4wgez7z&rrc=191,191&req_id=6245aa8ac202a3ee&redirect_counter=2&cms_redirect=yes&cmsv=e&met=1790096379,&mh=P4&mip=94.207.21.44&mm=34&mn=sn-4g5e6ns7&ms=ltu&mt=1790095968&mv=m&mvi=1&pl=20&lsparams=cps,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=APaTxxMwRAIgIul6SnS82g3TZS3Cp9KyOIWsGk3eA3pl-QvCVZUpMhwCIHu1ZO84lXt9P7aMf1yYBcH-Ur4wEext0nITlON5JgCf' type='video/mp4'/>
        </video>
      </div>

      {/* Radial vignette */}
      {/*<div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 30%, ${C.deep} 100%)`,
      }} />*/}

      {/* Central ornamental ring */}
      <svg style={{ position: 'absolute', width: '70vmin', height: '70vmin', opacity: 0.25 }} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="none" stroke={C.gold} strokeWidth="0.5" />
        <polygon points="100,10 112,38 143,38 119,56 128,84 100,66 72,84 81,56 57,38 88,38"
          fill="none" stroke={C.teal} strokeWidth="0.8" />
        <polygon points="100,10 112,38 143,38 119,56 128,84 100,66 72,84 81,56 57,38 88,38"
          fill="none" stroke={C.teal} strokeWidth="0.8" transform="rotate(36 100 100)" />
        <circle cx="100" cy="100" r="20" fill="none" stroke={C.gold} strokeWidth="0.5" />
        <style>{`@keyframes spinSlow { from{transform-origin:100px 100px;transform:rotate(0)} to{transform-origin:100px 100px;transform:rotate(360deg)} }`}</style>
      </svg>

      {/* Main text */}
      <div
        style={{
          position: 'relative', zIndex: 2, textAlign: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'scale(1.05)',
          transition: 'opacity 1.4s ease, transform 1.4s ease',
        }}
      >
        {/* Terminal label */}
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 12, letterSpacing: '0.5em',
          color: C.teal, marginBottom: 24,
          opacity: 0.7,
        }}>
          TARGET LOCKED — TRANSITIONING
        </div>

        {/* Country name */}
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(52px, 12vw, 120px)',
          fontWeight: 900,
          color: C.white,
          letterSpacing: '0.12em',
          lineHeight: 1,
          textShadow: `0 0 60px rgba(0,150,199,0.6), 0 0 120px rgba(0,60,140,0.4)`,
        }}>
          UZBEKISTAN
        </div>

        {/* Gold ornamental divider */}
        <div style={{ margin: '28px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, maxWidth: 400 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.gold})` }} />
          <svg width="20" height="20" viewBox="0 0 20 20">
            <polygon points="10,1 12.4,7.6 19.5,7.6 13.9,12.2 15.9,18.5 10,14.5 4.1,18.5 6.1,12.2 0.5,7.6 7.6,7.6"
              fill={C.gold} />
          </svg>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.gold})` }} />
        </div>

        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(14px, 2.5vw, 22px)',
          color: C.light,
          letterSpacing: '0.3em',
          fontWeight: 400,
        }}>
          Central Asia's Hidden Gem
        </div>

        <div style={{ marginTop: 48, fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(144,224,239,0.6)', letterSpacing: '0.08em' }}>
          Scroll to explore ↓
        </div>
      </div>
    </div>
  )
}

/* ─── The Place (Map) ─── */
const CITIES = [
  { id: 'tashkent',  cx: 370, cy: 195,  label: 'TASHKENT',  sub: 'Capital — pop. 3.0M', desc: 'The capital and largest city. A modern metropolis merging Soviet-era grandeur with rapid 21st-century development.' },
  { id: 'samarkand', cx: 312, cy: 240, label: 'SAMARKAND', sub: 'pop. 880K',            desc: 'One of the oldest inhabited cities in Central Asia. Home to the Registan — three stunning 15th-century madrassas covered in turquoise and gold tile.' },
  { id: 'bukhara',   cx: 253, cy: 250, label: 'BUKHARA',   sub: 'pop. 305K',            desc: 'A UNESCO World Heritage site. Bukhara\'s old town has been preserved for over a thousand years, with medieval minarets and trading houses still standing.' },
  { id: 'khiva',     cx: 154,  cy: 183, label: 'KHIVA',     sub: 'pop. 100K',             desc: 'A living museum — the ancient walled city of Itchan Kala is one of the best-preserved ancient cities in Central Asia.' },
  { id: 'fergana',   cx: 432, cy: 215, label: 'FERGANA',   sub: 'pop. 328K',            desc: 'Heart of the fertile Fergana Valley. Known for silk production, ceramics, and as one of the most densely populated regions of Central Asia.' },
]

function ThePlace() {
  const [active, setActive] = useState<string | null>(null)
  const activeCity = CITIES.find(c => c.id === active)
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${C.deep} 0%, #050a24 100%)`,
      padding: 'clamp(40px, 8vw, 100px) clamp(20px, 6vw, 80px)',
      position: 'relative',
    }}>
      <div className="uzbek-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease', marginBottom: 60 }}>
          <div style={{ fontFamily: 'Space Mono, monospace', color: C.teal, fontSize: 12, letterSpacing: '0.4em', marginBottom: 12 }}>
            LAYER 01
          </div>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700, color: C.white, letterSpacing: '0.1em' }}>
            THE PLACE
          </div>
          <div style={{ height: 2, width: 80, background: C.gold, marginTop: 16 }} />
          <div style={{ marginTop: 20, fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(144,224,239,0.7)', maxWidth: 500, lineHeight: 1.7 }}>
            A land-locked nation at the crossroads of civilisations. Click a city to discover its story.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start' }}>

          {/* Info panel */}
          <div style={{ order: 1, minHeight: 180 }}>
            {activeCity ? (
              <div style={{ animation: 'fadeInUp 0.4s ease', background: 'rgba(0,150,199,0.08)', border: `1px solid rgba(0,150,199,0.25)`, padding: 28, borderLeft: `3px solid ${C.teal}` }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: 24, fontWeight: 700, color: C.white, letterSpacing: '0.1em' }}>{activeCity.label}</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: C.teal, marginTop: 4, letterSpacing: '0.1em' }}>{activeCity.sub}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(144,224,239,0.8)', marginTop: 16, lineHeight: 1.8 }}>{activeCity.desc}</div>
              </div>
            ) : (
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: 'rgba(0,150,199,0.35)', letterSpacing: '0.2em', paddingTop: 20 }}>
                SELECT A CITY TO REVEAL ITS STORY
              </div>
            )}
          </div>

          {/* SVG Map */}
          <div style={{ order: 2, opacity: visible ? 1 : 0, transition: 'opacity 1s ease 0.3s' }}>
            <svg width="500" height="310" viewBox="0 50 500 280" style={{ maxWidth: '100%' }}>
              {/* Country outline */}
              <path
                d="M 105 55 L 159 90 L 189 121 L 241 118 L 261 117 L 277 127 L 284 141 L 293 137 L 290 168 L 298 170 L 303 174 L 306 183 L 308 192 L 316 197 L 331 196 L 337 194 L 342 196 L 342 204 L 346 211 L 352 211 L 365 192 L 383 178 L 394 174 L 405 165 L 415 162 L 421 164 L 397 182 L 397 186 L 407 187 L 411 193 L 421 196 L 427 190 L 431 185 L 434 188 L 442 197 L 465 205 L 462 210 L 449 214 L 440 222 L 409 224 L 399 218 L 407 208 L 402 199 L 386 208 L 374 210 L 370 225 L 358 226 L 360 235 L 347 245 L 333 242 L 327 245 L 325 249 L 333 261 L 343 260 L 342 268 L 349 284 L 333 311 L 324 312 L 312 308 L 303 309 L 305 291 L 294 285 L 276 280 L 218 245 L 202 226 L 194 211 L 180 193 L 167 193 L 144 187 L 144 175 L 138 170 L 136 162 L 125 157 L 107 145 L 97 151 L 99 158 L 94 155 L 83 165 L 74 165 L 68 172 L 67 191 L 41 191 L 39 74 Z"
                fill="rgba(0,60,140,0.2)"
                stroke={C.teal}
                strokeWidth="1.5"
              />
              {/* Cities */}
              {CITIES.map(city => (
                <g
                  key={city.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActive(active === city.id ? null : city.id)}
                >
                  <circle
                    cx={city.cx} cy={city.cy} r="14"
                    fill="transparent"
                  />
                  <circle
                    cx={city.cx} cy={city.cy} r={active === city.id ? 8 : 5}
                    fill={active === city.id ? C.gold : C.teal}
                    stroke={active === city.id ? C.gold : C.cyan}
                    strokeWidth={active === city.id ? 0 : 1}
                    style={{ transition: 'all 0.25s ease' }}
                  />
                  {active === city.id && (
                    <circle cx={city.cx} cy={city.cy} r="16" fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.6" />
                  )}
                  <text
                    x={city.cx} y={city.cy - 14}
                    textAnchor="middle"
                    fontSize="9"
                    fill={active === city.id ? C.gold : 'rgba(144,224,239,0.65)'}
                    fontFamily="Space Mono, monospace"
                    style={{ transition: 'fill 0.25s' }}
                  >
                    {city.label}
                  </text>
                </g>
              ))}
              {/* Aral Sea (vestige) */}
              <clipPath id="cut-half">
                <path
                d="M 105 55 L 159 90 L 189 121 L 241 118 L 261 117 L 277 127 L 284 141 L 293 137 L 290 168 L 298 170 L 303 174 L 306 183 L 308 192 L 316 197 L 331 196 L 337 194 L 342 196 L 342 204 L 346 211 L 352 211 L 365 192 L 383 178 L 394 174 L 405 165 L 415 162 L 421 164 L 397 182 L 397 186 L 407 187 L 411 193 L 421 196 L 427 190 L 431 185 L 434 188 L 442 197 L 465 205 L 462 210 L 449 214 L 440 222 L 409 224 L 399 218 L 407 208 L 402 199 L 386 208 L 374 210 L 370 225 L 358 226 L 360 235 L 347 245 L 333 242 L 327 245 L 325 249 L 333 261 L 343 260 L 342 268 L 349 284 L 333 311 L 324 312 L 312 308 L 303 309 L 305 291 L 294 285 L 276 280 L 218 245 L 202 226 L 194 211 L 180 193 L 167 193 L 144 187 L 144 175 L 138 170 L 136 162 L 125 157 L 107 145 L 97 151 L 99 158 L 94 155 L 83 165 L 74 165 L 68 172 L 67 191 L 41 191 L 39 74 Z"
                fill="rgba(0,60,140,0.2)"
                stroke={C.teal}
                strokeWidth="1.5"
              />
              </clipPath>
              <ellipse cx="127" cy="80" rx="28" ry="40"  clipPath="url(#cut-half)" fill="rgba(0,100,180,0.2)" stroke="rgba(0,150,199,0.3)" strokeWidth="0.8" />
              <text x="127" y="95" textAnchor="middle" fontSize="7" fill="rgb(5, 193, 255)" fontFamily="Space Mono">ARAL SEA</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Silk Road ─── */
const ROUTE = [
  { x: 30,  label: "CHINA",    sub: "Xi'an" },
  { x: 200, label: "FERGANA",  sub: "Uzbekistan" },
  { x: 310, label: "SAMARKAND",sub: "Uzbekistan" },
  { x: 420, label: "BUKHARA",  sub: "Uzbekistan" },
  { x: 540, label: "MERV",     sub: "Turkmenistan" },
  { x: 680, label: "PERSIA",   sub: "Iran" },
  { x: 810, label: "EUROPE",   sub: "Constantinople" },
]

function SilkRoad() {
  const ref = useRef<HTMLDivElement>(null)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimating(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      minHeight: '100vh',
      background: '#04091a',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: 'clamp(40px, 8vw, 100px) clamp(20px, 6vw, 80px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="uzbek-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.08 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: 70 }}>
          <div style={{ fontFamily: 'Space Mono, monospace', color: C.teal, fontSize: 12, letterSpacing: '0.4em', marginBottom: 12 }}>LAYER 02</div>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700, color: C.white, letterSpacing: '0.1em' }}>THE SILK ROAD</div>
          <div style={{ height: 2, width: 80, background: C.gold, marginTop: 16 }} />
          <div style={{ marginTop: 20, fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(144,224,239,0.7)', maxWidth: 540, lineHeight: 1.7 }}>
            For over a millennium, Uzbekistan stood at the heart of the world's greatest trade network. Samarkand and Bukhara weren't on the Silk Road — they were the Silk Road.
          </div>
        </div>

        {/* Route visualisation */}
        <div style={{ position: 'relative', height: 160 }}>
          <svg width="100%" height="160" viewBox="0 0 840 160" preserveAspectRatio="xMidYMid meet">
            {/* Background dashed line */}
            <line x1="30" y1="80" x2="810" y2="80" stroke="rgba(0,150,199,0.15)" strokeWidth="1" strokeDasharray="6,6" />
            {/* Animated route */}
            {animating && (
              <line
                x1="30" y1="80" x2="810" y2="80"
                stroke={C.gold}
                strokeWidth="2"
                className="route-trace"
                opacity="0.8"
              />
            )}
            {/* Cities */}
            {ROUTE.map((stop, i) => {
              const isUzbek = stop.sub === 'Uzbekistan'
              return (
                <g key={stop.label} style={{ opacity: animating ? 1 : 0, transition: `opacity 0.4s ease ${0.5 + i * 0.3}s` }}>
                  <circle
                    cx={stop.x} cy="80" r={isUzbek ? 10 : 6}
                    fill={isUzbek ? C.gold : 'rgba(0,150,199,0.4)'}
                    stroke={isUzbek ? C.gold : C.teal}
                    strokeWidth="1"
                  />
                  {isUzbek && (
                    <circle cx={stop.x} cy="80" r="18" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.4" />
                  )}
                  <text x={stop.x} y="56" textAnchor="middle" fontSize={isUzbek ? '18' : '14'} fill={isUzbek ? C.gold : C.teal} fontFamily="Space Mono, monospace" fontWeight={isUzbek ? '700' : '400'}>
                    {stop.label}
                  </text>
                  <text x={stop.x} y="114" textAnchor="middle" fontSize="13" fill="rgba(144,224,239,0.5)" fontFamily="Inter, sans-serif">
                    {stop.sub}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div style={{ marginTop: 60, borderTop: '1px solid rgba(0,150,199,0.15)', paddingTop: 40 }}>
          <div style={{
            fontFamily: 'Cinzel, serif', fontSize: 'clamp(18px, 3vw, 28px)',
            color: C.light, fontStyle: 'italic', textAlign: 'center', lineHeight: 1.6,
            maxWidth: 700, margin: '0 auto',
          }}>
            "The Silk Road didn't disappear.<br />It changed direction."
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── The Craft ─── */
type CraftMode = 'ceramics' | 'suzani' | 'architecture'

const CRAFT_DATA = {
  ceramics: {
    label: 'CERAMICS',
    title: 'The Turquoise Art',
    text: 'Uzbek potters have used the same cobalt-and-turquoise glazing techniques since the 9th century. The iconic colour — lapis lazuli blue — was sourced from Afghanistan and became the signature of Central Asian craftsmanship.',
    color: C.teal,
    patternClass: 'uzbek-pattern',
    img: 'https://images.unsplash.com/photo-1626552727238-473e25d1a0a5?w=800&h=600&fit=crop&auto=format',
  },
  suzani: {
    label: 'SUZANI',
    title: 'The Embroidered Story',
    text: 'Suzani — from the Persian for "needle" — is hand-embroidered textile passed from mother to daughter as a wedding dowry. Each piece takes years to make and encodes family history in its botanical and geometric motifs.',
    color: C.rust,
    patternClass: 'uzbek-pattern-gold',
    img: 'https://images.unsplash.com/photo-1694497605407-ff8f8155c6a4?w=800&h=600&fit=crop&auto=format',
  },
  architecture: {
    label: 'ARCHITECTURE',
    title: 'Geometry as Prayer',
    text: 'Islamic geometric patterns are mathematical art — infinite tessellations that represent the infinite nature of God. The Registan\'s three madrassas contain some of the finest examples ever created, their facades a masterclass in geometric design.',
    color: C.gold,
    patternClass: 'uzbek-pattern',
    img: 'https://images.unsplash.com/photo-1696009169356-ec85d106d513?w=800&h=600&fit=crop&auto=format',
  },
}

function CraftSection() {
  const [mode, setMode] = useState<CraftMode>('ceramics')
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const data = CRAFT_DATA[mode]

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, #04091a 0%, ${C.deep} 100%)`,
      padding: 'clamp(40px, 8vw, 100px) clamp(20px, 6vw, 80px)',
      position: 'relative',
    }}>
      <div className={data.patternClass} style={{ position: 'absolute', inset: 0, opacity: 0.2, transition: 'opacity 0.6s ease' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 50, opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', color: C.teal, fontSize: 12, letterSpacing: '0.4em', marginBottom: 12 }}>LAYER 03</div>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700, color: C.white, letterSpacing: '0.1em' }}>THE CRAFT</div>
          <div style={{ height: 2, width: 80, background: C.gold, marginTop: 16 }} />
        </div>

        {/* Mode buttons */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 50, flexWrap: 'wrap' }}>
          {(Object.keys(CRAFT_DATA) as CraftMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 12, letterSpacing: '0.3em',
                padding: '10px 24px',
                border: `1px solid ${mode === m ? CRAFT_DATA[m].color : 'rgba(0,150,199,0.3)'}`,
                background: mode === m ? `rgba(${m === 'ceramics' ? '0,150,199' : m === 'suzani' ? '231,111,81' : '233,196,106'},0.15)` : 'transparent',
                color: mode === m ? CRAFT_DATA[m].color : 'rgba(144,224,239,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {CRAFT_DATA[m].label}
            </button>
          ))}
        </div>

        {/* Content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'start' }}>
          <div key={mode} style={{ animation: 'fadeInUp 0.5s ease' }}>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700, color: C.white, letterSpacing: '0.08em', marginBottom: 20 }}>
              {data.title}
            </div>
            <div style={{ height: 1, background: `linear-gradient(to right, ${data.color}, transparent)`, marginBottom: 24 }} />
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(144,224,239,0.8)', lineHeight: 1.85 }}>
              {data.text}
            </div>
          </div>
          <div
            key={mode + '-img'}
            style={{
              height: 360, overflow: 'hidden', position: 'relative',
              border: `1px solid rgba(0,150,199,0.2)`,
              animation: 'uzbekReveal 0.7s ease',
            }}
          >
            <img
              src={data.img}
              alt={data.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.2) brightness(0.85)' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${C.deep}55, transparent)` }} />
            <div style={{
              position: 'absolute', top: 16, left: 16,
              fontFamily: 'Space Mono, monospace', fontSize: 10,
              color: data.color, letterSpacing: '0.3em', opacity: 0.8,
            }}>
              {data.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Then / Now ─── */
function ThenNow() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      minHeight: '100vh',
      background: '#030714',
      display: 'flex', alignItems: 'stretch',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* THEN */}
      <div style={{
        flex: 1, padding: 'clamp(50px, 8vw, 100px) clamp(20px, 5vw, 60px)',
        background: `linear-gradient(135deg, #1a0a02 0%, #0a0414 100%)`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(-30px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        borderRight: '1px solid rgba(0,150,199,0.1)',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1692704209606-62b2597a4fb1?w=800&h=600&fit=crop&auto=format)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'Space Mono, monospace', color: 'rgba(233,196,106,0.5)', fontSize: 11, letterSpacing: '0.4em', marginBottom: 16 }}>THEN</div>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 700, color: C.gold, letterSpacing: '0.08em', lineHeight: 1.2 }}>Silk Road.<br />Caravans.<br />Madrassas.<br />Bazaars.</div>
          <div style={{ marginTop: 24, fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(233,196,106,0.55)', lineHeight: 1.8, maxWidth: 340 }}>
            For a thousand years, Uzbekistan was the intellectual and commercial centre of the known world. Scholars, merchants, astronomers, and artists converged here. This was where East met West.
          </div>
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['9th–15th c. — Golden Age of Islamic science', 'Samarkand hosted the world\'s greatest observatory', 'Bukhara had 100+ madrassas, 10,000+ students'].map(f => (
              <div key={f} style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'rgba(233,196,106,0.45)', letterSpacing: '0.04em' }}>
                ◆ {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider arrow */}
      <div style={{ width: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 2 }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 28, color: C.teal, opacity: 0.6, transform: 'rotate(-90deg)', whiteSpace: 'nowrap', letterSpacing: '0.2em' }}>→</div>
      </div>

      {/* NOW */}
      <div style={{
        flex: 1, padding: 'clamp(50px, 8vw, 100px) clamp(20px, 5vw, 60px)',
        background: `linear-gradient(135deg, #020c24 0%, ${C.deep} 100%)`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(30px)',
        transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1622021109028-8ba1d5374161?w=800&h=600&fit=crop&auto=format)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'Space Mono, monospace', color: 'rgba(0,150,199,0.5)', fontSize: 11, letterSpacing: '0.4em', marginBottom: 16 }}>NOW</div>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 700, color: C.teal, letterSpacing: '0.08em', lineHeight: 1.2 }}>Technology.<br />Startups.<br />Engineering.<br />Code.</div>
          <div style={{ marginTop: 24, fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(144,224,239,0.6)', lineHeight: 1.8, maxWidth: 340 }}>
            A young nation rediscovering itself. Uzbekistan's developers, engineers, and builders are writing the next chapter — not with caravans, but with code.
          </div>
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['35M+ population — avg. age 28', 'Fastest-growing tech sector in Central Asia', 'Same curiosity. Different tools.'].map(f => (
              <div key={f} style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'rgba(0,150,199,0.5)', letterSpacing: '0.04em' }}>
                ◆ {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UzbekWorld() {
  return (
    <>
      <UzbekReveal />
      <ThePlace />
      <SilkRoad />
      <CraftSection />
      <ThenNow />
    </>
  )
}
