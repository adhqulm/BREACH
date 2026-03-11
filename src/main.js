import { Terminal } from './terminal.js'
import { playTypeClick } from './audio.js'
import musicUrl from './mp3/music.mp3'
import jumpscarePng from './jumpscare.png'
import jumpscareAudioUrl from './mp3/jumpscare.mp3'
import fallAudioUrl from './mp3/fall.mp3'
import abletonUrl from './mp3/ableton.mp3'
import dialogueUrl from './mp3/dialogue.mp3'
import sunExplosionUrl from './mp3/sunexplotion.mp3'

// Dialogue music — plays through the Pedro scene and credits
const dialogueMusic = new Audio(dialogueUrl)
dialogueMusic.loop  = true
dialogueMusic.volume = 0

function fadeInDialogue() {
  dialogueMusic.play().catch(() => {})
  let v = 0
  const t = setInterval(() => {
    v = Math.min(v + 0.01, 0.55)
    dialogueMusic.volume = v
    if (v >= 0.55) clearInterval(t)
  }, 60)
}

function fadeOutDialogue(duration, onDone) {
  const step = dialogueMusic.volume / (duration / 60)
  const t = setInterval(() => {
    dialogueMusic.volume = Math.max(0, dialogueMusic.volume - step)
    if (dialogueMusic.volume <= 0) {
      clearInterval(t)
      dialogueMusic.pause()
      dialogueMusic.currentTime = 0
      onDone && onDone()
    }
  }, 60)
}

function stopDialogueAbrupt() {
  dialogueMusic.pause()
  dialogueMusic.currentTime = 0
}

// Ambient background music — fade in over 4 seconds
const bgMusic = new Audio(musicUrl)
bgMusic.loop   = true
bgMusic.volume = 0
window.bgMusic = bgMusic   // exposed for vol command in terminal

// Ableton easter egg track — starts at 18s
window._abletonTrack = null
window.gameMuted = false
window.playAbletonTrack = () => {
  if (window._abletonTrack) { window._abletonTrack.pause(); window._abletonTrack = null }
  window._abletonTrack = new Audio(abletonUrl)
  window._abletonTrack.currentTime = 18
  window._abletonTrack.volume = window.gameMuted ? 0 : 0.85
  window._abletonTrack.play().catch(() => {})
}
window.stopAbletonTrack = () => {
  if (window._abletonTrack) { window._abletonTrack.pause(); window._abletonTrack = null }
}

function startMusic() {
  bgMusic.play().catch(() => {})  // silently ignore if blocked
  let vol = 0
  const fade = setInterval(() => {
    vol = Math.min(vol + 0.005, 0.18)
    bgMusic.volume = vol
    if (vol >= 0.18) clearInterval(fade)
  }, 100)
}

// Preload jumpscare audio so it fires in sync with the image
const _jumpscareSnd = new Audio(jumpscareAudioUrl)
_jumpscareSnd.preload = 'auto'
_jumpscareSnd.volume  = 1.0

// ── JUMPSCARE ──
function triggerJumpscare(onDone) {
  // Start audio first — browsers have ~50-80ms audio init latency even when preloaded.
  // Delaying the image by the same amount keeps scream and photo in sync.
  const snd = _jumpscareSnd
  snd.currentTime = 2
  snd.play().catch(() => {})

  setTimeout(() => {
    const overlay = document.createElement('div')
    overlay.id = 'jumpscare-overlay'
    const img = document.createElement('img')
    img.src = jumpscarePng
    overlay.appendChild(img)
    document.body.appendChild(overlay)

    // Hold for 2.5 seconds then cut hard to black (blocker is already underneath)
    setTimeout(() => {
      overlay.remove()
      snd.pause()
      onDone && onDone()
    }, 2500)
  }, 80)
}

// ── DIALOGUE ──
function buildEndingScript() {
  const confessionRead = localStorage.getItem('breach_confession_read') === '1'
  return [
  'Pedro: Kimi?…',
  'Pedro: Kimi!! Hey!!',
  'Pedro: Oh thank god — are you okay??',
  'Pedro: You slipped in the shower and hit your head really hard, dude.',
  'Pedro: You were out for like a full minute. I was actually scared.',
  'Kimi: ...wait...',
  'Kimi: ...phantom protocol...',
  'Kimi: ...layer twenty... K.Chen... the sub-vault... I got through...',
  'Pedro: What are you talking about?',
  'Kimi: The system. Twenty layers. I got through all of them.',
  'Kimi: NOMAI was layer six. The frequency was A4 — 440 hertz.',
  'Pedro: Kimi.',
  'Pedro: You hit your head.',
  'Pedro: It was a dream.',
  'Kimi: It felt real, Pedro.',
  'Kimi (thoughts): "...the last key is the only one I couldn\'t encrypt..."',
  'Kimi (thoughts): "...because it was never mine to keep..."',
  'Pedro: Okay yeah you are definitely concussed.',
  'Pedro: Happy birthday by the way! For real!',
  "Pedro: Come on. Bar opens in ten minutes. Let's go.",
  {
    choice: [
      {
        label: "wait, lemme just wash my face real quick",
        lines: [
          'Pedro: WAIT',
          'Pedro: Kimi!!',
          "Pedro: Don't go back in there!!",
          'Pedro: THE FLOOR IS STILL WET!!!',
        ],
        ending: 'good',
      },
      {
        label: "ouch... my head...",
        lines: [
          "Pedro: Come on, let's go",
          'Kimi: *sigh*... okay...',
          'Kimi (thoughts): "What even was that...?"',
          'Kimi (thoughts): "Twenty layers..."',
          'Kimi (thoughts): "Whatever."',
        ],
        ending: 'bad',
      },
      ...(confessionRead ? [{
        label: "...who built it for me...",
        lines: [
          'Pedro: Kimi?',
          'Kimi: The dream. Someone built it, Pedro.',
          'Kimi: Twenty layers. Every single one designed around things I know.',
          'Pedro: ...what do you mean?',
          'Kimi: The Outer Wilds puzzle. Music frequencies. Volvos.',
          'Kimi: Even the answer to the last layer was... me.',
          'Pedro: Kimi, it was a—',
          'Kimi: The key to layer fifteen was my username.',
          'Pedro: ...',
          'Kimi: Someone signed it. Just "A."',
          'Kimi (thoughts): "I know you break systems to understand them."',
          'Kimi (thoughts): "You already had a system worth breaking into."',
          'Pedro: Kimi that\'s... okay. That\'s kind of insane actually.',
          'Pedro: But even if it was real — how would you even find them?',
          'Kimi: The confession file.',
          'Kimi: There was a postscript at the bottom.',
          'Kimi: Encoded. Same Caesar shift as layer nine.',
          'Kimi (thoughts): "shift six. obviously."',
          'Kimi: I already decoded it.',
          'Kimi: I need to reply.',
        ],
        ending: 'secret',
      }] : []),
    ],
  },
  ]
}

// ── SECRET ENDING ──
function triggerSecretEnding(bgOverlay, onDone) {
  // Reuse the existing black overlay from the dialogue — background stays black.
  // Just repurpose its id and show the phone on top.
  const overlay = bgOverlay
  overlay.id = 'secret-ending-overlay'
  overlay.style.opacity = '1'
  overlay.style.display = 'flex'
  overlay.style.alignItems = 'center'
  overlay.style.justifyContent = 'center'

  const phone = document.createElement('div')
  phone.id = 'phone-screen'
  overlay.appendChild(phone)

  const phoneLine = (text, cls) => {
    const el = document.createElement('div')
    el.className = cls || 'phone-line'
    el.textContent = text
    return el
  }

  phone.appendChild(phoneLine('Messages', 'phone-header'))
  phone.appendChild(phoneLine('A.', 'phone-contact'))
  phone.appendChild(phoneLine('──────────────────────────', 'phone-divider'))

  const sentBubble = document.createElement('div')
  sentBubble.className = 'phone-bubble sent'
  sentBubble.style.opacity = '0'
  phone.appendChild(sentBubble)

  // A.'s replies sent sequentially
  const A_REPLIES = [
    'hey',
    'happy birthday!!',
    'i knew you\'d find it',
    'the nomai logs...',
    'kimina classified them in 2019. nobody was supposed to know.',
    'i thought you should.',
    '...',
    'the eye signal is still transmitting',
    'has been, since before everything',
    'i think you already knew that',
    'good job, kimi',
    'seriously',
  ]

  function typeText(el, text, speed, onDone) {
    let i = 0
    el.style.opacity = '1'
    const t = setInterval(() => {
      i++
      el.textContent = text.slice(0, i)
      if (i >= text.length) { clearInterval(t); onDone && onDone() }
    }, speed)
  }

  function sendNext(index) {
    if (index >= A_REPLIES.length) {
      setTimeout(() => { onDone && onDone() }, 3000)
      return
    }
    const typing = phoneLine('A. is typing...', 'phone-typing')
    phone.appendChild(typing)
    const thinkTime = A_REPLIES[index] === '...' ? 700 : 1200 + A_REPLIES[index].length * 16
    setTimeout(() => {
      typing.remove()
      const bubble = document.createElement('div')
      bubble.className = 'phone-bubble received'
      bubble.style.opacity = '0'
      phone.appendChild(bubble)
      typeText(bubble, A_REPLIES[index], 45, () => {
        setTimeout(() => sendNext(index + 1), 800)
      })
    }, thinkTime)
  }

  setTimeout(() => {
    overlay.style.opacity = '1'
    typeText(sentBubble, 'hey. i found it. all 20 layers. who are you?', 60, () => {
      const delivered = phoneLine('Delivered', 'phone-delivered')
      phone.appendChild(delivered)
      setTimeout(() => sendNext(0), 1200)
    })
  }, 800)
}

// ── REPLY SEQUENCE (post-game) ──
function triggerReplySequence(onDone) {
  const REPLY_SCRIPT = [
    'Kimi (thoughts): "...no reply needed."',
    'Kimi (thoughts): "That\'s what it said at the bottom of the confession."',
    'Kimi (thoughts): "Just go live your life."',
    'Kimi (thoughts): "..."',
    'Kimi (thoughts): "Twenty layers, Pedro."',
    'Kimi (thoughts): "Someone mapped the inside of my head and built a twenty-floor vault out of it."',
    'Kimi (thoughts): "And then hid Nomai expedition records inside it."',
    'Kimi (thoughts): "Real ones."',
    'Kimi (thoughts): "The Hearthians found the Eye. Kimina Corp buried it in 2019."',
    'Kimi (thoughts): "Called it classified. Called it a security risk."',
    'Kimi (thoughts): "A. digitized it anyway. Hid it in a puzzle. For me."',
    'Kimi (thoughts): "I\'m not just walking away from that."',
    'Kimi (thoughts): "..."',
    'Kimi (thoughts): "The postscript. Encoded. Caesar shift six."',
    'Kimi (thoughts): "Obviously."',
    'Kimi (thoughts): "It was a contact address."',
    'Pedro: are you texting someone?',
    'Kimi: ...yeah.',
    'Pedro: who?',
    'Kimi: ...the architect.',
    'Pedro: the what?',
    'Kimi: never mind.',
    'Kimi (thoughts): "okay."',
    'Kimi: ...hey.',
    'Kimi: I don\'t know if you\'ll read this.',
    'Kimi: I found all twenty layers.',
    'Kimi: The sub-vault. The Nomai logs. Poke and Clary. The Eye signal data.',
    'Kimi: I read everything.',
    'Kimi: ...',
    'Kimi: I don\'t know what to say.',
    'Kimi: The Nomai crossed an entire solar system for something that\'s been transmitting since before there was anyone to hear it.',
    'Kimi: And you found their records. And you hid them in a puzzle.',
    'Kimi: For me.',
    'Kimi: ...',
    'Kimi: That\'s either the most romantic thing anyone has ever done.',
    'Kimi: Or the most deranged.',
    'Kimi (thoughts): "...probably both."',
    'Kimi: The last key was my name.',
    'Kimi: You made me unlock myself.',
    'Kimi: I don\'t know what to do with that.',
    'Kimi: ...',
    'Kimi: thank you.',
    'Kimi: you didn\'t have to.',
    'Kimi: but you did.',
    'Kimi: and I found it.',
    'Kimi (thoughts): "Send."',
  ]
  triggerDialogue(REPLY_SCRIPT, () => {
    if (window.unlockAchievement)
      window.unlockAchievement('ghost_reply', 'GHOST REPLY', 'You replied. They\'ll read it.')
    onDone && onDone()
  })
}

window.triggerReplySequence = triggerReplySequence

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
      const msgs = ["You didn't find out.", '', '...', '']
      let i = 0
      const next = () => {
        if (i >= msgs.length) {
          setTimeout(() => {
            localStorage.setItem('breach_bad_ending', '1')
            box.style.opacity = '0'
            setTimeout(() => {
              overlay.remove()
              triggerCredits('bad')
            }, 600)
          }, 800)
          return
        }
        textEl.textContent = msgs[i++]
        setTimeout(next, 1000)
      }
      next()
    }, 500)
  }

  function showSecretEndingFlow() {
    box.style.transition = 'opacity 0.5s ease'
    box.style.opacity = '0'
    setTimeout(() => {
      // Keep the dialogue overlay's black background — don't remove it yet.
      // The phone screen will appear on top of it.
      box.remove()
      triggerSecretEnding(overlay, () => {
        if (window.unlockAchievement)
          window.unlockAchievement('secret_ending', 'SIGNAL FOUND', 'You looked for A. And A. answered.')
        overlay.remove()
        triggerCredits('secret')
      })
    }, 600)
  }

  function finish() {
    cleanup()
    if (selectedEnding === 'bad') {
      showBadEnding()
      return
    }
    if (selectedEnding === 'secret') {
      showSecretEndingFlow()
      return
    }
    // Good ending — stop dialogue music abruptly, play fall.mp3
    stopDialogueAbrupt()
    box.style.transition = 'opacity 0.3s ease'
    box.style.opacity = '0'
    const fallSnd = new Audio(fallAudioUrl)
    fallSnd.volume = window.gameMuted ? 0 : 1.0
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
      const idx = (key === 'a' || key === '1') ? 0
                : (key === 'b' || key === '2') ? 1
                : (key === 'c' || key === '3') ? 2
                : -1
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
    fadeInDialogue()
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
    triggerDialogue(buildEndingScript(), onDone)
  })
}

window.triggerEndSequence = triggerEndSequence

// ── CREDITS ──
function triggerCredits(endingType) {
  const CREDITS = [
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },
    { text: 'B  R  E  A  C  H', cls: 'cr-title' },
    { text: '', cls: 'cr-gap' },
    { text: 'A game built for one person.', cls: 'cr-body-dim' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },
    { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━', cls: 'cr-rule' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },

    { col2: ['PRODUCED BY', 'DESIGNED BY'] },
    { col2name: 'adhqulm' },
    { text: '', cls: 'cr-gap' },

    { col2: ['DEVELOPED BY', 'WRITTEN BY'] },
    { col2name2: ['adhqulm & Claude', 'adhqulm'] },
    { text: '', cls: 'cr-gap' },

    { col2: ['NARRATIVE DESIGN', 'PUZZLE DESIGN'] },
    { col2name: 'adhqulm' },
    { text: '', cls: 'cr-gap' },

    { col2: ['ART DIRECTOR', 'SOUND DESIGN'] },
    { col2name: 'adhqulm' },
    { text: '', cls: 'cr-gap' },

    { col2: ['ORIGINAL SOUNDTRACK', 'LORE & WORLD BUILDING'] },
    { col2name2: ['Youtube', 'adhqulm & Mobius Digital'] },
    { text: '', cls: 'cr-gap' },

    { col2: ['UI / UX DESIGN', 'QUALITY ASSURANCE'] },
    { col2name2: ['adhqulm', 'Claude'] },
    { text: '', cls: 'cr-gap' },

    { col2: ['EXECUTIVE PRODUCER', 'DEDICATED TO'] },
    { col2name2: ['adhqulm', 'Kimi'] },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },

    { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━', cls: 'cr-rule' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },

    { text: 'PUZZLES', cls: 'cr-label' },
    { text: '', cls: 'cr-gap' },
    { text: 'ROT-13 Cipher', cls: 'cr-body' },
    { text: 'Number Base Conversion', cls: 'cr-body' },
    { text: 'Morse Code', cls: 'cr-body' },
    { text: 'Hex Frequency Decoding', cls: 'cr-body' },
    { text: 'Derived Caesar Shift', cls: 'cr-body' },
    { text: 'Process Surveillance Diff', cls: 'cr-body' },
    { text: 'Process Integrity Audit', cls: 'cr-body' },
    { text: 'Caesar Cipher', cls: 'cr-body' },
    { text: 'Acrostic', cls: 'cr-body' },
    { text: 'XOR Decryption', cls: 'cr-body' },
    { text: 'Vigenère Cipher', cls: 'cr-body' },
    { text: 'Grid Coordinate Extraction', cls: 'cr-body' },
    { text: 'Identity Lock', cls: 'cr-body' },
    { text: '...and seven others.', cls: 'cr-body-dim' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },

    { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━', cls: 'cr-rule' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },

    { text: 'CAST', cls: 'cr-label' },
    { text: '', cls: 'cr-gap' },
    { text: 'KIMI', cls: 'cr-cast' },
    { text: 'the player. the only one who could.', cls: 'cr-body-dim' },
    { text: '', cls: 'cr-gap' },
    { text: 'K. CHEN', cls: 'cr-cast' },
    { text: 'the one who almost stopped you.', cls: 'cr-body-dim' },
    { text: 'and then didn\'t.', cls: 'cr-body-dim' },
    { text: '', cls: 'cr-gap' },
    { text: 'PEDRO', cls: 'cr-cast' },
    { text: 'the one who found you on the floor.', cls: 'cr-body-dim' },
    { text: '', cls: 'cr-gap' },
    { text: 'THE ARCHITECT', cls: 'cr-cast' },
    { text: 'adhqulm', cls: 'cr-body-dim' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },

    { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━', cls: 'cr-rule' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },

    { text: 'SPECIAL THANKS', cls: 'cr-label' },
    { text: '', cls: 'cr-gap' },
    { text: 'The Nomai', cls: 'cr-body' },
    { text: 'for asking the question.', cls: 'cr-body-dim' },
    { text: '', cls: 'cr-gap' },
    { text: 'The Hearthians', cls: 'cr-body' },
    { text: 'for finding the answer.', cls: 'cr-body-dim' },
    { text: '', cls: 'cr-gap' },
    { text: 'Mobius Digital', cls: 'cr-body' },
    { text: 'for Outer Wilds.', cls: 'cr-body-dim' },
    { text: 'all Nomai & Eye of the Universe lore belongs to them.', cls: 'cr-body-dim' },
    { text: '', cls: 'cr-gap' },
    { text: 'Vite, vanilla JS, and 3am terminal errors', cls: 'cr-body-dim' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },

    { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━', cls: 'cr-rule' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },

    { text: 'BREACH is not a security system.', cls: 'cr-body' },
    { text: 'BREACH is a letter.', cls: 'cr-body' },
    { text: '', cls: 'cr-gap' },
    { text: 'And only one reader was ever meant', cls: 'cr-body-dim' },
    { text: 'to reach the last one.', cls: 'cr-body-dim' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },

    { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━', cls: 'cr-rule' },
    { text: '', cls: 'cr-gap' },
    { text: 'Happy birthday, Kimi.', cls: 'cr-name' },
    { text: '', cls: 'cr-gap' },
    { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━', cls: 'cr-rule' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },
    { text: '[ END ]', cls: 'cr-end' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },
    { text: '', cls: 'cr-gap' },
  ]

  const screen = document.createElement('div')
  screen.id = 'credits-screen'
  screen.style.cssText = `
    position: fixed; inset: 0; z-index: 99999;
    background: #000; display: flex;
    align-items: flex-start; justify-content: center;
    overflow: hidden;
  `

  const inner = document.createElement('div')
  inner.id = 'credits-inner'
  inner.style.cssText = `
    display: flex; flex-direction: column; align-items: center;
    padding: 100vh 0 60px; gap: 4px;
    font-family: 'Share Tech Mono', monospace;
    text-align: center; width: 100%; max-width: 520px;
  `

  const styleMap = {
    'cr-title':    'font-size:28px; letter-spacing:0.35em; color:#00e5ff; margin-bottom:8px;',
    'cr-rule':     'font-size:13px; color:#1a3a3a; letter-spacing:0.1em;',
    'cr-label':    'font-size:11px; letter-spacing:0.25em; color:#00e5ff; margin-top:18px; margin-bottom:2px;',
    'cr-cast':     'font-size:15px; letter-spacing:0.2em; color:#fff; font-weight:bold; margin-top:16px; margin-bottom:2px;',
    'cr-name':     'font-size:22px; color:#fff; letter-spacing:0.1em;',
    'cr-body':     'font-size:14px; color:#aaa; letter-spacing:0.05em;',
    'cr-body-dim': 'font-size:13px; color:#555; letter-spacing:0.04em;',
    'cr-end':      'font-size:14px; color:#333; letter-spacing:0.3em;',
    'cr-gap':      'height:14px;',
  }

  const col2Style = 'display:flex; width:100%; max-width:480px; justify-content:space-around; text-align:center;'
  const colCellStyle = 'flex:1;'

  for (const line of CREDITS) {
    // Two-column label row
    if (line.col2) {
      const row = document.createElement('div')
      row.style.cssText = col2Style + 'margin-top:18px; margin-bottom:2px;'
      for (const label of line.col2) {
        const cell = document.createElement('div')
        cell.style.cssText = colCellStyle + 'font-size:11px; letter-spacing:0.25em; color:#00e5ff;'
        cell.textContent = label
        row.appendChild(cell)
      }
      inner.appendChild(row)
      continue
    }
    // Two-column name row (same name both sides)
    if (line.col2name) {
      const row = document.createElement('div')
      row.style.cssText = col2Style
      for (let i = 0; i < 2; i++) {
        const cell = document.createElement('div')
        cell.style.cssText = colCellStyle + 'font-size:22px; color:#fff; letter-spacing:0.1em;'
        cell.textContent = line.col2name
        row.appendChild(cell)
      }
      inner.appendChild(row)
      continue
    }
    // Two-column name row (different names)
    if (line.col2name2) {
      const row = document.createElement('div')
      row.style.cssText = col2Style
      for (const name of line.col2name2) {
        const cell = document.createElement('div')
        cell.style.cssText = colCellStyle + 'font-size:22px; color:#fff; letter-spacing:0.1em;'
        cell.textContent = name
        row.appendChild(cell)
      }
      inner.appendChild(row)
      continue
    }
    // Normal single-column entry
    const el = document.createElement('div')
    el.style.cssText = styleMap[line.cls] || ''
    el.textContent = line.text
    inner.appendChild(el)
  }

  screen.appendChild(inner)
  document.body.appendChild(screen)

  // Scroll animation
  const totalHeight = CREDITS.length * 22 + window.innerHeight
  const duration = totalHeight * 38  // ms per px
  let startTime = null
  let animFrame

  function step(ts) {
    if (!startTime) startTime = ts
    const elapsed = ts - startTime
    const progress = elapsed / duration
    inner.style.transform = `translateY(${-progress * (totalHeight - window.innerHeight * 0.5)}px)`

    // Start fading dialogue music at 70% through
    if (progress >= 0.70) {
      const fadeProgress = (progress - 0.70) / 0.30
      dialogueMusic.volume = Math.max(0, 0.55 * (1 - fadeProgress))
    }

    if (progress < 1) {
      animFrame = requestAnimationFrame(step)
    } else {
      dialogueMusic.pause()
      dialogueMusic.currentTime = 0
    }
  }

  animFrame = requestAnimationFrame(step)
}

// ── ASH TWIN PROJECT — 22-MINUTE LOOP ──

const LOOP_MS = 22 * 60 * 1000

function triggerSunExplosion() {
  const loopCount = parseInt(localStorage.getItem('breach_loop_count') || '0') + 1
  localStorage.setItem('breach_loop_count', loopCount)
  localStorage.removeItem('breach_level')
  localStorage.removeItem('breach_detection')

  if (window.bgMusic) { window.bgMusic.pause() }
  stopDialogueAbrupt()

  // Sun explosion audio — starts at 1:50.5 so that 2:03 lands 1s before white ends.
  // (white-to-black starts at t=13500ms, so "1s before" = t=12500ms = 12.5s into sequence)
  // audio offset = 123 - 12.5 = 110.5s
  const sunSnd = new Audio(sunExplosionUrl)
  sunSnd.volume = 0
  sunSnd.currentTime = 110.5
  sunSnd.play().catch(() => {})
  // Fade in over 4 seconds
  let sunVol = 0
  const sunFade = setInterval(() => {
    sunVol = Math.min(1.0, sunVol + 0.015)
    sunSnd.volume = sunVol
    if (sunVol >= 1.0) clearInterval(sunFade)
  }, 60)

  const flare = document.createElement('div')
  flare.style.cssText = 'position:fixed;inset:0;z-index:999999;pointer-events:none;background:rgba(0,0,0,0);'
  document.body.appendChild(flare)

  // Chain of CSS transitions — each one smoothly bleeds into the next.
  // The key: set transition duration = time until next step, so it lands exactly there.
  //
  //  t=0      transparent
  //  t=2s     faint warm amber tint
  //  t=5s     rich orange glow
  //  t=8s     pale amber-white (sun overwhelming everything)
  //  t=10s    pure blinding white
  //  t=11.5s  hold white, then start fading black
  //  t=14s    full black

  const steps = [
    { at: 100,   dur: 2000,  bg: 'rgba(180, 60, 0, 0.08)'  },  // barely visible warm tint
    { at: 2100,  dur: 3000,  bg: 'rgba(255, 100, 10, 0.35)' }, // orange glow building
    { at: 5100,  dur: 3000,  bg: 'rgba(255, 180, 60, 0.70)' }, // sun flooding in
    { at: 8100,  dur: 2000,  bg: 'rgba(255, 230, 150, 0.90)'},  // almost white
    { at: 10100, dur: 1400,  bg: 'rgba(255, 255, 255, 1.0)' }, // full white
    { at: 13500, dur: 2500,  bg: 'rgba(0,   0,   0,   1.0)' }, // fade to black
  ]

  for (const s of steps) {
    setTimeout(() => {
      flare.style.transition = `background ${s.dur}ms ease`
      flare.style.background = s.bg
    }, s.at)
  }

  // Text appears on black (~16s in, after 2s white hold)
  setTimeout(() => {
    const msg = document.createElement('div')
    msg.style.cssText = `
      position:fixed; inset:0; z-index:1000000;
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      font-family:'Share Tech Mono',monospace; gap:18px; pointer-events:none;
    `
    document.body.appendChild(msg)

    const lines = [
      { t: 'THE SUN HAS EXPANDED.',        color: '#7a3300', delay: 0    },
      { t: 'THE ASH TWIN PROJECT CYCLES.', color: '#444',    delay: 2000 },
      { t: 'THE LOOP RESETS.',             color: '#2a2a2a', delay: 3800 },
      { t: `LOOP  #${loopCount}`,          color: '#1a1a1a', delay: 5800 },
    ]

    for (const line of lines) {
      setTimeout(() => {
        const el = document.createElement('div')
        el.style.cssText = `font-size:14px; letter-spacing:0.35em; color:${line.color}; opacity:0; transition:opacity 1.5s ease;`
        el.textContent = line.t
        msg.appendChild(el)
        setTimeout(() => { el.style.opacity = '1' }, 50)
      }, line.delay)
    }

    setTimeout(() => {
      msg.style.transition = 'opacity 1.5s ease'
      msg.style.opacity = '0'
      setTimeout(() => window.location.reload(), 1600)
    }, 9000)
  }, 16000)
}

window.triggerSunExplosion = triggerSunExplosion

function initLoopTimer() {
  const warn3 = LOOP_MS - 3 * 60 * 1000
  const warn1 = LOOP_MS - 60 * 1000

  setTimeout(() => {
    if (!window._breachTerminal) return
    window._breachTerminal.print('', 'empty')
    window._breachTerminal.print('  [NODE] Clock anomaly detected. System timestamp is cycling.', 'dim')
    window._breachTerminal.print('  [NODE] This pattern has been observed before.', 'dim')
    window._breachTerminal.print('', 'empty')
  }, warn3)

  setTimeout(() => {
    if (!window._breachTerminal) return
    const t = window._breachTerminal
    t.print('', 'empty')
    t.print('  -------- KIMINA INTERNAL ALERT --------', 'red')
    t.print('  [K.CHEN] Something is wrong with the node clock.', 'red')
    t.print('  [K.CHEN] Timestamps are cycling. Reading impossible values.', 'red')
    t.print('  [K.CHEN] I\'ve seen this signature before. In the Nomai files.', 'red')
    t.print('  [K.CHEN] The Ash Twin Project. They built a loop.', 'red')
    t.print('  [K.CHEN] We\'re inside it.', 'red')
    t.print('  ----------------------------------------', 'red')
    t.print('', 'empty')
  }, warn1)

  setTimeout(() => triggerSunExplosion(), LOOP_MS)
}

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

async function startGame() {
  if (booted) return
  booted = true
  waiting.remove()
  startMusic()
  const terminal = new Terminal()
  window._breachTerminal = terminal
  await document.fonts.ready
  terminal.boot()
  initLoopTimer()
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
