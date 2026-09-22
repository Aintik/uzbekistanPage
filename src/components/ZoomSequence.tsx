import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/* ─── HUD metadata for each stage ─── */
const STAGES = [
  { scan: '000', label: 'GALAXY',       title: 'SCANNING THE COSMOS',    alt: '26,000 LY', region: 'MILKY WAY — ORION ARM',         coords: 'GALACTIC CORE: BEARING 0°',  status: 'ESTABLISHING POSITION...' },
  { scan: '001', label: 'SOLAR SYSTEM', title: 'SOL SYSTEM ACQUIRED',    alt: '4.5 AU',    region: 'SOL SYSTEM — INNER PLANETS',     coords: '23°N ECLIPTIC PLANE',        status: 'APPROACHING EARTH...'     },
  { scan: '002', label: 'EARTH',        title: 'EARTH ACQUIRED',         alt: '12,000 KM', region: 'TERRA — EURASIAN PLATE',         coords: "40°00'N  60°00'E",           status: 'DESCENDING...'            },
  { scan: '003', label: 'CENTRAL ASIA', title: 'REGION: CENTRAL ASIA',   alt: '1,500 KM',  region: 'CENTRAL ASIAN STEPPE',           coords: "41°30'N  64°00'E",           status: 'SCANNING REGION...'       },
  { scan: '004', label: 'UZBEKISTAN',   title: '█ TARGET: UZBEKISTAN',   alt: '500 KM',    region: 'REPUBLIC OF UZBEKISTAN',         coords: "41°18'N  69°16'E",           status: '██ LOCK CONFIRMED'       },
  { scan: '005', label: 'TASHKENT',     title: '█ CAPITAL: TASHKENT',    alt: '80 KM',     region: 'TASHKENT REGION — UZBEKISTAN',   coords: "41°17'N  69°17'E",           status: '██ CITY LOCK CONFIRMED'  },
]

/* ─── Smooth camera targets per stage ─── */
// Uzbekistan lat 41.3°N, lon 69.3°E sits at (sin 41.3° = 0.660, cos 41.3° = 0.751) after Earth rotation
const CAM = [
  { x: -252, y: 192,     z: 624   },  // 0  galaxy
  { x: -121, y: 48.7,     z: 118.5   },  // 1  solar system
  { x: 0, y: 0,     z: 12    },  // 2  earth
  { x: 0, y: 3.93,  z: 4.53  },  // 3  central asia   (d=6,  lat 41°N)
  { x: 0, y: 2.10,  z: 2.42  },  // 4  uzbekistan     (d=3.2, lat 41°N)
  { x: 0, y: 1.12,  z: 1.28  },  // 5  tashkent       (d=1.7, lat 41°N)
]

// Earth Y-rotation values that bring each target to face the +Z camera
// lon 63°E (Uzbekistan centre): phi_target = π/2, phi_natural = (63+180)/360*2π = 4.24 → R = 1.571-4.24 = -2.669
// lon 69.3°E (Tashkent):       phi_target = π/2, phi_natural = (69.3+180)/360*2π = 4.348 → R = 1.571-4.348 = -2.777
const ROT_UZBEK    = -2.669
const ROT_TASHKENT = -2.777

export default function ZoomSequence() {
  const outerRef  = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stage, setStage]         = useState(0)
  const [dragged, setDragged]     = useState(false)
  const [hei, setHei]     = useState(0)
  const stageRef    = useRef(0)

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000003)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 60000)
    camera.position.z = 700

    /* ── Lighting ── */
    scene.add(new THREE.AmbientLight(0xEAECF1, 0.9)) //Change for visisbility of planets
    const sunPL = new THREE.PointLight(0xfffaee, 5, 800)
    sunPL.position.set(0, 0, 50)
    scene.add(sunPL)

    /* ── Distant background stars (always visible) ── */
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

    /* ── Galaxy particle cloud ── */
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
        pos[i*3]   = r * Math.cos(armAngle) + (Math.random() - 0.5) * spread
        pos[i*3+1] = (Math.random() - 0.5) * 16
        pos[i*3+2] = r * Math.sin(armAngle) + (Math.random() - 0.5) * spread
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

    /* ── Solar system (centred at z=50) ── */
    const solarGroup = new THREE.Group()
    solarGroup.position.z = 50
    scene.add(solarGroup)
    solarGroup.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffee44 })))
    solarGroup.add(new THREE.Mesh(new THREE.SphereGeometry(15, 32, 32), new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.09,  side: THREE.BackSide })))
    solarGroup.add(new THREE.Mesh(new THREE.SphereGeometry(22, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.009, side: THREE.BackSide })))

    const PLANET_DATA = [
      { r: 0.40, color: 0x998877, orbit: 19, speed: 4.7, offset: 0.0 },  // Mercury
      { r: 0.90, color: 0xddaa44, orbit: 29, speed: 3.5, offset: 1.2 },  // Venus
      { r: 1.10, color: 0x2255bb, orbit: 40, speed: 3.0, offset: 2.5 },  // Earth
      { r: 0.65, color: 0xcc4422, orbit: 57, speed: 2.4, offset: 4.1 },  // Mars
    ]
    const planetMeshes = PLANET_DATA.map(p => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(p.r, 24, 24),
        new THREE.MeshPhongMaterial({ color: p.color, shininess: 35 })
      )
      solarGroup.add(mesh)
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

    /* ── Hero Earth ── */
    const earthGroup = new THREE.Group()
    scene.add(earthGroup)

    // Equirectangular land/ocean texture (2048×1024)
    const ecv = document.createElement('canvas')
    ecv.width = 2048; ecv.height = 1024
    const ec = ecv.getContext('2d')!
    const fill = (style: string, fn: () => void) => { ec.fillStyle = style; ec.beginPath(); fn(); ec.fill() }
    ec.fillStyle = '#0c2c58'; ec.fillRect(0, 0, 2048, 1024)
    fill('rgba(5,35,80,0.5)',   () => ec.ellipse(1024, 600,  900, 320, 0,     0, Math.PI*2))
    fill('rgba(8,50,110,0.3)',  () => ec.ellipse(500,  420,  450, 190, 0.4,   0, Math.PI*2))
    fill('#1a4920',             () => ec.ellipse(1400, 250,  520, 210, -0.15, 0, Math.PI*2))
    fill('#1a4920',             () => ec.ellipse(1360, 165,  500,  90, -0.08, 0, Math.PI*2))
    fill('#1a4920',             () => ec.ellipse(1450, 340,  150, 115,  0.3,  0, Math.PI*2))
    fill('#1a4920',             () => ec.ellipse(1600, 330,  105,  82,  0,    0, Math.PI*2))
    fill('#1a4920',             () => ec.ellipse(1090, 205,  130,  85,  0.3,  0, Math.PI*2))
    fill('#22612a',             () => ec.ellipse(1382, 278,  140,  72,  0,    0, Math.PI*2)) // Central Asia
    fill('#1a4920',             () => ec.ellipse(1200, 490,  165, 255,  0,    0, Math.PI*2))
    fill('#1a4920',             () => ec.ellipse(1175, 415,  110,  85,  0,    0, Math.PI*2))
    fill('#1a4920',             () => ec.ellipse(335,  225,  275, 185, -0.2,  0, Math.PI*2))
    fill('#1a4920',             () => ec.ellipse(275,  340,   78,  62,  0.1,  0, Math.PI*2))
    fill('#1a4920',             () => ec.ellipse(450,  585,  145, 235,  0.15, 0, Math.PI*2))
    fill('#1a4920',             () => ec.ellipse(1725, 605,  135,  92, -0.1,  0, Math.PI*2))
    ec.fillStyle = '#a8d0e2'; ec.beginPath(); ec.ellipse(525, 120, 62, 92, 0.2, 0, Math.PI*2); ec.fill()
    ec.fillStyle = '#c8dff0'; ec.fillRect(0, 925, 2048, 99)
    ec.fillStyle = '#b0cce4'; ec.fillRect(0, 0,   2048, 28)
    fill('rgba(25,90,190,0.12)', () => ec.ellipse(780, 510, 720, 205, -0.3, 0, Math.PI*2))
    const earthTex = new THREE.CanvasTexture(ecv)

    // Highlight texture: Central Asia turquoise → Uzbekistan gold → Tashkent white
    const hcv = document.createElement('canvas')
    hcv.width = 2048; hcv.height = 1024
    const hc = hcv.getContext('2d')!
    hc.clearRect(0, 0, 2048, 1024)
    // Uzbekistan UV: u=0.675 → x=1382, v=0.272 → y=279
    // Tashkent UV:   u=0.692 → x=1416, v=0.271 → y=277
    const g1 = hc.createRadialGradient(1382, 265, 0, 1382, 265, 220)
    g1.addColorStop(0,   'rgba(0,210,255,0.65)'); g1.addColorStop(0.5, 'rgba(0,120,220,0.30)'); g1.addColorStop(1, 'rgba(0,60,160,0)')
    hc.fillStyle = g1; hc.beginPath(); hc.ellipse(1382, 265, 220, 145, 0, 0, Math.PI*2); hc.fill()
    const g2 = hc.createRadialGradient(1382, 278, 0, 1382, 278, 85)
    g2.addColorStop(0, 'rgba(255,220,0,1)'); g2.addColorStop(0.35, 'rgba(255,170,0,0.6)'); g2.addColorStop(0.7, 'rgba(255,90,0,0.2)'); g2.addColorStop(1, 'rgba(255,0,0,0)')
    hc.fillStyle = g2; hc.beginPath(); hc.ellipse(1382, 278, 85, 54, 0, 0, Math.PI*2); hc.fill()
    const g3 = hc.createRadialGradient(1416, 277, 0, 1416, 277, 28)
    g3.addColorStop(0, 'rgba(255,255,255,1)'); g3.addColorStop(0.3, 'rgba(255,230,100,0.8)'); g3.addColorStop(1, 'rgba(255,180,0,0)')
    hc.fillStyle = g3; hc.beginPath(); hc.arc(1416, 277, 28, 0, Math.PI*2); hc.fill()
    const hlTex = new THREE.CanvasTexture(hcv)

    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 128, 64),
      new THREE.MeshPhongMaterial({ map: earthTex, specular: new THREE.Color(0x1a3a60), shininess: 22 })
    )
    earthGroup.add(earthMesh)
    earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.09, 32, 32), new THREE.MeshBasicMaterial({ color: 0x3a88ff, transparent: true, opacity: 0.075, side: THREE.BackSide })))
    const hlMat  = new THREE.MeshBasicMaterial({ map: hlTex, transparent: true, opacity: 0, depthWrite: false })
    const hlMesh = new THREE.Mesh(new THREE.SphereGeometry(1.003, 128, 64), hlMat)
    earthGroup.add(hlMesh)

    // Tashkent city marker (child of earthMesh → rotates with Earth)
    // Local position (before Earth.rotation.y): derived from lon 69.3°E, lat 41.3°N
    // phi=4.348, theta=0.851 → x=0.269, y=0.660, z=-0.702 (normalised)
    const tashkentLocal = new THREE.Vector3(0.269, 0.660, -0.702).normalize().multiplyScalar(1.016)
    const tashkentDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.012, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    tashkentDot.position.copy(tashkentLocal)
    tashkentDot.visible = false
    earthMesh.add(tashkentDot)

    const tashkentRingMat = new THREE.MeshBasicMaterial({ color: 0xffd60a, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
    const tashkentRing = new THREE.Mesh(new THREE.RingGeometry(0.022, 0.038, 32), tashkentRingMat)
    tashkentRing.position.copy(tashkentLocal)
    tashkentRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tashkentLocal.clone().normalize())
    tashkentRing.visible = false
    earthMesh.add(tashkentRing)

    /* ── Interaction state ── */
    let isDragging   = false
    let lastMouseX   = 0, lastMouseY = 0
    let dragPhi      = 0   // horizontal orbit offset (radians)
    let dragTheta    = 0   // vertical orbit offset (radians)

    canvas.style.cursor = 'grab'

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      lastMouseX = e.clientX; lastMouseY = e.clientY
      canvas.style.cursor = 'grabbing'
      setDragged(true)
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      dragPhi   += (e.clientX - lastMouseX) * 0.004
      dragTheta += (e.clientY - lastMouseY) * 0.004
      dragTheta  = Math.max(-Math.PI / 2.8, Math.min(Math.PI / 2.8, dragTheta))
      lastMouseX = e.clientX; lastMouseY = e.clientY
    }
    const onMouseUp   = () => { isDragging = false; canvas.style.cursor = 'grab' }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)

    /* ── Scroll → stage ── */
    function handleScroll() {
      if (!outerRef.current) return
      const p0 = -outerRef.current.getBoundingClientRect().top / (outerRef.current.offsetHeight - window.innerHeight)
      const p = Math.max(0, Math.min(1, p0))
      const s = Math.min(5, Math.floor(p * 6))
      if (s !== stageRef.current) { stageRef.current = s; setStage(s); dragPhi = dragTheta = 0; }
      if (p0 > 1.5 && p0 < 2) setHei(p0);
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    /* ── Animation state ── */
    let camX = 0, camY = 0, camZ = 700
    let earthRotY = 0, hlOpacity = 0, time = 0
    let rafId: number

    function animate() {
      rafId = requestAnimationFrame(animate)
      time += 0.007

      const s = stageRef.current
      const tgt = CAM[s]

      // Base camera (scroll-driven)
      camX += (tgt.x - camX) * 0.04
      camY += (tgt.y - camY) * 0.04
      camZ += (tgt.z - camZ) * 0.04

      // Apply drag orbit on top of base position
      const baseR     = Math.sqrt(camX ** 2 + camY ** 2 + camZ ** 2)
      const basePhi   = Math.atan2(camX, camZ)
      const baseTheta = Math.atan2(camY, Math.sqrt(camX ** 2 + camZ ** 2))
      const phi       = basePhi   + dragPhi
      const theta     = Math.max(-Math.PI / 2.6, Math.min(Math.PI / 2.6, baseTheta + dragTheta))
      camera.position.x = baseR * Math.cos(theta) * Math.sin(phi)
      camera.position.y = baseR * Math.sin(theta)
      camera.position.z = baseR * Math.cos(theta) * Math.cos(phi)
      camera.lookAt(0, 0, 50)
      if (s >= 2) camera.lookAt(0, 0, 0)

      // Galaxy: slow rotation + quadratic fade as camZ drops below 500
      galaxyGroup.rotation.y += 0.0003
      const gT = Math.max(0, Math.min(1, (camZ - 80) / 480))
      galaxyMat.opacity = gT * gT  // quadratic for a more dramatic collapse

      // Solar system visibility
      solarGroup.visible = camZ > 28 && camZ <300
      PLANET_DATA.forEach((p, i) => {
        const a = time * p.speed * 0.14 + p.offset
        planetMeshes[i].position.x = Math.cos(a) * p.orbit
        planetMeshes[i].position.z = Math.sin(a) * p.orbit
      })

      // Earth orientation
      const rotTarget = s >= 5 ? ROT_TASHKENT : ROT_UZBEK
      if (s < 3) {
        earthRotY += 0.0022
      } else {
        earthRotY += (rotTarget - earthRotY) * 0.028
      }
      earthMesh.rotation.y = earthRotY
      hlMesh.rotation.y    = earthRotY

      // Highlight layer opacity
      const hlTarget = s === 3 ? 0.7 : s >= 4 ? 1.0 : 0
      hlOpacity += (hlTarget - hlOpacity) * 0.045
      hlMat.opacity = hlOpacity

      // Tashkent city marker
      tashkentDot.visible  = s >= 4
      tashkentRing.visible = s >= 5
      if (s >= 5) {
        const pulse = (Math.sin(time * 4) + 1) * 0.5   // 0 → 1
        tashkentRing.scale.setScalar(1 + pulse * 3.5)
        tashkentRingMat.opacity = 0.85 * (1 - pulse * 0.85)
      }

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const w = window.innerWidth, h = window.innerHeight
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll',     handleScroll)
      window.removeEventListener('resize',     handleResize)
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('mouseup',    onMouseUp)
      canvas.removeEventListener('mousedown',  onMouseDown)
      earthTex.dispose(); hlTex.dispose()
      renderer.dispose()
    }
  }, [])

  const s = STAGES[stage]

  return (
    /* 300vh → 50vh per stage */
    <div ref={outerRef} style={{ height: '250vh', display: (hei > 1.68) ? 'none': 'block'}}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />

        {/* ── HUD ── */}
        <div className="font-terminal" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>

          {/* Corner brackets */}
          {([
            { top: 16, left: 16,  borderTop: '1px solid rgba(0,255,65,0.35)', borderLeft:  '1px solid rgba(0,255,65,0.35)' },
            { top: 16, right: 16, borderTop: '1px solid rgba(0,255,65,0.35)', borderRight: '1px solid rgba(0,255,65,0.35)' },
            { bottom: 16, left: 16,  borderBottom: '1px solid rgba(0,255,65,0.35)', borderLeft:  '1px solid rgba(0,255,65,0.35)' },
            { bottom: 16, right: 16, borderBottom: '1px solid rgba(0,255,65,0.35)', borderRight: '1px solid rgba(0,255,65,0.35)' },
          ] as React.CSSProperties[]).map((st, i) => (
            <div key={i} style={{ position: 'absolute', width: 32, height: 32, ...st }} />
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
            <div style={{ fontSize: 30, fontWeight: 700, color: '#00ff41', letterSpacing: '0.06em', lineHeight: 1.1 }}>{s.alt}</div>
          </div>

          {/* Stage label, top-center */}
          <div style={{ position: 'absolute', top: 24, left: 0, right: 0, textAlign: 'center', fontSize: 11, letterSpacing: '0.55em', color: 'rgba(0,255,65,0.28)' }}>
            {s.label}
          </div>

          {/* Bottom: title + status */}
          <div style={{ position: 'absolute', bottom: 110, left: 0, right: 0, textAlign: 'center' }}>
            <div style={{
              fontSize: stage >= 4 ? 34 : 16,
              color: stage >= 4 ? '#ffd60a' : 'rgba(0,255,65,0.85)',
              letterSpacing: stage >= 4 ? '0.38em' : '0.28em',
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
          <div style={{ position: 'absolute', bottom: 62, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 7, alignItems: 'center' }}>
            {STAGES.map((_, i) => (
              <div key={i} style={{ width: i === stage ? 30 : 8, height: 3, background: i <= stage ? '#00ff41' : 'rgba(0,255,65,0.14)', transition: 'all 0.45s ease' }} />
            ))}
          </div>

          {/* Stage-0 hints */}
          {stage === 0 && (
            <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(0,255,65,0.28)', letterSpacing: '0.35em', animation: 'blink 2.4s ease-in-out infinite' }}>
                SCROLL TO INITIATE DESCENT
              </div>
              {!dragged && (
                <div style={{ fontSize: 10, color: 'rgba(0,255,65,0.18)', letterSpacing: '0.3em' }}>
                  DRAG TO ORBIT
                </div>
              )}
            </div>
          )}

          <div className="scan-line" />
        </div>
      </div>
    </div>
  )
}
