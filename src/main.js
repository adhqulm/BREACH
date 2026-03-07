import { Terminal } from './terminal.js'
import { playTypeClick } from './audio.js'
import musicUrl from './music.mp3'
import jumpscarePng from './jumpscare.png'
import jumpscareAudioUrl from './jumpscare.mp3'
import fallAudioUrl from './fall.mp3'

// Ambient background music — fade in over 4 seconds
const bgMusic = new Audio(musicUrl)
bgMusic.loop   = true
bgMusic.volume = 0
window.bgMusic = bgMusic   // exposed for vol command in terminal

function startMusic() {
  bgMusic.play().catch(() => {})  // silently ignore if blocked
  let vol = 0
  const fade = setInterval(() => {
    vol = Math.min(vol + 0.005, 0.18)
    bgMusic.volume = vol
    if (vol >= 0.18) clearInterval(fade)
  }, 100)
}

// ── JUMPSCARE ──
function triggerJumpscare(onDone) {
  const overlay = document.createElement('div')
  overlay.id = 'jumpscare-overlay'

  const img = document.createElement('img')
  img.src = jumpscarePng
  overlay.appendChild(img)
  document.body.appendChild(overlay)

  const snd = new Audio(jumpscareAudioUrl)
  snd.currentTime = 2
  snd.volume = 1.0
  snd.play().catch(() => {})

  // Hold for 2.5 seconds then cut hard to black (blocker is already underneath)
  setTimeout(() => {
    overlay.remove()
    snd.pause()
    onDone && onDone()
  }, 2500)
}

// ── DIALOGUE ──
const ENDING_SCRIPT = [
  'Pedro: Kimi?….',
  'Pedro: Kimi!!',
  'Pedro: Kimi, are you okay???',
  "Pedro: I'm so glad you're awake…",
  'Pedro: You slipped in the shower and hit your head really hard dude...',
  'Kimi: ...phantom protocol...',
  'Kimi: ...layer fifteen... K.Chen... I bypassed it...',
  'Pedro: What are you even talking about cuzzo',
  'Pedro: Dude you hit your head WAY too hard lmao',
  'Pedro: Happy birthday by the way!',
  "Pedro: Come on, let's go get a beer",
  {
    choice: [
      {
        label: "wait, lemme just wash my face real quick",
        lines: [
          'Pedro: Wait',
          'Pedro: Kimi!!',
          "Pedro: Don't go back in there!!",
          'Pedro: THE FLOOR IS STILL WET!!!',
        ],
        ending: 'good',
      },
      {
        label: 'ouch... my head...',
        lines: [
          "Pedro: Let's go, bar opens in like 10 minutes",
          'Kimi: *Sigh*… okay...',
          'Kimi (thoughts): "Tf was that???…"',
          'Kimi (thoughts): "Whatever…"',
        ],
        ending: 'bad',
      },
    ],
  },
]

function triggerDialogue(script, onDone) {
  const overlay = document.createElement('div')
  overlay.id = 'dialogue-overlay'
  overlay.style.pointerEvents = 'none'

  const box = document.createElement('div')
  box.id = 'dialogue-box'
  box.style.opacity = '0'
  box.style.transition = 'opacity 0.5s ease'

  const speakerEl = document.createElement('div')
  speakerEl.id = 'dialogue-speaker'

  const textEl = document.createElement('div')
  textEl.id = 'dialogue-text'

  const choicesEl = document.createElement('div')
  choicesEl.id = 'dialogue-choices'

  const advEl = document.createElement('div')
  advEl.id = 'dialogue-advance'
  advEl.textContent = '[ click or press any key ]'

  box.appendChild(speakerEl)
  box.appendChild(textEl)
  box.appendChild(choicesEl)
  box.appendChild(advEl)
  overlay.appendChild(box)
  document.body.appendChild(overlay)

  let lines = script
  let lineIdx = 0
  let typing = false
  let typeTimer = null
  let choiceActive = false
  let selectedEnding = null

  // Split "Speaker: text" into parts
  function parseLine(str) {
    const match = str.match(/^([^:]+):\s*(.+)$/)
    if (match) return { speaker: match[1].trim(), text: match[2].trim() }
    return { speaker: '', text: str }
  }

  function setSpeakerStyle(speaker) {
    speakerEl.textContent = speaker ? `— ${speaker}` : ''
    if (speaker === 'Kimi') {
      speakerEl.style.color = 'var(--cyan)'
    } else if (speaker.startsWith('Kimi')) {
      speakerEl.style.color = 'var(--yellow)'
      speakerEl.style.fontStyle = 'italic'
    } else {
      speakerEl.style.color = 'var(--dim-green)'
      speakerEl.style.fontStyle = 'normal'
    }
  }

  function typeLine(str, cb) {
    const { speaker, text } = parseLine(str)
    typing = true
    advEl.style.opacity = '0'
    setSpeakerStyle(speaker)
    textEl.textContent = ''
    // Speed and pitch vary by speaker
    let interval, freqMin, freqMax
    if (speaker === 'Kimi') {
      interval = 55; freqMin = 280; freqMax = 500   // slow, low — confused/groggy
    } else if (speaker.startsWith('Kimi')) {
      interval = 72; freqMin = 240; freqMax = 400   // internal thoughts — even slower, quieter
    } else {
      interval = 30; freqMin = 600; freqMax = 950   // Pedro — fast and sharp
    }
    let i = 0
    typeTimer = setInterval(() => {
      i++
      textEl.textContent = text.slice(0, i)
      if (i % 2 === 0) playTypeClick(freqMin, freqMax)
      if (i >= text.length) {
        clearInterval(typeTimer)
        typing = false
        cb()
      }
    }, interval)
  }

  function showBadEnding() {
    box.style.transition = 'opacity 0.4s ease'
    box.style.opacity = '0'
    setTimeout(() => {
      speakerEl.textContent = ''
      textEl.style.textAlign = 'center'
      textEl.style.color = 'var(--dim-green)'
      advEl.style.opacity = '0'
      box.style.opacity = '1'
      const msgs = ['You walked away.', "You didn't find out…", '', 'Restarting...']
      let i = 0
      const next = () => {
        if (i >= msgs.length) {
          setTimeout(() => {
            localStorage.removeItem('breach_level')
            localStorage.removeItem('breach_detection')
            localStorage.setItem('breach_bad_ending', '1')
            window.location.reload()
          }, 1200)
          return
        }
        textEl.textContent = msgs[i++]
        setTimeout(next, 900)
      }
      next()
    }, 500)
  }

  function finish() {
    cleanup()
    if (selectedEnding === 'bad') {
      showBadEnding()
      return
    }
    // Good ending — play fall.mp3 then show stats
    box.style.transition = 'opacity 0.3s ease'
    box.style.opacity = '0'
    const fallSnd = new Audio(fallAudioUrl)
    fallSnd.volume = 1.0
    fallSnd.play().catch(() => {})
    const done = () => {
      onDone && onDone()
      overlay.style.transition = 'opacity 0.7s ease'
      overlay.style.opacity = '0'
      setTimeout(() => overlay.remove(), 700)
    }
    fallSnd.addEventListener('ended', done)
    fallSnd.addEventListener('error', done)
  }

  function showChoice(choiceNode) {
    choiceActive = true
    advEl.style.opacity = '0'
    setSpeakerStyle('Kimi')
    textEl.textContent = ''
    choicesEl.style.display = 'flex'

    document.removeEventListener('keydown', onKey, true)
    overlay.removeEventListener('click', onOverlayClick)

    let keyHandler
    choiceNode.choice.forEach((opt, idx) => {
      const btn = document.createElement('button')
      btn.className = 'dialogue-choice-btn'
      btn.innerHTML = `<span class="choice-key">[ ${String.fromCharCode(65 + idx)} ]</span>  ${opt.label}`
      btn.addEventListener('click', () => {
        document.removeEventListener('keydown', keyHandler, true)
        selectChoice(opt)
      })
      choicesEl.appendChild(btn)
    })

    keyHandler = (e) => {
      const key = e.key.toLowerCase()
      const idx = (key === 'a' || key === '1') ? 0 : (key === 'b' || key === '2') ? 1 : -1
      if (idx >= 0 && idx < choiceNode.choice.length) {
        e.stopPropagation()
        e.preventDefault()
        document.removeEventListener('keydown', keyHandler, true)
        selectChoice(choiceNode.choice[idx])
      }
    }
    document.addEventListener('keydown', keyHandler, true)
  }

  function selectChoice(opt) {
    choiceActive = false
    choicesEl.style.display = 'none'
    choicesEl.innerHTML = ''
    selectedEnding = opt.ending
    // Prepend Kimi's spoken choice as first line of the continuation
    lines = [`Kimi: ${opt.label}`, ...opt.lines]
    lineIdx = 0
    overlay.addEventListener('click', onOverlayClick)
    document.addEventListener('keydown', onKey, true)
    showLine()
  }

  function showLine() {
    if (lineIdx >= lines.length) { finish(); return }
    const item = lines[lineIdx]
    if (item && typeof item === 'object' && item.choice) {
      lineIdx++
      showChoice(item)
      return
    }
    typeLine(item, () => { advEl.style.opacity = '1' })
  }

  function advance() {
    if (choiceActive) return
    if (typing) {
      clearInterval(typeTimer)
      typing = false
      textEl.textContent = parseLine(lines[lineIdx]).text
      advEl.style.opacity = '1'
      return
    }
    lineIdx++
    showLine()
  }

  function onKey(e) {
    if (['Enter', ' ', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
      e.stopPropagation()
      e.preventDefault()
      advance()
    }
  }

  function onOverlayClick() { advance() }

  function cleanup() {
    overlay.removeEventListener('click', onOverlayClick)
    document.removeEventListener('keydown', onKey, true)
  }

  setTimeout(() => {
    box.style.opacity = '1'
    overlay.style.pointerEvents = 'auto'
    overlay.addEventListener('click', onOverlayClick)
    document.addEventListener('keydown', onKey, true)
    showLine()
  }, 2000)
}

// ── END SEQUENCE (jumpscare → dialogue) ──
function triggerEndSequence(onDone) {
  // Fade out background music so jumpscare sound hits harder
  if (window.bgMusic) {
    const vol = { v: window.bgMusic.volume }
    const fadeOut = setInterval(() => {
      vol.v = Math.max(0, vol.v - 0.012)
      window.bgMusic.volume = vol.v
      if (vol.v <= 0) clearInterval(fadeOut)
    }, 40)
  }

  // Black underlay covers the game immediately — no flash when jumpscare ends
  const blocker = document.createElement('div')
  blocker.style.cssText = 'position:fixed;inset:0;z-index:99997;background:#000'
  document.body.appendChild(blocker)

  triggerJumpscare(() => {
    blocker.remove()
    triggerDialogue(ENDING_SCRIPT, onDone)
  })
}

window.triggerEndSequence = triggerEndSequence

// ── MATRIX RAIN ──
function initMatrixRain() {
  const canvas = document.getElementById('matrix-rain')
  const ctx = canvas.getContext('2d')

  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロ0123456789ABCDEF<>{}[]|/\\01'
  const FONT_SIZE = 13
  let cols, drops, speeds

  function resize() {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    cols  = Math.floor(canvas.width / FONT_SIZE)
    drops = Array.from({ length: cols }, () => Math.random() * -50)
    speeds = Array.from({ length: cols }, () => 0.3 + Math.random() * 0.7)
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  resize()
  window.addEventListener('resize', resize)

  function draw() {
    // Slow fade trail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < cols; i++) {
      const y = drops[i] * FONT_SIZE
      const char = CHARS[Math.floor(Math.random() * CHARS.length)]

      // Bright head
      ctx.fillStyle = 'rgba(180, 255, 200, 0.9)'
      ctx.font = `bold ${FONT_SIZE}px monospace`
      ctx.fillText(char, i * FONT_SIZE, y)

      // Dim body (one step behind)
      ctx.fillStyle = 'rgba(0, 200, 60, 0.35)'
      ctx.font = `${FONT_SIZE}px monospace`
      ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * FONT_SIZE, y - FONT_SIZE)

      drops[i] += speeds[i]
      if (y > canvas.height && Math.random() > 0.98) {
        drops[i] = -5
      }
    }
  }

  setInterval(draw, 40)
}

// ── LIVE CLOCK ──
function initClock() {
  const el = document.getElementById('status-time')
  function tick() {
    const now = new Date()
    const h = String(now.getHours()).padStart(2, '0')
    const m = String(now.getMinutes()).padStart(2, '0')
    const s = String(now.getSeconds()).padStart(2, '0')
    el.textContent = `${h}:${m}:${s}`
  }
  tick()
  setInterval(tick, 1000)
}

// ── SCREEN FLICKER ──
function initFlicker() {
  const frame = document.getElementById('terminal-frame')
  function maybeFlicker() {
    if (Math.random() < 0.3) {
      frame.classList.add('flicker')
      setTimeout(() => frame.classList.remove('flicker'), 150)
    }
    setTimeout(maybeFlicker, 4000 + Math.random() * 10000)
  }
  setTimeout(maybeFlicker, 3000)
}

// Boot on first user interaction (required for Web Audio API)
let booted = false

function startGame() {
  if (booted) return
  booted = true
  waiting.remove()
  startMusic()
  const terminal = new Terminal()
  terminal.boot()
}

// If the user clicks or presses a key, start
document.addEventListener('click', startGame, { once: true })
document.addEventListener('keydown', startGame, { once: true })

// Show a "press any key" prompt until interaction
const output = document.getElementById('output')
const waiting = document.createElement('div')
waiting.style.marginTop = '38vh'
waiting.style.textAlign = 'center'

const waitLine1 = document.createElement('div')
waitLine1.className = 'line dim'
waitLine1.textContent = '[ PRESS ANY KEY TO INITIATE BREACH PROTOCOL ]'

const waitLine2 = document.createElement('div')
waitLine2.className = 'line dim'
waitLine2.style.marginTop = '10px'
waitLine2.style.fontSize = '11px'
waitLine2.style.opacity = '0.55'
waitLine2.textContent = '[ FOR BEST EXPERIENCE: PRESS F11 TO ENTER FULLSCREEN FIRST ]'

waiting.appendChild(waitLine1)
waiting.appendChild(waitLine2)
output.appendChild(waiting)

// Blink the main waiting line
setInterval(() => {
  waitLine1.style.opacity = waitLine1.style.opacity === '0' ? '1' : '0'
}, 700)

// Init visual effects immediately (no user interaction required)
initMatrixRain()
initClock()
initFlicker()
