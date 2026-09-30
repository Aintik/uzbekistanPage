import { useCallback, useEffect, useState } from 'react'

export type SoundName =
  | 'tick' | 'blip' | 'alert' | 'impact' | 'sweep'
  | 'ready' | 'hover' | 'confirm' | 'dismiss' | 'move'
  | 'grab' | 'release' | 'stage' | 'back' | 'radar' | 'lock' | 'city' | 'ping'

/* ───────── shared engine (module-level, survives page changes) ───────── */
let ctx: AudioContext | null = null
let master: GainNode | null = null
let noiseBuf: AudioBuffer | null = null
let motionNodes: { bp: BiquadFilterNode; g: GainNode } | null = null
let muted = false
let lastMove = 0
let scene = 0

type Ambience = {
  lp: BiquadFilterNode
  oscs: OscillatorNode[]
  air: GainNode
  stop: () => void
}
let amb: Ambience | null = null

const BASE_FREQS = [55, 55.4, 82.5]
// The ambience "opens up" as you descend: brighter filter, higher pitch, more air
const SCENES = [
  { lp: 140, pitch: 1.0,  air: 0.02  },  // galaxy
  { lp: 200, pitch: 1.05, air: 0.02  },  // solar system
  { lp: 320, pitch: 1.1,  air: 0.05  },  // earth (atmosphere)
  { lp: 420, pitch: 1.15, air: 0.05  },  // central asia
  { lp: 600, pitch: 1.2,  air: 0.035 },  // uzbekistan
  { lp: 800, pitch: 1.26, air: 0.03  },  // tashkent
]

function ensure() {
  if (ctx) return
  const c = new (window.AudioContext || (window as any).webkitAudioContext)()
  ctx = c
  master = c.createGain()
  master.gain.value = 0.7
  master.connect(c.destination)

  noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate)
  const d = noiseBuf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1

  // Always-running "motion" layer: filtered noise whose level follows scroll/drag speed
  const src = c.createBufferSource()
  src.buffer = noiseBuf; src.loop = true
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'; bp.frequency.value = 400; bp.Q.value = 0.7
  const g = c.createGain(); g.gain.value = 0
  src.connect(bp).connect(g).connect(master)
  src.start()
  motionNodes = { bp, g }
}

function tone(
  freq: number, dur: number,
  o: { type?: OscillatorType; vol?: number; to?: number; at?: number } = {}
) {
  const c = ctx!, t = c.currentTime + (o.at ?? 0)
  const osc = c.createOscillator(), g = c.createGain()
  osc.type = o.type ?? 'sine'
  osc.frequency.setValueAtTime(freq, t)
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(o.vol ?? 0.1, t + 0.005)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(master!)
  osc.start(t); osc.stop(t + dur + 0.02)
}

function noise(
  dur: number,
  o: { vol?: number; type?: BiquadFilterType; f0?: number; f1?: number; at?: number } = {}
) {
  const c = ctx!, t = c.currentTime + (o.at ?? 0)
  const src = c.createBufferSource()
  src.buffer = noiseBuf
  const filter = c.createBiquadFilter()
  filter.type = o.type ?? 'bandpass'
  filter.frequency.setValueAtTime(o.f0 ?? 2000, t)
  if (o.f1) filter.frequency.exponentialRampToValueAtTime(o.f1, t + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(o.vol ?? 0.1, t + Math.min(0.01, dur / 2))
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(filter).connect(g).connect(master!)
  src.start(t); src.stop(t + dur + 0.02)
}

function applyScene() {
  if (!ctx || !amb) return
  const t = ctx.currentTime, s = SCENES[scene]
  amb.lp.frequency.setTargetAtTime(s.lp, t, 1.2)
  amb.oscs.forEach((o, i) => o.frequency.setTargetAtTime(BASE_FREQS[i] * s.pitch, t, 1.5))
  amb.air.gain.setTargetAtTime(s.air, t, 1.5)
}

function startAmbience() {
  const c = ctx!
  const out = c.createGain()
  out.gain.value = 0.0001
  out.gain.exponentialRampToValueAtTime(0.06, c.currentTime + 3)
  out.connect(master!)

  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'; lp.frequency.value = SCENES[scene].lp; lp.Q.value = 4
  const lfo = c.createOscillator(), lfoGain = c.createGain()
  lfo.frequency.value = 0.12; lfoGain.gain.value = 90
  lfo.connect(lfoGain).connect(lp.frequency)

  const oscs = BASE_FREQS.map(f => {
    const o = c.createOscillator()
    o.type = 'sawtooth'; o.frequency.value = f
    o.connect(lp); return o
  })
  lp.connect(out)

  const hiss = c.createBufferSource()
  hiss.buffer = noiseBuf; hiss.loop = true
  const hp = c.createBiquadFilter()
  hp.type = 'highpass'; hp.frequency.value = 6000
  const air = c.createGain(); air.gain.value = SCENES[scene].air
  hiss.connect(hp).connect(air).connect(out)

  lfo.start(); oscs.forEach(o => o.start()); hiss.start()

  amb = {
    lp, oscs, air,
    stop: () => {
      const t = c.currentTime
      out.gain.cancelScheduledValues(t)
      out.gain.setValueAtTime(out.gain.value, t)
      out.gain.exponentialRampToValueAtTime(0.0001, t + 0.8)
      setTimeout(() => { [lfo, ...oscs, hiss].forEach(n => { try { n.stop() } catch {} }) }, 900)
      amb = null
    },
  }
  applyScene()
}

async function start(chirp: boolean) {
  ensure()
  muted = false
  try { await ctx!.resume() } catch {}
  if (ctx!.state !== 'running') return false   // blocked by the browser
  if (!amb) startAmbience()
  if (chirp) {
    tone(660, 0.09, { type: 'square', vol: 0.05 })
    tone(990, 0.12, { type: 'square', vol: 0.05, at: 0.08 })
  }
  return true
}

function setMotionLevel(level: number) {
  if (!ctx || !motionNodes || ctx.state !== 'running') return
  const t = ctx.currentTime
  motionNodes.g.gain.setTargetAtTime(level * 0.09, t, 0.06)
  motionNodes.bp.frequency.setTargetAtTime(300 + level * 2200, t, 0.06)
}

function playSound(name: SoundName) {
  if (muted || ctx?.state !== 'running') return
  switch (name) {
    /* ── terminal page ── */
    case 'tick':
      noise(0.02, { vol: 0.12, f0: 3500 })
      tone(1800, 0.02, { type: 'square', vol: 0.02 })
      break
    case 'blip':
      tone(1100, 0.04, { type: 'square', vol: 0.04, to: 900 })
      break
    case 'alert':
      tone(880, 0.1, { type: 'square', vol: 0.06 })
      tone(1320, 0.14, { type: 'square', vol: 0.06, at: 0.12 })
      break
    case 'impact':
      tone(110, 0.9, { vol: 0.5, to: 35 })
      noise(0.6, { vol: 0.25, type: 'lowpass', f0: 1800, f1: 80 })
      break
    case 'sweep':
      tone(300, 0.15, { vol: 0.03, to: 1200 })
      break
    case 'ready':
      tone(520, 0.12, { type: 'triangle', vol: 0.12 })
      tone(780, 0.2, { type: 'triangle', vol: 0.12, at: 0.1 })
      break
    case 'hover':
      tone(1500, 0.03, { vol: 0.05 })
      break
    case 'confirm':
      tone(440, 0.14, { type: 'square', vol: 0.08, to: 880 })
      break
    case 'dismiss':
      noise(0.9, { vol: 0.3, type: 'bandpass', f0: 200, f1: 5000 })
      tone(80, 0.9, { vol: 0.2, to: 400 })
      break
    case 'move': {
      const now = performance.now()
      if (now - lastMove < 70) return
      lastMove = now
      tone(2400 + Math.random() * 300, 0.012, { vol: 0.012 })
      break
    }

    /* ── zoom page ── */
    case 'grab':
      tone(500, 0.05, { type: 'square', vol: 0.03, to: 350 })
      break
    case 'release':
      tone(350, 0.06, { type: 'square', vol: 0.03, to: 520 })
      break
    case 'stage':   // descending whoosh + sub thump
      noise(1.0, { vol: 0.16, type: 'bandpass', f0: 3200, f1: 250 })
      tone(70, 0.6, { vol: 0.25, to: 38 })
      tone(1000, 0.05, { type: 'square', vol: 0.04, at: 0.05 })
      break
    case 'back':    // rising whoosh (scrolling back up)
      noise(0.8, { vol: 0.12, type: 'bandpass', f0: 250, f1: 3200 })
      tone(45, 0.5, { vol: 0.15, to: 90 })
      break
    case 'radar':   // region scan ping with an echo
      tone(1400, 0.7, { vol: 0.06, to: 1300 })
      tone(1400, 0.7, { vol: 0.03, to: 1300, at: 0.2 })
      break
    case 'lock':    // three rising beeps, then a confirmed-lock chord
      tone(900, 0.07, { type: 'square', vol: 0.05 })
      tone(1100, 0.07, { type: 'square', vol: 0.05, at: 0.12 })
      tone(1320, 0.07, { type: 'square', vol: 0.05, at: 0.24 })
      tone(1320, 0.7, { type: 'triangle', vol: 0.1, at: 0.4 })
      tone(1980, 0.7, { type: 'triangle', vol: 0.06, at: 0.4 })
      tone(90, 0.7, { vol: 0.3, to: 40, at: 0.4 })
      break
    case 'city':    // brighter lock with a sparkle arpeggio
      tone(660, 0.1, { type: 'triangle', vol: 0.09 })
      tone(880, 0.1, { type: 'triangle', vol: 0.09, at: 0.08 })
      tone(1320, 0.1, { type: 'triangle', vol: 0.09, at: 0.16 })
      tone(1760, 0.6, { type: 'triangle', vol: 0.09, at: 0.24 })
      tone(100, 0.8, { vol: 0.3, to: 40, at: 0.24 })
      noise(0.5, { vol: 0.05, type: 'highpass', f0: 6000, at: 0.24 })
      break
    case 'ping':    // sonar pulse, synced to the Tashkent ring
      tone(1760, 0.5, { vol: 0.035, to: 1700 })
      break
  }
}

/* ───────── hook ───────── */
const isRunning = () => !!ctx && ctx.state === 'running' && !muted

export function useTerminalAudio(opts: { auto?: boolean; chirp?: boolean } = {}) {
  const { auto = false, chirp = true } = opts
  const [enabled, setEnabled] = useState(isRunning)

  /** Must be called from a user gesture unless the page was already unlocked */
  const enable = useCallback(async (withChirp = true) => {
    const ok = await start(withChirp)
    if (ok) setEnabled(true)
    return ok
  }, [])

  const disable = useCallback(() => {
    muted = true
    amb?.stop()
    setMotionLevel(0)
    setTimeout(() => { if (muted) ctx?.suspend() }, 900)
    setEnabled(false)
  }, [])

  const fadeOut = useCallback(() => { amb?.stop(); setMotionLevel(0) }, [])

  const setScene = useCallback((n: number) => {
    scene = Math.max(0, Math.min(SCENES.length - 1, n))
    applyScene()
  }, [])

  const play = useCallback((name: SoundName) => playSound(name), [])
  const setMotion = useCallback((level: number) => setMotionLevel(level), [])

  // Auto-start on mount; if the browser blocks it, retry on the first interaction
  useEffect(() => {
    if (!auto || muted) return
    let cancelled = false
    let cleanup = () => {}
    enable(chirp).then(ok => {
      if (ok || cancelled) return
      const retry = async () => { if (await enable(chirp)) cleanup() }
      const events = ['pointerdown', 'keydown', 'touchstart'] as const
      events.forEach(ev => window.addEventListener(ev, retry))
      cleanup = () => events.forEach(ev => window.removeEventListener(ev, retry))
    })
    return () => { cancelled = true; cleanup() }
  }, [auto, chirp, enable])

  return { enabled, enable, disable, play, fadeOut, setScene, setMotion }
}