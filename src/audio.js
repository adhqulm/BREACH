let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function playTone(freq, duration, type = 'sine', gain = 0.15, when = 0) {
  const ac = getCtx()
  const t = when ? when : ac.currentTime
  const osc = ac.createOscillator()
  const amp = ac.createGain()
  osc.connect(amp)
  amp.connect(ac.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  amp.gain.setValueAtTime(gain, t)
  amp.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.start(t)
  osc.stop(t + duration)
}

function playNoise(duration, gain = 0.04) {
  const ac = getCtx()
  const bufferSize = ac.sampleRate * duration
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * gain
  }
  const source = ac.createBufferSource()
  source.buffer = buffer
  const filter = ac.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 3000
  filter.Q.value = 0.5
  source.connect(filter)
  filter.connect(ac.destination)
  source.start()
}

export function playKeyClick() {
  if (window.gameMuted) return
  try {
    playNoise(0.018, 0.06)
  } catch (_) {}
}

export function playTypeClick(freqMin = 480, freqMax = 800) {
  if (window.gameMuted) return
  try {
    const ac = getCtx()
    const osc = ac.createOscillator()
    const amp = ac.createGain()
    osc.connect(amp)
    amp.connect(ac.destination)
    osc.type = 'square'
    osc.frequency.setValueAtTime(freqMin + Math.random() * (freqMax - freqMin), ac.currentTime)
    amp.gain.setValueAtTime(0.018, ac.currentTime)
    amp.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.02)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + 0.02)
  } catch (_) {}
}

export function playMorse(morseStr) {
  if (window.gameMuted) return
  try {
    const ac = getCtx()
    const DOT = 0.10, DASH = 0.30, SYM_GAP = 0.08, CHAR_GAP = 0.28
    let t = ac.currentTime + 0.6
    morseStr.trim().split(' ').forEach((char, ci, arr) => {
      for (let i = 0; i < char.length; i++) {
        const dur = char[i] === '-' ? DASH : DOT
        playTone(680, dur, 'sine', 0.05, t)
        t += dur
        if (i < char.length - 1) t += SYM_GAP
      }
      if (ci < arr.length - 1) t += CHAR_GAP
    })
  } catch (_) {}
}

export function playCrashSound() {
  if (window.gameMuted) return
  try {
    const ac = getCtx()
    const now = ac.currentTime
    playNoise(1.4, 0.20)
    playTone(65,  0.6, 'sawtooth', 0.15, now)
    playTone(48,  0.9, 'square',   0.12, now + 0.15)
    playTone(32,  1.2, 'sine',     0.08, now + 0.4)
  } catch (_) {}
}

export function playError() {
  if (window.gameMuted) return
  try {
    const ac = getCtx()
    playTone(180, 0.12, 'square', 0.12)
    playTone(120, 0.18, 'square', 0.10, ac.currentTime + 0.10)
  } catch (_) {}
}

export function playSuccess() {
  if (window.gameMuted) return
  try {
    const ac = getCtx()
    const now = ac.currentTime
    playTone(440, 0.12, 'sine', 0.12, now)
    playTone(554, 0.12, 'sine', 0.12, now + 0.10)
    playTone(659, 0.20, 'sine', 0.14, now + 0.20)
    playTone(880, 0.30, 'sine', 0.12, now + 0.34)
  } catch (_) {}
}

export function playBeep(freq = 800, dur = 0.06) {
  if (window.gameMuted) return
  try {
    playTone(freq, dur, 'sine', 0.08)
  } catch (_) {}
}

export function playAlarm(bursts = 3) {
  if (window.gameMuted) return
  try {
    const ac = getCtx()
    const now = ac.currentTime
    const BURST = 0.18, GAP = 0.10
    for (let i = 0; i < bursts; i++) {
      const t = now + i * (BURST * 2 + GAP)
      playTone(880, BURST, 'sawtooth', 0.09, t)
      playTone(660, BURST, 'sawtooth', 0.07, t + BURST)
    }
  } catch (_) {}
}

export function playFinalSuccess() {
  if (window.gameMuted) return
  try {
    const ac = getCtx()
    const now = ac.currentTime
    const seq = [
      [440, 0], [494, 0.1], [523, 0.2], [587, 0.3],
      [659, 0.4], [698, 0.5], [784, 0.6], [880, 0.75],
    ]
    seq.forEach(([freq, delay]) => {
      playTone(freq, 0.25, 'sine', 0.13, now + delay)
    })
    playTone(1760, 0.6, 'sine', 0.10, now + 1.1)
  } catch (_) {}
}
