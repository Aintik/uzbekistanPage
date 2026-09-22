import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/* ─── HUD stage metadata ─── */
const STAGES = [
  {
    scan: '000', label: 'GALAXY',
    title: 'SCANNING THE COSMOS',
    alt: '26,000 LY', region: 'MILKY WAY — ORION ARM',
    coords: 'GALACTIC CORE: BEARING 0°', status: 'ESTABLISHING POSITION...',
  },
  {
    scan: '001', label: 'SOLAR SYSTEM',
    title: 'SOL SYSTEM ACQUIRED',
    alt: '4.5 AU', region: 'SOL SYSTEM — INNER PLANETS',
    coords: '23°N ECLIPTIC PLANE', status: 'APPROACHING EARTH...',
  },
  {
    scan: '002', label: 'EARTH',
    title: 'EARTH ACQUIRED',
    alt: '12,000 KM', region: 'TERRA — EURASIAN PLATE',
    coords: "40°00'N  60°00'E", status: 'DESCENDING...',
  },
  {
    scan: '003', label: 'CENTRAL ASIA',
    title: 'REGION: CENTRAL ASIA',
    alt: '1,500 KM', region: 'CENTRAL ASIAN STEPPE',
    coords: "41°30'N  64°00'E", status: 'SCANNING REGION...',
  },
  {
    scan: '004', label: 'UZBEKISTAN',
    title: '█ TARGET: UZBEKISTAN',
    alt: '500 KM', region: 'REPUBLIC OF UZBEKISTAN',
    coords: "41°18'N  69°16'E", status: '██ LOCK CONFIRMED',
  },
  //{
  //  scan: '005', label: 'TASHKENT',
  //  title: 'CAPITAL: TASHKENT',
  //  alt: '100 KM', region: 'TASHKENT CITY',
  //  coords: "41°17'N  69°17'E", status: 'CITY LOCK...',
  //},
]

/* ─── Camera targets per stage ─── */
// Uzbekistan lat 41°N lon 63°E: after Earth.rotation.y = -2.67 it faces +Z.
// Camera direction to 41°N: (0, sin(41°), cos(41°)) = (0, 0.656, 0.755)
const plusY = 50
const CAM = [
  { x: 0, y: 250 ,    z: 700  },  // galaxy
  { x: 0, y: 50 ,    z: 160  },  // solar system
  { x: 0, y: 0 ,    z: 12    },  // earth
  { x: 0, y: 3.93 , z: 4.53 },  // central asia (41°N, d=6)
  { x: 0, y: 2.10 , z: 2.42},  // uzbekistan (41°N, d=3.2)
]

// Earth Y-rotation that brings Uzbekistan (lon 63°E) to face +Z camera
const UZBEK_ROT_Y = -2.669 

export default function ZoomSequence() {
  const outerRef  = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stage, setStage] = useState(0)
  const stageRef    = useRef(0)
  const progressRef = useRef(0)

  useEffect(() => {
    if (!canvasRef.current) return

    /* ─── Renderer ─── */
    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000003)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 60000)
    camera.position.z = 700

    /* ─── Lighting ─── */
    scene.add(new THREE.AmbientLight(0xEAECF1, 0.9))
    const sunPL = new THREE.PointLight(0xfffaee, 5, 800)
    sunPL.position.set(0, 0 , 50)
    scene.add(sunPL)

    /* ─── Distant background stars ─── */
    {
      const N   = 8000
      const pos = new Float32Array(N * 3)
      const col = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        const r     = 4000 + Math.random() * 10000
        const theta = Math.random() * Math.PI * 2
        const phi   = Math.acos(2 * Math.random() - 1)
        pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
        pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
        pos[i*3+2] = r * Math.cos(phi)
        const b = 0.4 + 0.6 * Math.random()
        col[i*3] = b * (0.85 + 0.15 * Math.random())
        col[i*3+1] = b * (0.85 + 0.15 * Math.random())
        col[i*3+2] = b
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
      scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 3.5, vertexColors: true, sizeAttenuation: true })))
    }

    /* ─── Galaxy particle cloud ─── */
    const galaxyGroup = new THREE.Group()
    scene.add(galaxyGroup)
    let galaxyMat: THREE.PointsMaterial
    {
      const N   = 42000
      const pos = new Float32Array(N * 3)
      const col = new Float32Array(N * 3)

      // Central bulge
      for (let i = 0; i < 6000; i++) {
        const r     = Math.pow(Math.random(), 2.2) * 70
        const theta = Math.random() * Math.PI * 2
        const phi   = Math.acos(2 * Math.random() - 1)
        pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
        pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.18
        pos[i*3+2] = r * Math.cos(phi)
        const b = 0.55 + 0.45 * Math.random()
        col[i*3] = b; col[i*3+1] = b * 0.8; col[i*3+2] = b * 0.55
      }

      // Two spiral arms
      for (let i = 6000; i < N; i++) {
        const arm      = i % 2
        const r        = 12 + Math.pow(Math.random(), 0.55) * 280
        const armAngle = arm * Math.PI + (r / 280) * Math.PI * 2.6
        const spread   = 14 * (0.25 + r / 280)
        const x = r * Math.cos(armAngle) + (Math.random() - 0.5) * spread
        const z = r * Math.sin(armAngle) + (Math.random() - 0.5) * spread
        const y = (Math.random() - 0.5) * 16
        pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z

        if (Math.random() < 0.55) {
          const b = 0.25 + 0.5 * Math.random()
          col[i*3] = b * 0.55; col[i*3+1] = b * 0.78; col[i*3+2] = b
        } else {
          const b = 0.2 + 0.45 * Math.random()
          col[i*3] = b; col[i*3+1] = b * 0.95; col[i*3+2] = b * 0.85
        }
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
      galaxyMat = new THREE.PointsMaterial({ size: 1.1, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 1 })
      galaxyGroup.add(new THREE.Points(geo, galaxyMat))
    }

    /* ─── Solar system (centred at z=50) ─── */
    const solarGroup = new THREE.Group()
    solarGroup.position.z = 50
    solarGroup.position.y = 0 

    scene.add(solarGroup)

    // Sun sphere + corona
    solarGroup.add((() => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffee44 }))
      return m
    })())
    solarGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(15, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.1, side: THREE.BackSide })
    ))
    // Outer glow ring
    solarGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(22, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.04, side: THREE.BackSide })
    ))

    const PLANET_DATA = [
      { r: 0.40, color: 0x998877, orbit: 19, speed: 4.7, offset: 0.0 },  // Mercury
      { r: 0.90, color: 0xddaa44, orbit: 29, speed: 3.5, offset: 1.2 },  // Venus
      { r: 1.10, color: 0x2255bb, orbit: 40, speed: 3.0, offset: 2.5 },  // Earth
      { r: 0.65, color: 0xcc4422, orbit: 57, speed: 2.4, offset: 4.1 },  // Mars
    ]
    const planetMeshes: THREE.Mesh[] = PLANET_DATA.map(p => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(p.r, 24, 24),
        new THREE.MeshPhongMaterial({ color: p.color, shininess: 35 })
      )
      solarGroup.add(mesh)

      // Orbit ring
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2
        pts.push(new THREE.Vector3(Math.cos(a) * p.orbit, 0, Math.sin(a) * p.orbit))
      }
      solarGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x223355, transparent: true, opacity: 0.35 })
      ))
      return mesh
    })

    /* ─── Hero Earth ─── */
    const earthGroup = new THREE.Group()
    scene.add(earthGroup)
    earthGroup.position.y = 0 

    // Build Earth equirectangular texture on a 2048×1024 canvas
    const ecv = document.createElement('canvas')
    ecv.width = 2048; ecv.height = 1024
    const ec = ecv.getContext('2d')!

    const fill = (style: string, fn: () => void) => { ec.fillStyle = style; ec.beginPath(); fn(); ec.fill() }

    // Ocean
    ec.fillStyle = '#0c2c58'; ec.fillRect(0, 0, 2048, 1024)
    // Deep ocean variation
    fill('rgba(5,35,80,0.5)', () => ec.ellipse(1024, 600, 900, 320, 0, 0, Math.PI * 2))
    fill('rgba(8,50,110,0.3)', () => ec.ellipse(500, 420, 450, 190, 0.4, 0, Math.PI * 2))

    // Note: Uzbekistan centre at u=0.675 → x=1382, v=0.272 → y=279 on this canvas.
    // Landmasses drawn in approximate equirectangular projection.

    // Eurasia
    fill('#1a4920', () => ec.ellipse(1400, 250, 520, 210, -0.15, 0, Math.PI * 2))
    fill('#1a4920', () => ec.ellipse(1360, 165, 500, 90, -0.08, 0, Math.PI * 2)) // Siberia
    fill('#1a4920', () => ec.ellipse(1450, 340, 150, 115, 0.3, 0, Math.PI * 2))  // Indian sub
    fill('#1a4920', () => ec.ellipse(1600, 330, 105, 82, 0, 0, Math.PI * 2))     // SE Asia
    fill('#1a4920', () => ec.ellipse(1090, 205, 130, 85, 0.3, 0, Math.PI * 2))  // W Europe
    // Central Asia specific (slightly lighter green to distinguish)
    fill('#22612a', () => ec.ellipse(1382, 278, 140, 72, 0, 0, Math.PI * 2))

    // Africa
    fill('#1a4920', () => ec.ellipse(1200, 490, 165, 255, 0, 0, Math.PI * 2))
    fill('#1a4920', () => ec.ellipse(1175, 415, 110, 85, 0, 0, Math.PI * 2))  // N Africa

    // North America
    fill('#1a4920', () => ec.ellipse(335, 225, 275, 185, -0.2, 0, Math.PI * 2))
    fill('#1a4920', () => ec.ellipse(275, 340, 78, 62, 0.1, 0, Math.PI * 2))  // Mexico/CAm

    // South America
    fill('#1a4920', () => ec.ellipse(450, 585, 145, 235, 0.15, 0, Math.PI * 2))

    // Australia
    fill('#1a4920', () => ec.ellipse(1725, 605, 135, 92, -0.1, 0, Math.PI * 2))

    // Greenland
    ec.fillStyle = '#a8d0e2'
    ec.beginPath(); ec.ellipse(525, 120, 62, 92, 0.2, 0, Math.PI * 2); ec.fill()

    // Polar ice caps
    ec.fillStyle = '#c8dff0'; ec.fillRect(0, 925, 2048, 99) // Antarctica
    ec.fillStyle = '#b0cce4'; ec.fillRect(0, 0, 2048, 28)   // Arctic

    // Subtle ocean shimmer
    fill('rgba(25,90,190,0.12)', () => ec.ellipse(780, 510, 720, 205, -0.3, 0, Math.PI * 2))

    const earthTex = new THREE.CanvasTexture(ecv)

    // Highlight texture — Central Asia glow + Uzbekistan gold
    const hcv = document.createElement('canvas')
    hcv.width = 2048; hcv.height = 1024
    const hc = hcv.getContext('2d')!
    hc.clearRect(0, 0, 2048, 1024)

    // Central Asia region glow (turquoise, wider area)
    const g1 = hc.createRadialGradient(1382, 265, 0, 1382, 265, 210)
    g1.addColorStop(0,   'rgba(0,210,255,0.65)')
    g1.addColorStop(0.5, 'rgba(0,120,220,0.30)')
    g1.addColorStop(1,   'rgba(0,60,160,0)')
    hc.fillStyle = g1
    hc.beginPath(); hc.ellipse(1382, 265, 210, 145, 0, 0, Math.PI * 2); hc.fill()

    // Uzbekistan gold core
    const g2 = hc.createRadialGradient(1382, 278, 0, 1382, 278, 85)
    g2.addColorStop(0,   'rgba(255,220,0,1)')
    g2.addColorStop(0.35,'rgba(255,170,0,0.6)')
    g2.addColorStop(0.7, 'rgba(255,90,0,0.2)')
    g2.addColorStop(1,   'rgba(255,0,0,0)')
    hc.fillStyle = g2
    hc.beginPath(); hc.ellipse(1382, 278, 85, 54, 0, 0, Math.PI * 2); hc.fill()

    const hlTex = new THREE.CanvasTexture(hcv)

    // Earth mesh
    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 128, 64),
      new THREE.MeshPhongMaterial({ map: earthTex, specular: new THREE.Color(0x1a3a60), shininess: 22 })
    )
    earthGroup.add(earthMesh)

    // Atmosphere shell
    earthGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.09, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x3a88ff, transparent: true, opacity: 0.075, side: THREE.BackSide })
    ))

    // Highlight layer (carries the Central Asia / Uzbekistan glow)
    const hlMat = new THREE.MeshBasicMaterial({ map: hlTex, transparent: true, opacity: 0, depthWrite: false })
    const hlMesh = new THREE.Mesh(new THREE.SphereGeometry(1.003, 128, 64), hlMat)
    earthGroup.add(hlMesh)

    /* ─── Animation state ─── */
    let camX = 0, camY = 0, camZ = 700
    let earthRotY = 0
    let hlOpacity = 0
    let time = 0
    let rafId: number

    /* ─── Scroll handler ─── */
    function handleScroll() {
      if (!outerRef.current) return
      const rect = outerRef.current.getBoundingClientRect()
      const p = Math.max(0, Math.min(1, -rect.top / (outerRef.current.offsetHeight - window.innerHeight)))
      progressRef.current = p
      const s = Math.min(4, Math.floor(p * 5))
      if (s !== stageRef.current) {
        stageRef.current = s
        setStage(s)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    /* ─── Main render loop ─── */
    function animate() {
      rafId = requestAnimationFrame(animate)
      time += 0.007

      const s = stageRef.current
      const tgt = CAM[s]

      // Smooth camera
      camX += (tgt.x - camX) * 0.04
      camY += (tgt.y - camY) * 0.04
      camZ += (tgt.z - camZ) * 0.04
      camera.position.set(camX, camY, camZ)
      camera.lookAt(0, 0, 0)

      // Slowly rotate galaxy
      galaxyGroup.rotation.y += 0.0003

      // Galaxy fade out as camera dives below ~80 units
      const gFade = camZ > 80 ? 1 : Math.max(0, (camZ - 25) / 55)
      galaxyMat.opacity = gFade

      // Solar system: visible only while camera is far (z > 30)
      galaxyGroup.visible = camZ > 600
      solarGroup.visible = camZ > 28 && camZ < 600
      PLANET_DATA.forEach((p, i) => {
        const a = time * p.speed * 0.14 + p.offset
        planetMeshes[i].position.x = Math.cos(a) * p.orbit
        planetMeshes[i].position.z = Math.sin(a) * p.orbit
      })

      // Earth orientation: free spin stages 0–2, orient to Central Asia for 3–4
      if (s < 3) {
        earthRotY += 0.0022
      } else {
        earthRotY += (UZBEK_ROT_Y - earthRotY) * 0.028
      }
      earthMesh.rotation.y = earthRotY
      hlMesh.rotation.y    = earthRotY

      // Highlight glow
      const hlTarget = s === 3 ? 0.7 : s === 4 ? 1.0 : 0
      hlOpacity += (hlTarget - hlOpacity) * 0.045
      hlMat.opacity = hlOpacity

      renderer.render(scene, camera)
    }
    animate()

    /* ─── Resize ─── */
    function handleResize() {
      const w = window.innerWidth, h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      earthTex.dispose(); hlTex.dispose()
      earthMesh.geometry.dispose()
      renderer.dispose()
    }
  }, [])

  const s = STAGES[stage]

  return (
    /* 300vh outer gives enough scroll travel for 5 stages */
    <div ref={outerRef} style={{ height: '250vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Three.js canvas */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />

        {/* ── HUD overlay ── */}
        <div
          className="font-terminal"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}
        >
          {/* Corner brackets */}
          {([
            { top: 16, left: 16, borderTop: '1px solid rgba(0,255,65,0.35)', borderLeft: '1px solid rgba(0,255,65,0.35)' },
            { top: 16, right: 16, borderTop: '1px solid rgba(0,255,65,0.35)', borderRight: '1px solid rgba(0,255,65,0.35)' },
            { bottom: 16, left: 16, borderBottom: '1px solid rgba(0,255,65,0.35)', borderLeft: '1px solid rgba(0,255,65,0.35)' },
            { bottom: 16, right: 16, borderBottom: '1px solid rgba(0,255,65,0.35)', borderRight: '1px solid rgba(0,255,65,0.35)' },
          ] as React.CSSProperties[]).map((style, i) => (
            <div key={i} style={{ position: 'absolute', width: 32, height: 32, ...style }} />
          ))}

          {/* Top-left: scan id + region + coords */}
          <div style={{ position: 'absolute', top: 24, left: 24, color: 'rgba(0,255,65,0.75)', fontSize: 12, letterSpacing: '0.1em' }}>
            <div style={{ color: '#ffd60a', fontSize: 22, fontWeight: 700, letterSpacing: '0.22em', marginBottom: 10 }}>
              SCAN // {s.scan}
            </div>
            <div style={{ color: 'rgba(0,255,65,0.5)', fontSize: 11, marginBottom: 4 }}>{s.region}</div>
            <div style={{ color: 'rgba(0,255,65,0.38)', fontSize: 11 }}>{s.coords}</div>
          </div>

          {/* Top-right: altitude */}
          <div style={{ position: 'absolute', top: 24, right: 24, textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'rgba(0,255,65,0.6)', letterSpacing: '0.15em' }}>ALTITUDE</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#00ff41', letterSpacing: '0.06em', lineHeight: 1.1 }}>
              {s.alt}
            </div>
          </div>

          {/* Stage label top-center */}
          <div style={{
            position: 'absolute', top: 24, left: 0, right: 0,
            textAlign: 'center',
            fontSize: 11, letterSpacing: '0.55em',
            color: 'rgba(0,255,65,0.28)',
          }}>
            {s.label}
          </div>

          {/* Bottom title + status */}
          <div style={{ position: 'absolute', bottom: 110, left: 0, right: 0, textAlign: 'center' }}>
            <div style={{
              fontSize: stage === 4 ? 34 : 16,
              color: stage === 4 ? '#ffd60a' : 'rgba(0,255,65,0.85)',
              letterSpacing: stage === 4 ? '0.38em' : '0.28em',
              fontWeight: 700,
              transition: 'font-size 0.6s ease, color 0.6s ease',
            }}>
              {s.title}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(0,255,65,0.38)', letterSpacing: '0.22em' }}>
              {s.status}
            </div>
          </div>

          {/* Stage progress dots */}
          <div style={{
            position: 'absolute', bottom: 62, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 7, alignItems: 'center',
          }}>
            {STAGES.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === stage ? 30 : 8, height: 3,
                  background: i <= stage ? '#00ff41' : 'rgba(0,255,65,0.14)',
                  transition: 'all 0.45s ease',
                }}
              />
            ))}
          </div>

          {/* Scroll hint on first stage */}
          {stage === 0 && (
            <div style={{
              position: 'absolute', bottom: 24, left: 0, right: 0,
              textAlign: 'center', fontSize: 11,
              color: 'rgba(0,255,65,0.28)', letterSpacing: '0.35em',
              animation: 'blink 2.4s ease-in-out infinite',
            }}>
              SCROLL TO INITIATE DESCENT
            </div>
          )}

          {/* Scanline */}
          <div className="scan-line" />
        </div>
      </div>
    </div>
  )
}
