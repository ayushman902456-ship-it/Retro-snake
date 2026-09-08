type Ambient = {
  oscillators: OscillatorNode[]
  lfo: OscillatorNode
  gain: GainNode
}

let context: AudioContext | null = null
let master: GainNode | null = null
let ambient: Ambient | null = null
let muted = false

function getContext() {
  if (typeof window === 'undefined') return null
  if (!context) {
    context = new AudioContext()
    master = context.createGain()
    master.gain.value = muted ? 0 : 1
    master.connect(context.destination)
  }
  if (context.state === 'suspended') void context.resume()
  return context
}

function tone(
  frequency: number,
  duration: number,
  options: { type?: OscillatorType; volume?: number; slideTo?: number; delay?: number } = {},
) {
  const ctx = getContext()
  if (!ctx || !master || muted) return
  const { type = 'sine', volume = 0.12, slideTo, delay = 0 } = options
  const startAt = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, startAt)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, startAt + duration)
  gain.gain.setValueAtTime(0, startAt)
  gain.gain.linearRampToValueAtTime(volume, startAt + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
  osc.connect(gain).connect(master)
  osc.start(startAt)
  osc.stop(startAt + duration + 0.05)
}

export const sounds = {
  eat() {
    tone(660, 0.12, { slideTo: 990, volume: 0.1 })
  },
  turn() {
    tone(420, 0.05, { type: 'triangle', volume: 0.03 })
  },
  start() {
    tone(523, 0.1, { volume: 0.08 })
    tone(659, 0.1, { volume: 0.08, delay: 0.09 })
    tone(784, 0.16, { volume: 0.08, delay: 0.18 })
  },
  pause() {
    tone(392, 0.12, { type: 'triangle', volume: 0.05 })
  },
  gameOver() {
    tone(392, 0.25, { type: 'triangle', slideTo: 196, volume: 0.1 })
    tone(262, 0.4, { type: 'triangle', slideTo: 131, volume: 0.08, delay: 0.2 })
  },
}

export function startAmbient() {
  const ctx = getContext()
  if (!ctx || !master || ambient) return
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 1.5)

  const oscillators = [110, 110.6, 165].map((frequency) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = frequency
    osc.connect(gain)
    osc.start()
    return osc
  })

  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.15
  lfoGain.gain.value = 0.012
  lfo.connect(lfoGain).connect(gain.gain)
  lfo.start()

  gain.connect(master)
  ambient = { oscillators, lfo, gain }
}

export function stopAmbient() {
  if (!ambient || !context) return
  const { oscillators, lfo, gain } = ambient
  const now = context.currentTime
  gain.gain.cancelScheduledValues(now)
  gain.gain.setValueAtTime(gain.gain.value, now)
  gain.gain.linearRampToValueAtTime(0, now + 0.4)
  for (const osc of oscillators) osc.stop(now + 0.5)
  lfo.stop(now + 0.5)
  ambient = null
}

export function setMuted(value: boolean) {
  muted = value
  if (!context || !master) return
  const now = context.currentTime
  master.gain.cancelScheduledValues(now)
  master.gain.setValueAtTime(master.gain.value, now)
  master.gain.linearRampToValueAtTime(value ? 0 : 1, now + 0.15)
}
