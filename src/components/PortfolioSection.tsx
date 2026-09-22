import { useState, useEffect, useRef } from 'react'

const C = {
  deep:  '#03045e',
  blue:  '#023e8a',
  cyan:  '#0096c7',
  teal:  '#48cae4',
  light: '#90e0ef',
  gold:  '#e9c46a',
  white: '#f0f8ff',
  rust:  '#e76f51',
  bg:    '#050a05',
}

const PROJECTS = [
  {
    id: '01',
    title: 'Operation Identity',
    stack: 'React · GSAP · SVG · Tailwind',
    desc: 'This experience. A cinematic introduction to Uzbekistan built entirely in code — proof that a developer\'s origin story can itself be a portfolio piece.',
    link: '#',
    accent: C.gold,
  },
  {
    id: '02',
    title: 'Replace with your project',
    stack: 'Your stack here',
    desc: 'Describe what you built, the problem it solved, and the technical decisions that made it interesting.',
    link: '#',
    accent: C.teal,
  },
  {
    id: '03',
    title: 'Replace with your project',
    stack: 'Your stack here',
    desc: 'The best projects tell a story. What was the constraint? What was the clever solution? That\'s what makes a portfolio memorable.',
    link: '#',
    accent: C.rust,
  },
]

const SKILLS = [
  'React', 'Node.js', 'Express', 'MongoDB',
  'TypeScript', 'REST APIs', 'PostgreSQL',
  'Git', 'Tailwind CSS', 'SVG Animation',
]

export default function PortfolioSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setPhase(1), 200)
        setTimeout(() => setPhase(2), 800)
        setTimeout(() => setPhase(3), 1400)
        setTimeout(() => setPhase(4), 2000)
        setTimeout(() => setPhase(5), 2600)
      }
    }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* Destination reveal */}
      <div
        ref={ref}
        style={{
          minHeight: '100vh',
          background: '#030714',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div className="uzbek-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.12 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, #030714 90%)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '80px 40px' }}>
          {/* Terminal: destination reached */}
          <div style={{
            fontFamily: 'Space Mono, monospace', fontSize: 12,
            letterSpacing: '0.45em', color: 'rgba(0,255,65,0.5)',
            marginBottom: 60,
            opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.6s ease',
          }}>
            YOU HAVE REACHED THE DESTINATION
          </div>

          {/* Country */}
          <div style={{
            fontFamily: 'Cinzel, serif', fontSize: 'clamp(38px, 8vw, 80px)',
            fontWeight: 900, color: C.teal, letterSpacing: '0.15em',
            opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>
            UZBEKISTAN
          </div>

          {/* Identity cascade */}
          {[
            { text: 'My birthplace.', color: C.light },
            { text: 'My identity.',   color: C.gold },
            { text: 'My inspiration.', color: C.teal },
            { text: 'My code.',        color: C.white },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(16px, 2.5vw, 22px)',
                color: item.color,
                marginTop: 18,
                letterSpacing: '0.08em',
                opacity: phase >= 2 + i ? 1 : 0,
                transform: phase >= 3 + i ? 'none' : 'translateY(12px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              {item.text}
            </div>
          ))}

          {/* Gold ornamental divider */}
          <div style={{
            margin: '60px auto 0',
            display: 'flex', alignItems: 'center', gap: 16,
            maxWidth: 320, justifyContent: 'center',
            opacity: phase >= 5 ? 1 : 0, transition: 'opacity 0.6s ease',
          }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.gold})` }} />
            <svg width="16" height="16" viewBox="0 0 20 20">
              <polygon points="10,1 12.4,7.6 19.5,7.6 13.9,12.2 15.9,18.5 10,14.5 4.1,18.5 6.1,12.2 0.5,7.6 7.6,7.6" fill={C.gold} />
            </svg>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.gold})` }} />
          </div>
        </div>
      </div>

      {/* Portfolio content */}
      <div style={{
        background: '#04091a',
        padding: 'clamp(60px, 10vw, 120px) clamp(24px, 6vw, 80px)',
        position: 'relative',
      }}>
        <div className="uzbek-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.08 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>

          {/* Name header */}
          <div style={{ marginBottom: 80 }}>
            <div style={{ fontFamily: 'Space Mono, monospace', color: C.teal, fontSize: 11, letterSpacing: '0.5em', marginBottom: 16 }}>
              DEVELOPER
            </div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: 900, color: C.white, letterSpacing: '0.1em', lineHeight: 1.1 }}>
              ABROR
            </div>
            <div style={{ marginTop: 20, fontFamily: 'Inter, sans-serif', fontSize: 17, color: 'rgba(144,224,239,0.65)', lineHeight: 1.75, maxWidth: 520 }}>
              I build digital experiences. My identity comes from Uzbekistan's tradition of craftsmanship — geometric precision, intentional design, and the belief that every detail matters.
            </div>
          </div>

          {/* Projects */}
          {/*
          <div style={{ marginBottom: 100 }}>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 28, fontWeight: 700, color: C.white, letterSpacing: '0.12em', marginBottom: 8 }}>
              WORK
            </div>
            <div style={{ height: 2, width: 60, background: C.gold, marginBottom: 40 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {PROJECTS.map(p => (
                <a
                  key={p.id}
                  href={p.link}
                  style={{
                    display: 'block', textDecoration: 'none',
                    background: 'rgba(2,62,138,0.12)',
                    border: '1px solid rgba(0,150,199,0.15)',
                    padding: 28,
                    transition: 'border-color 0.25s, background 0.25s',
                    position: 'relative', overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.borderColor = p.accent
                    el.style.background = 'rgba(2,62,138,0.22)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.borderColor = 'rgba(0,150,199,0.15)'
                    el.style.background = 'rgba(2,62,138,0.12)'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: p.accent, opacity: 0.7 }} />
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: p.accent, letterSpacing: '0.3em', marginBottom: 14 }}>
                    {p.id}
                  </div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 700, color: C.white, letterSpacing: '0.06em', marginBottom: 10 }}>
                    {p.title}
                  </div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(0,150,199,0.5)', letterSpacing: '0.1em', marginBottom: 16 }}>
                    {p.stack}
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(144,224,239,0.7)', lineHeight: 1.7 }}>
                    {p.desc}
                  </div>
                </a>
              ))}
            </div>
          </div>
          */}


          {/* Skills */}
          <div style={{ marginBottom: 100 }}>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 28, fontWeight: 700, color: C.white, letterSpacing: '0.12em', marginBottom: 8 }}>
              SKILLS
            </div>
            <div style={{ height: 2, width: 60, background: C.gold, marginBottom: 32 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {SKILLS.map(skill => (
                <div
                  key={skill}
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: 12, letterSpacing: '0.15em',
                    color: C.teal,
                    padding: '8px 20px',
                    border: '1px solid rgba(0,150,199,0.25)',
                    background: 'rgba(0,150,199,0.06)',
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div style={{
            borderTop: '1px solid rgba(0,150,199,0.12)',
            paddingTop: 60,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 700, color: C.white, letterSpacing: '0.08em', lineHeight: 1.2 }}>
                Let's build something.
              </div>
              <div style={{ marginTop: 16, fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(144,224,239,0.6)', lineHeight: 1.7 }}>
                The Silk Road was built by people willing to cross boundaries. I'm ready to cross the next one with you.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'EMAIL', value: 'abrorashrafhonov31@gmail.com' },
                { label: 'GITHUB', value: 'github.com/Aintik' },
                { label: 'LINKEDIN', value: 'linkedin.com/in/abrork/' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: C.teal, letterSpacing: '0.3em', minWidth: 70 }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: C.light }}>
                    <a href={`https://${item.value}`} target={'_blank'}>
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer signature */}
          <div style={{
            marginTop: 80,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '1px solid rgba(0,150,199,0.08)', paddingTop: 32,
          }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(0,150,199,0.25)', letterSpacing: '0.2em' }}>
              OPERATION: IDENTITY — COMPLETE
            </div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 14, color: 'rgba(233,196,106,0.4)', letterSpacing: '0.2em' }}>
              UZBEKISTAN ◆ {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
