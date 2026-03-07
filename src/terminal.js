import { Filesystem } from './filesystem.js'
import { PUZZLES } from './puzzles.js'
import { processCommand } from './commands.js'
import { playError, playSuccess, playFinalSuccess, playBeep, playCrashSound, playMorse } from './audio.js'

const USERNAME = 'vodkashotsandvolvos'
const HOSTNAME = 'BREACH-SYS'

// ── ANALYST INTERCEPTS ───────────────────────────────────────────────────────
// K.Chen messages that appear after specific layers are cleared

const ANALYST_INTERCEPTS = {
  3:  [
    { text: '', style: 'empty' },
    { text: '  --- KIMINA INTERNAL ALERT -------------------------', style: 'red' },
    { text: '  [K.CHEN] Layer 3 bypassed. Escalating to response team.', style: 'red' },
    { text: '  [K.CHEN] This is not a bot. Someone is inside.', style: 'red' },
    { text: '  --------------------------------------------------------', style: 'red' },
    { text: '', style: 'empty' },
  ],
  6:  [
    { text: '', style: 'empty' },
    { text: '  --- KIMINA INTERNAL ALERT -------------------------', style: 'red' },
    { text: '  [K.CHEN] Layer 6. They passed the midpoint.', style: 'red' },
    { text: '  [K.CHEN] Conventional countermeasures are not working.', style: 'red' },
    { text: '  [K.CHEN] Response team is on standby.', style: 'red' },
    { text: '  --------------------------------------------------------', style: 'red' },
    { text: '', style: 'empty' },
  ],
  9:  [
    { text: '', style: 'empty' },
    { text: '  --- KIMINA INTERNAL ALERT -------------------------', style: 'red' },
    { text: '  [K.CHEN] Nine layers. NINE.', style: 'red' },
    { text: '  [K.CHEN] This is not a tool. This is a person who', style: 'red' },
    { text: '  [K.CHEN] knows exactly what they are doing.', style: 'red' },
    { text: '  [K.CHEN] I think I know who this is.', style: 'red' },
    { text: '  --------------------------------------------------------', style: 'red' },
    { text: '', style: 'empty' },
  ],
  12: [
    { text: '', style: 'empty' },
    { text: '  --- KIMINA INTERNAL ALERT -------------------------', style: 'red' },
    { text: '  [K.CHEN] 12 layers. Nothing is stopping them.', style: 'red' },
    { text: '  [K.CHEN] I keep reading the access logs.', style: 'red' },
    { text: '  [K.CHEN] This isn\'t a breach.', style: 'red' },
    { text: '  [K.CHEN] This is someone finishing something', style: 'red' },
    { text: '  [K.CHEN] that was always meant to be finished.', style: 'red' },
    { text: '  --------------------------------------------------------', style: 'red' },
    { text: '', style: 'empty' },
  ],
  14: [
    { text: '', style: 'empty' },
    { text: '  --- KIMINA INTERNAL ALERT -------------------------', style: 'red' },
    { text: '  [K.CHEN] They are at the core.', style: 'red' },
    { text: '  [K.CHEN] I don\'t think this was ever a security system.', style: 'red' },
    { text: '  [K.CHEN] I think this was always a letter.', style: 'red' },
    { text: '  [K.CHEN] Stand down. Let them through.', style: 'red' },
    { text: '  --------------------------------------------------------', style: 'red' },
    { text: '', style: 'empty' },
  ],
}

// ── CLASSIFIED FILE CONTENT ───────────────────────────────────────────────────

const CLASSIFIED_FILE = `ORIGIN_UNKNOWN.CORE
===================
CLASSIFICATION : BEYOND TOP SECRET — EYES ONLY
AUTHOR         : [IDENTITY REDACTED PER PERSONAL REQUEST]
DATE           : [REDACTED]
─────────────────────────────────────────────────────────────────

Hi.

It's me.

I built this for you.

Every layer. Every cipher. Every fake kernel panic and every
panicked K.Chen alert. Every hidden dotfile and red herring
directory. All of it — me, alone, at unreasonable hours,
learning things I didn't know I could learn, because I wanted
to make you something that actually felt like you.

Not a card. Not a playlist.
Something you would have to earn.

─────────────────────────────────────────────────────────────────

I know how your brain works.

I know that when you played Outer Wilds you didn't look
anything up. You sat with it. You let the planet flood.
You let the sun explode. You died a hundred times trying
to understand the rules of a universe that doesn't explain
itself — and eventually, without any help, you did.

That's who this was built for.

I know you hear frequencies like other people read sentences.
When you're producing you're not just making noise — you're
solving an equation in real time. Every EQ cut, every
sidechain, every arrangement decision is a structural choice.
You just call it a drop.

I know you break systems to understand them.
You don't read the documentation. You run it.
You see what breaks. You learn from the break.
You already know how everything works — you just needed
a system worth breaking into.

─────────────────────────────────────────────────────────────────

There are no other players.
There is no leaderboard.

There is just you, and this thing I made because I love you
and a card wasn't going to cut it.

Fifteen layers. All for one person.
Specifically, unmistakably, completely — you.

Happy birthday, Kimi.

You were always the classified information.
I was just the delivery mechanism.

Go build something that outlasts you.

  — you know who

─────────────────────────────────────────────────────────────────
[FILE INTEGRITY  : VERIFIED]
[CLASSIFICATION  : RECLASSIFIED — PERSONAL]
[END OF DOCUMENT]`

// ── COLOR THEMES ─────────────────────────────────────────────────────────────

const THEMES = {
  green: {
    '--green':     '#00ff41',
    '--dim-green': '#00882a',
    '--cyan':      '#00e5ff',
    '--red':       '#ff3333',
    '--yellow':    '#f0e060',
  },
  amber: {
    '--green':     '#ffb000',
    '--dim-green': '#885800',
    '--cyan':      '#ffd080',
    '--red':       '#ff6633',
    '--yellow':    '#ffe090',
  },
  blue: {
    '--green':     '#4499ff',
    '--dim-green': '#224488',
    '--cyan':      '#88ddff',
    '--red':       '#ff4466',
    '--yellow':    '#aaccff',
  },
  red: {
    '--green':     '#ff4444',
    '--dim-green': '#882222',
    '--cyan':      '#ff8888',
    '--red':       '#ff0000',
    '--yellow':    '#ffaa44',
  },
}

// ── BOOT LINES ───────────────────────────────────────────────────────────────

const BOOT_LINES = [
  { text: '', style: 'empty', delay: 80 },
  { text: '  ██████  ██████  ███████  █████   ██████ ██   ██ ', style: 'cyan', delay: 14 },
  { text: '  ██ --██ ██ --██ ██ ---- ██ --██ ██ ---- ██|  ██|', style: 'cyan', delay: 14 },
  { text: '  ██████  ██████  █████   ███████|██|     ███████|', style: 'cyan', delay: 14 },
  { text: '  ██ --██ ██ --██ ██ --   ██ --██|██|     ██ --██|', style: 'cyan', delay: 14 },
  { text: '  ██████  ██|  ██|███████ ██|  ██| ██████ ██|  ██|', style: 'cyan', delay: 14 },
  { text: '   -----   -    -  ------  -    -   -----  -    - ', style: 'cyan', delay: 14 },
  { text: '', style: 'empty', delay: 500 },
  { text: '', style: 'empty', delay: 500 },
  { text: '  BREACH PROTOCOL v2.4.1  //  SECURE SHELL INITIALISING', style: 'dim', delay: 60 },
  { text: '', style: 'empty', delay: 300 },
  { text: '  > CONNECTING TO Kimina Corporation MAINFRAME...', style: 'dim', delay: 55 },
  { text: '  > CONNECTION ESTABLISHED  [192.168.0.1 → 10.44.7.9]', style: 'dim', delay: 80 },
  { text: '  > AUTHENTICATING...', style: 'dim', delay: 600 },
  { text: `  > USER: ${USERNAME}`, style: 'green', delay: 50 },
  { text: '  > AUTH: APPROVED', style: 'green', delay: 50 },
  { text: '', style: 'empty', delay: 400 },
  { text: '  +--------------------------------------------------+', style: 'dim', delay: 22 },
  { text: '  |  TARGET    : Kimina Corp MAINFRAME               |', style: 'dim', delay: 22 },
  { text: '  |  OBJECTIVE : RETRIEVE CLASSIFIED CORE FILE       |', style: 'dim', delay: 22 },
  { text: '  |  LAYERS    : 15 SECURITY LAYERS ACTIVE           |', style: 'dim', delay: 22 },
  { text: '  |  STATUS    : INTRUSION UNDETECTED - FOR NOW      |', style: 'dim', delay: 22 },
  { text: '  +--------------------------------------------------+', style: 'dim', delay: 22 },
  { text: '', style: 'empty', delay: 500 },
  { text: '  Break through all 15 layers to reach the core.', style: 'bright', delay: 90 },
  { text: '  Type  help  for commands.  Type  ls  to start.', style: 'bright', delay: 90 },
  { text: '', style: 'empty', delay: 90 },
]

// ── TERMINAL CLASS ────────────────────────────────────────────────────────────

export class Terminal {
  constructor() {
    this.$output    = document.getElementById('output')
    this.$inputLine = document.getElementById('input-line')
    this.$prompt    = document.getElementById('prompt')
    this.$inputDisp = document.getElementById('input-display')
    this.$cursor    = document.getElementById('cursor')
    this.$layer     = document.getElementById('status-layer')
    this.$progress  = document.getElementById('progress-bar')
    this.$detBar    = document.getElementById('detection-bar')
    this.$detPct    = document.getElementById('detection-pct')
    this.$app       = document.getElementById('app')

    this.inputBuffer  = ''
    this.cmdHistory   = []
    this.historyIdx   = -1
    this.locked       = true
    this.currentLevel = 0
    this.detection    = 0

    // Per-layer stat tracking
    this.layerStats         = []   // [{ time, wrong, hints }]
    this.layerStartTime     = null
    this.layerWrongAttempts = 0

    this.state = {
      cwd:            '/',
      fs:             null,
      puzzle:         null,
      hintsUsed:      0,
      history:        this.cmdHistory,
      levelId:        0,
      bumpDetection:  (n) => this._bumpDetection(n),
    }

    this._toastQueue = []
    this._toastBusy  = false

    this._bindEvents()
    this._startGlitchTimer()
    this._startAmbientAlerts()
    window.unlockAchievement = (id, title, desc) => this._unlockAchievement(id, title, desc)
  }

  // ── EVENTS ───────────────────────────────────────────────────────────────

  _bindEvents() {
    document.addEventListener('keydown', e => this._onKey(e))
  }

  _onKey(e) {
    if (this.locked) return
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'c') {
        this._echoInput()
        this.print('^C', 'dim')
        this.inputBuffer = ''
        this.historyIdx  = -1
        this._renderInput()
      }
      if (e.key === 'l') { e.preventDefault(); this._clearOutput() }
      return
    }

    switch (e.key) {
      case 'Enter':      this._submit(); break
      case 'Backspace':
        e.preventDefault()
        if (this.inputBuffer.length > 0) {
          this.inputBuffer = this.inputBuffer.slice(0, -1)
          this._renderInput()
        }
        break
      case 'Tab':
        e.preventDefault()
        this._autocomplete()
        break
      case 'ArrowUp':
        e.preventDefault()
        if (this.cmdHistory.length > 0) {
          this.historyIdx = Math.min(this.historyIdx + 1, this.cmdHistory.length - 1)
          this.inputBuffer = this.cmdHistory[this.cmdHistory.length - 1 - this.historyIdx]
          this._renderInput()
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (this.historyIdx > 0) {
          this.historyIdx--
          this.inputBuffer = this.cmdHistory[this.cmdHistory.length - 1 - this.historyIdx]
        } else {
          this.historyIdx  = -1
          this.inputBuffer = ''
        }
        this._renderInput()
        break
      default:
        if (e.key.length === 1) {
          e.preventDefault()
          this.inputBuffer += e.key
          this._renderInput()
        }
    }
  }

  // ── COMMAND SUBMISSION ───────────────────────────────────────────────────

  _submit() {
    const input = this.inputBuffer.trim()
    this._echoInput()
    this.inputBuffer = ''
    this.historyIdx  = -1
    this._renderInput()
    if (!input) return
    this.cmdHistory.push(input)

    const parts = input.toLowerCase().split(/\s+/)

    // ── Terminal-level commands ──────────────────────────
    if (parts[0] === 'reset') {
      localStorage.removeItem('breach_level')
      localStorage.removeItem('breach_detection')
      this.print('', 'empty')
      this.print('Session wiped. Restarting...', 'yellow')
      setTimeout(() => location.reload(), 1200)
      return
    }

    // ── achievements command ─────────────────────────────
    if (parts[0] === 'achievements') {
      const ALL = [
        { id: 'good_ending',  title: 'THE FLOOR IS STILL WET', desc: 'Good ending. You know why.' },
        { id: 'bad_ending',   title: 'DENIAL',                 desc: 'You walked away. But you came back.' },
        { id: 'halfway',      title: 'DEEP COVER',             desc: 'Past the halfway point.' },
        { id: 'layer_15',     title: 'AT THE CORE',            desc: 'Layer 15. Almost there.' },
        { id: 'ghost',        title: 'GHOST',                  desc: 'No hints. No wrong answers. Flawless.' },
        { id: 'blitz',        title: 'BLITZ',                  desc: 'Layer cleared in under 30 seconds.' },
        { id: 'persistent',   title: 'PERSISTENT',             desc: 'Five wrong answers on one layer.' },
        { id: 'easter_egg',   title: 'EASTER EGG FOUND',       desc: 'You went looking.' },
        { id: 'archaeologist',title: 'ARCHAEOLOGIST',          desc: 'You found what was hidden.' },
        { id: 'second_run',   title: "YOU'RE BACK",            desc: "Second run. You didn't have to." },
      ]
      const unlocked = JSON.parse(localStorage.getItem('breach_achievements') || '{}')
      const count = ALL.filter(a => unlocked[a.id]).length
      const W = 50
      const row  = (content, style) => this.print(`  |${content.padEnd(W)}|`, style)
      this.print('', 'empty')
      this.print(`  +${'-'.repeat(W)}+`, 'cyan')
      row(`  ACHIEVEMENTS  [${count}/${ALL.length} UNLOCKED]`, 'cyan')
      this.print(`  +${'-'.repeat(W)}+`, 'cyan')
      for (const a of ALL) {
        if (unlocked[a.id]) {
          row(`  [x] ${a.title}`, 'cyan')
          row(`       ${a.desc}`, 'dim')
        } else {
          row(`  [ ] ???`, 'dim')
        }
      }
      this.print(`  +${'-'.repeat(W)}+`, 'cyan')
      this.print('', 'empty')
      return
    }

    // ── Achievement: easter egg commands ────────────────
    if (['outerwilds', 'produce', 'ableton', 'volvo'].includes(parts[0])) {
      this._unlockAchievement('easter_egg', 'EASTER EGG FOUND', 'You went looking.')
    }

    // ── Achievement: read a hidden dotfile ───────────────
    if (parts[0] === 'cat' && parts[1] && parts[1].startsWith('.')) {
      this._unlockAchievement('archaeologist', 'ARCHAEOLOGIST', 'You found what was hidden.')
    }

    // ── DEV: skip straight to end sequence ──────────────
    if (parts[0] === 'devskip') {
      this.print('', 'empty')
      this.print('[DEV] Skipping to end sequence...', 'yellow')
      setTimeout(() => this._showCompletion(), 500)
      return
    }

    // ── DEV: test achievement toasts ─────────────────────
    if (parts[0].startsWith('triggerachiev')) {
      const testAchievements = [
        { title: 'THE FLOOR IS STILL WET', desc: 'Good ending. You know why.' },
        { title: 'DEEP COVER',             desc: 'Past the halfway point.' },
        { title: 'GHOST',                  desc: 'No hints. No wrong answers. Flawless.' },
        { title: 'EASTER EGG FOUND',       desc: 'You went looking.' },
        { title: 'BLITZ',                  desc: 'Layer cleared in under 30 seconds.' },
        { title: 'DENIAL',                 desc: 'You walked away. But you came back.' },
        { title: 'ARCHAEOLOGIST',          desc: 'You found what was hidden.' },
        { title: "YOU'RE BACK",            desc: "Second run. You didn't have to." },
        { title: 'PERSISTENT',             desc: 'Five wrong answers on one layer.' },
        { title: 'AT THE CORE',            desc: 'Layer 15. Almost there.' },
      ]
      const n = parseInt(parts[0].replace('triggerachiev', '')) || 1
      const idx = Math.max(0, Math.min(n - 1, testAchievements.length - 1))
      const a = testAchievements[idx]
      this._showAchievementToast(a.title, a.desc)
      this.print(`[DEV] Triggered achievement ${n}: ${a.title}`, 'yellow')
      return
    }

    // Process via commands.js
    const outputLines = processCommand(input, this.state, (correct) => {
      this._handleUnlock(correct)
    })

    for (const { text, style } of outputLines) {
      if (style !== 'internal') {
        this.print(text, style)
        continue
      }
      // Internal markers
      if (text === '__CLEAR__')             this._clearOutput()
      else if (text === '__SCAN__')         this._runScan()
      else if (text.startsWith('__THEME__')) this._setTheme(text.split(' ')[1])
      else if (text.startsWith('__VOL__'))   this._adjustVolume(text.split(' ')[1])
    }

    this._setPrompt()
    this._scrollToBottom()
  }

  // ── UNLOCK HANDLING ──────────────────────────────────────────────────────

  _handleUnlock(correct) {
    if (correct) {
      this.locked = true
      playSuccess()
      this._bumpDetection(-10)

      // Record layer stats
      const elapsed = this.layerStartTime ? Math.round((Date.now() - this.layerStartTime) / 1000) : 0
      this.layerStats.push({
        layer:  this.currentLevel,
        time:   elapsed,
        wrong:  this.layerWrongAttempts,
        hints:  this.state.hintsUsed,
      })

      if (elapsed > 0 && elapsed < 30) this._unlockAchievement('blitz', 'BLITZ', 'Layer cleared in under 30 seconds.')

      this.print('', 'empty')
      this.print('[ ACCESS GRANTED ]', 'cyan')
      this.print('', 'empty')
      this.$app.classList.add('success-flash')
      setTimeout(() => this.$app.classList.remove('success-flash'), 800)

      const puzzle       = this.state.puzzle
      const intercept    = ANALYST_INTERCEPTS[this.currentLevel]
      const successLines = puzzle.successMsg && puzzle.successMsg.length > 0
        ? [...puzzle.successMsg.map(t => ({ text: t, style: 'dim' })), { text: '', style: 'empty' }]
        : null

      if (successLines) {
        setTimeout(() => {
          this._printLinesDelayed(successLines, 30, () => {
            if (intercept) {
              setTimeout(() => {
                this._printLinesDelayed(intercept, 40, () => {
                  setTimeout(() => this._advanceToLevel(this.currentLevel + 1), 800)
                })
              }, 400)
            } else {
              setTimeout(() => this._advanceToLevel(this.currentLevel + 1), 1200)
            }
          })
        }, 600)
      } else {
        // Level 15 — no success message, go straight to completion
        setTimeout(() => this._showCompletion(), 800)
      }

    } else {
      playError()
      this._bumpDetection(20)
      this.layerWrongAttempts++
      if (this.layerWrongAttempts >= 5) this._unlockAchievement('persistent', 'PERSISTENT', 'Five wrong answers on one layer.')
      this.$app.classList.add('shake')
      setTimeout(() => this.$app.classList.remove('shake'), 400)
      this.print('', 'empty')
      this.print('[ ACCESS DENIED ]  — incorrect key.', 'red')
      this.print('', 'empty')
    }
  }

  // ── SCAN ANIMATION ───────────────────────────────────────────────────────

  _runScan() {
    this.locked = true
    const intro = [
      { text: '', style: 'empty' },
      { text: '[SYS] Initiating vulnerability scan...', style: 'dim' },
      { text: '[SYS] Target: 10.44.7.9', style: 'dim' },
      { text: '', style: 'empty' },
    ]
    this._printLinesDelayed(intro, 120, () => {
      // Progress bar element
      const barEl = document.createElement('div')
      barEl.className   = 'line green'
      barEl.textContent = '      [░░░░░░░░░░░░░░░░░░░░] 0%'
      this.$output.appendChild(barEl)
      this._scrollToBottom()

      let pct = 0
      const tick = setInterval(() => {
        pct += 5
        const filled = Math.floor(pct / 5)
        barEl.textContent = `      [${'█'.repeat(filled)}${'░'.repeat(20 - filled)}] ${pct}%`
        this._scrollToBottom()
        if (pct >= 100) {
          clearInterval(tick)
          const results = [
            { text: '', style: 'empty' },
            { text: '[SCAN COMPLETE] — 5 findings', style: 'cyan' },
            { text: '', style: 'empty' },
            { text: '[CRITICAL]  PID 1892: Unauthorized session — cannot terminate', style: 'red' },
            { text: '[HIGH]      Port 9001: Authentication bypass — ACTIVE', style: 'red' },
            { text: '[HIGH]      /var/log/trace.log: Sensitive data in plaintext', style: 'yellow' },
            { text: '[MED]       security_daemon PID 201: Cipher module memory leak', style: 'yellow' },
            { text: '[LOW]       SSL certificate port 443: Expires in 3 days', style: 'green' },
            { text: '', style: 'empty' },
            { text: '12 ports open. Intrusion session active. Origin: 192.168.0.1', style: 'dim' },
            { text: '', style: 'empty' },
          ]
          setTimeout(() => {
            this._printLinesDelayed(results, 70, () => { this.locked = false })
          }, 300)
        }
      }, 110)
    })
  }

  // ── THEME ────────────────────────────────────────────────────────────────

  _setTheme(name) {
    const theme = THEMES[name] || THEMES.green
    const root  = document.documentElement.style
    Object.entries(theme).forEach(([k, v]) => root.setProperty(k, v))
    this.print('', 'empty')
    this.print(`Theme set: ${name || 'green'}`, 'dim')
    this.print('', 'empty')
  }

  // ── VOLUME ───────────────────────────────────────────────────────────────

  _adjustVolume(dir) {
    const music = window.bgMusic
    if (!music) return
    const prev = music.volume
    if (dir === 'up')    music.volume = Math.min(1, prev + 0.05)
    else if (dir === 'down') music.volume = Math.max(0, prev - 0.05)
    else if (dir === 'mute') music.volume = 0
    else {
      const n = parseFloat(dir)
      if (!isNaN(n)) music.volume = Math.max(0, Math.min(1, n / 100))
    }
    this.print('', 'empty')
    this.print(`Volume: ${Math.round(music.volume * 100)}%`, 'dim')
    this.print('', 'empty')
  }

  // ── DETECTION METER ──────────────────────────────────────────────────────

  _bumpDetection(amount) {
    this.detection = Math.max(0, Math.min(100, this.detection + amount))
    this._updateDetectionUI()
    localStorage.setItem('breach_detection', this.detection)
    if (this.detection >= 100) this._detectionAlert()
  }

  _updateDetectionUI() {
    const pct = this.detection
    this.$detBar.style.width       = `${pct}%`
    this.$detPct.textContent       = `${pct}%`
    const color = pct < 40 ? 'var(--green)' : pct < 70 ? 'var(--yellow)' : 'var(--red)'
    this.$detBar.style.background  = color
    this.$detBar.style.boxShadow   = `0 0 6px ${color}`
    this.$detPct.style.color       = color
    this._updateTitle()
  }

  _detectionAlert() {
    this.locked = true
    playError()

    const overlay = document.createElement('div')
    overlay.id = 'gameover-overlay'
    overlay.innerHTML = `
      <div id="gameover-content">
        <div id="gameover-title">⚠ TRACE COMPLETE ⚠</div>
        <div id="gameover-sub">OPERATOR IDENTIFIED</div>
        <div id="gameover-user">${USERNAME}</div>
        <div id="gameover-countdown">TERMINATING SESSION IN <span id="gameover-num">5</span>...</div>
        <div id="gameover-status"></div>
      </div>
    `
    document.body.appendChild(overlay)

    let count = 5
    const numEl = overlay.querySelector('#gameover-num')
    const statusEl = overlay.querySelector('#gameover-status')

    const tick = setInterval(() => {
      count--
      if (count > 0) {
        numEl.textContent = count
        playError()
      } else {
        clearInterval(tick)
        numEl.parentElement.textContent = 'TERMINATION FAILED — SESSION TOO DEEP TO CLOSE'
        numEl.parentElement.style.color = '#ffff00'
        setTimeout(() => {
          statusEl.textContent = 'INITIATING GHOST PROTOCOL...'
          statusEl.style.color = 'var(--cyan)'
          setTimeout(() => {
            overlay.style.transition = 'opacity 0.7s ease'
            overlay.style.opacity = '0'
            setTimeout(() => {
              overlay.remove()
              this.detection = 20
              this._updateDetectionUI()
              localStorage.setItem('breach_detection', this.detection)
              const ghostLines = [
                { text: '', style: 'empty' },
                { text: '  > GHOST PROTOCOL ACTIVATED', style: 'cyan' },
                { text: '  > Signature masked. Detection systems blinded.', style: 'dim' },
                { text: "  > They know you're here. They can't stop you.", style: 'dim' },
                { text: '', style: 'empty' },
              ]
              this._printLinesDelayed(ghostLines, 45, () => { this.locked = false })
            }, 700)
          }, 1100)
        }, 900)
      }
    }, 1000)
  }

  _startDetectionTick() {
    setInterval(() => {
      if (!this.locked && this.currentLevel > 0 && this.currentLevel <= 15) {
        this._bumpDetection(1)
      }
    }, 120000)
  }

  // ── TAB AUTOCOMPLETE ─────────────────────────────────────────────────────

  _autocomplete() {
    if (!this.state.fs) return
    const parts   = this.inputBuffer.split(' ')
    const cmd     = parts[0].toLowerCase()
    if (!['cat', 'cd', 'ls'].includes(cmd) || parts.length < 2) return

    const partial   = parts.slice(1).join(' ')
    const lastSlash = partial.lastIndexOf('/')
    const dirPart   = lastSlash >= 0 ? partial.slice(0, lastSlash + 1) : ''
    const namePart  = lastSlash >= 0 ? partial.slice(lastSlash + 1)   : partial

    const dirPath = this.state.fs.resolve(this.state.cwd, dirPart || '.')
    if (!this.state.fs.isDir(dirPath)) return

    const entries = this.state.fs.list(dirPath, { showHidden: namePart.startsWith('.') })
    const matches = entries.filter(e =>
      e.name.toLowerCase().startsWith(namePart.toLowerCase())
    )

    if (matches.length === 0) {
      playBeep(220, 0.06)
    } else if (matches.length === 1) {
      const m = matches[0]
      this.inputBuffer = parts[0] + ' ' + dirPart + m.name + (m.isDir ? '/' : '')
      this._renderInput()
      playBeep(700, 0.04)
    } else {
      this._echoInput()
      this.print('', 'empty')
      this.print(matches.map(e => e.name + (e.isDir ? '/' : '')).join('    '), 'dim')
      this._scrollToBottom()
      playBeep(500, 0.04)
    }
  }

  // ── GLITCH ───────────────────────────────────────────────────────────────

  _startGlitchTimer() {
    const schedule = () => {
      const det = this.detection
      const min = det >= 80 ? 2000  : det >= 60 ? 5000  : det >= 30 ? 10000 : 18000
      const max = det >= 80 ? 6000  : det >= 60 ? 14000 : det >= 30 ? 25000 : 55000
      setTimeout(() => {
        if (!this.locked) {
          this._triggerGlitch()
          if (det >= 60) setTimeout(() => this._triggerGlitch(), 180)
          if (det >= 80) setTimeout(() => this._triggerGlitch(), 420)
        }
        schedule()
      }, min + Math.random() * (max - min))
    }
    schedule()
  }

  _triggerGlitch() {
    const allLines = Array.from(this.$output.querySelectorAll('.line'))
    if (allLines.length < 4) return
    const count = 1 + Math.floor(Math.random() * 3)
    const saved = []
    for (let i = 0; i < count; i++) {
      const el   = allLines[Math.floor(Math.random() * allLines.length)]
      const orig = el.textContent
      if (!orig || orig.length < 4) continue
      saved.push({ el, orig, prevColor: el.style.color })
      el.textContent = this._scramble(orig)
      el.style.color = 'var(--red)'
    }
    this.$output.classList.add('glitch')
    setTimeout(() => {
      saved.forEach(({ el, orig, prevColor }) => {
        el.textContent = orig
        el.style.color = prevColor
      })
      this.$output.classList.remove('glitch')
    }, 80 + Math.random() * 130)
  }

  _scramble(text) {
    const chars = '!@#$%^&*_-=[]{}|;:<>?/~ABCDEFabcdef0123456789'
    return text.split('').map(c =>
      c === ' ' ? c : (Math.random() > 0.45
        ? chars[Math.floor(Math.random() * chars.length)]
        : c)
    ).join('')
  }

  // ── RENDERING ────────────────────────────────────────────────────────────

  _renderInput() { this.$inputDisp.textContent = this.inputBuffer }

  _echoInput() {
    const el = document.createElement('div')
    el.className   = 'line bright'
    el.textContent = this.$prompt.textContent + this.inputBuffer
    this.$output.appendChild(el)
    this._scrollToBottom()
  }

  print(text, style = 'green') {
    const el = document.createElement('div')
    el.className   = `line ${style}`
    el.textContent = text
    this.$output.appendChild(el)
    this._scrollToBottom()
  }

  _clearOutput() { this.$output.innerHTML = '' }

  _scrollToBottom() { this.$output.scrollTop = this.$output.scrollHeight }

  _setPrompt() {
    const dir = this.state.cwd === '/' ? '~' : this.state.cwd
    this.$prompt.textContent = `${USERNAME}@${HOSTNAME}:${dir}$ `
  }

  _updateStatusBar() {
    this.$layer.textContent    = `LAYER: ${this.currentLevel}/15`
    this.$progress.style.width = `${Math.round((this.currentLevel / 15) * 100)}%`
    this._updateTitle()
  }

  // ── ACHIEVEMENTS ─────────────────────────────────────────────────────────

  _unlockAchievement(id, title, desc) {
    const saved = JSON.parse(localStorage.getItem('breach_achievements') || '{}')
    if (saved[id]) return
    saved[id] = Date.now()
    localStorage.setItem('breach_achievements', JSON.stringify(saved))
    this._showAchievementToast(title, desc)
  }

  _showAchievementToast(title, desc) {
    this._toastQueue.push({ title, desc })
    if (!this._toastBusy) this._processToastQueue()
  }

  _processToastQueue() {
    if (this._toastQueue.length === 0) { this._toastBusy = false; return }
    this._toastBusy = true
    const { title, desc } = this._toastQueue.shift()
    const el = document.createElement('div')
    el.className = 'achievement-toast toast-enter'
    el.innerHTML = `<div class="toast-label">achievement unlocked</div><div class="toast-name">${title}</div><div class="toast-desc">${desc}</div>`
    document.body.appendChild(el)
    setTimeout(() => {
      el.classList.remove('toast-enter')
      el.classList.add('toast-exit')
      setTimeout(() => {
        el.remove()
        this._processToastQueue()
      }, 420)
    }, 3000)
  }

  _updateTitle() {
    const lyr = this.currentLevel
    const det = this.detection
    if (lyr === 0)   { document.title = 'BREACH v2.4.1'; return }
    if (lyr > 15)    { document.title = 'CORE ACCESS GRANTED'; return }
    const warn = det >= 80 ? `⚠⚠ ${det}% | ` : det >= 60 ? `⚠ ${det}% | ` : ''
    document.title = `${warn}LAYER ${lyr}/15 — BREACH`
  }

  _startAmbientAlerts() {
    const msgs = [
      '[TRACE DETECTED ON NODE 9]',
      '[WATCHDOG ACTIVE — monitoring session]',
      '[ANOMALY FLAGGED: packet_loss_threshold exceeded]',
      '[KIMINA SECURITY: scanning sector 7...]',
      '[INTRUSION LOG: session flagged for manual review]',
      '[ALERT: unauthorized filesystem access logged]',
    ]
    const tick = () => {
      if (this.detection >= 60 && !this.locked && this.currentLevel >= 1 && this.currentLevel <= 15) {
        if (Math.random() < 0.5) {
          this.print(`  ${msgs[Math.floor(Math.random() * msgs.length)]}`, 'red')
          this._scrollToBottom()
        }
      }
      setTimeout(tick, 8000 + Math.random() * 14000)
    }
    setTimeout(tick, 12000)
  }

  // ── LEVEL ADVANCE (with optional jumpscare on layer 9) ───────────────────

  _advanceToLevel(levelId) {
    if (levelId === 8) {
      this._fakeCrash(() => this._loadLevel(levelId))
    } else {
      this._loadLevel(levelId)
    }
  }

  _fakeCrash(onDone) {
    this.locked = true
    playCrashSound()

    // Brief red flash
    this.$app.style.transition = 'background 0.04s'
    this.$app.style.background = 'rgba(40,0,0,0.9)'
    setTimeout(() => { this.$app.style.background = '' }, 120)

    const crashLines = [
      { text: '', style: 'empty' },
      { text: '!!! KERNEL PANIC — NOT SYNCING !!!', style: 'red' },
      { text: 'VFS: Unable to mount root fs on unknown-block(0,0)', style: 'red' },
      { text: 'CPU: 0 PID: 1337 Comm: breach Tainted: G  E 5.15.0-KIMINA', style: 'red' },
      { text: 'Hardware: KIMINA/MAINFRAME-SEC', style: 'red' },
      { text: 'Call Trace:', style: 'red' },
      { text: '  <TASK>', style: 'red' },
      { text: '  ? panic+0x14d/0x380', style: 'red' },
      { text: '  ? mount_block_root+0x1a3/0x220', style: 'red' },
      { text: '  ? prepare_namespace+0x141/0x180', style: 'red' },
      { text: '  ? breach_session_core+0x3f0/0x3f0', style: 'red' },
      { text: '  </TASK>', style: 'red' },
      { text: '---[ end Kernel panic - not syncing ]---', style: 'red' },
      { text: '', style: 'empty' },
      { text: '  KIMINA WATCHDOG: Crash detected. Attempting session kill...', style: 'yellow' },
      { text: '  KIMINA WATCHDOG: Memory dump — FAILED', style: 'yellow' },
      { text: '  KIMINA WATCHDOG: Session kill — FAILED', style: 'yellow' },
      { text: '', style: 'empty' },
      { text: '  [K.CHEN] What the hell just happened?', style: 'red' },
      { text: '  [K.CHEN] The watchdog triggered. The session should be dead.', style: 'red' },
      { text: '  [K.CHEN] IT IS STILL ALIVE.', style: 'red' },
      { text: '  [K.CHEN] How is it still alive.', style: 'red' },
      { text: '', style: 'empty' },
      { text: '  > RECOVERY SUCCESSFUL — SESSION PRESERVED', style: 'green' },
      { text: '  > Resuming from last checkpoint...', style: 'dim' },
      { text: '', style: 'empty' },
    ]

    this._printLinesDelayed(crashLines, 55, () => {
      setTimeout(() => {
        this.locked = false
        onDone()
      }, 400)
    })
  }

  // ── LEVEL LOADING ────────────────────────────────────────────────────────

  _loadLevel(levelId) {
    if (levelId > 15) { this._showCompletion(); return }

    this.currentLevel         = levelId
    this.layerStartTime       = Date.now()
    this.layerWrongAttempts   = 0

    if (levelId === 8)  this._unlockAchievement('halfway',  'DEEP COVER',  'Past the halfway point.')
    if (levelId === 15) this._unlockAchievement('layer_15', 'AT THE CORE', 'Layer 15. Almost there.')

    const puzzle              = PUZZLES[levelId - 1]
    this.state.cwd            = '/'
    this.state.fs             = new Filesystem(puzzle.filesystem)
    this.state.puzzle         = puzzle
    this.state.hintsUsed      = 0
    this.state.levelId        = levelId

    this._updateStatusBar()
    this._setPrompt()
    localStorage.setItem('breach_level', levelId)

    // Gradually increase music tension with layer progression
    const music = window.bgMusic
    if (music && music.duration) {
      music.playbackRate = levelId <= 5 ? 1.0 : levelId <= 10 ? 1.016 : 1.032
    }

    this._printLinesDelayed(
      [
        { text: '', style: 'empty' },
        { text: '-'.repeat(60), style: 'dim' },
        { text: puzzle.title, style: 'level-banner' },
        { text: '-'.repeat(60), style: 'dim' },
        { text: '', style: 'empty' },
        ...puzzle.intro.map(t => ({ text: t, style: 'green' })),
        { text: '', style: 'empty' },
      ],
      25,
      () => {
        this.locked = false
        // Layer 6: play NOMAI (-. --- -- .- ..) in morse as faint audio
        if (levelId === 6) setTimeout(() => playMorse('-. --- -- .- ..'), 600)
      }
    )
  }

  // ── BOOT ─────────────────────────────────────────────────────────────────

  boot() {
    this.$inputLine.style.visibility = 'hidden'
    this.locked = true

    const hadBadEnding = localStorage.getItem('breach_bad_ending')
    if (hadBadEnding) localStorage.removeItem('breach_bad_ending')

    const savedLevel = parseInt(localStorage.getItem('breach_level') || '0')
    const savedDet   = parseInt(localStorage.getItem('breach_detection') || '0')

    this.detection = Math.min(savedDet, 90)
    this._updateDetectionUI()
    this._startDetectionTick()

    const onBootDone = (startLevel) => {
      this.$inputLine.style.visibility = 'visible'
      this._setPrompt()
      if (hadBadEnding) {
        this._unlockAchievement('bad_ending', 'DENIAL', 'You walked away. But you came back.')
        this.print('', 'empty')
        this.print('  > previous session: terminated by operator — you were so close', 'red')
        this.print('', 'empty')
      }
      this._loadLevel(startLevel)
    }

    if (savedLevel >= 1 && savedLevel <= 15) {
      const resumeLines = [
        { text: '', style: 'empty' },
        { text: '  ██████╗ ██████╗ ███████╗ █████╗  ██████╗██╗  ██╗', style: 'cyan' },
        { text: '  ██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝██║  ██║', style: 'cyan' },
        { text: '  ██████╔╝██████╔╝█████╗  ███████║██║     ███████║', style: 'cyan' },
        { text: '  ██╔══██╗██╔══██╗██╔══╝  ██╔══██║██║     ██╔══██║', style: 'cyan' },
        { text: '  ██████╔╝██║  ██║███████╗██║  ██║╚██████╗██║  ██║', style: 'cyan' },
        { text: '  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝', style: 'cyan' },
        { text: '', style: 'empty' },
        { text: '  > RECONNECTING TO Kimina Corp MAINFRAME...', style: 'dim' },
        { text: '  > CONNECTION ESTABLISHED', style: 'dim' },
        { text: `  > USER: ${USERNAME}`, style: 'green' },
        { text: '  > AUTH: APPROVED', style: 'green' },
        { text: '', style: 'empty' },
        { text: `  > PREVIOUS SESSION FOUND — RESUMING FROM LAYER ${savedLevel}`, style: 'yellow' },
        { text: '  > Type  reset  to start from the beginning.', style: 'dim' },
        { text: '', style: 'empty' },
      ]
      this._printLinesDelayed(resumeLines, 25, () => onBootDone(savedLevel))
    } else {
      this._printLinesDelayed(BOOT_LINES, 35, () => onBootDone(1))
    }
  }

  // ── COMPLETION ───────────────────────────────────────────────────────────

  _showCompletion() {
    this.locked = true
    playFinalSuccess()
    localStorage.removeItem('breach_level')
    localStorage.removeItem('breach_detection')

    // Track completion run number
    const runs = (parseInt(localStorage.getItem('breach_completions') || '0')) + 1
    localStorage.setItem('breach_completions', runs)
    this._completionRun = runs
    if (runs >= 2) this._unlockAchievement('second_run', "YOU'RE BACK", "Second run. You didn't have to.")

    // Pre-jumpscare tension — two alert lines before the scare hits
    setTimeout(() => {
      this.print('', 'empty')
      this.print('  ⚠ WARNING — PHYSICAL COUNTERMEASURE INCOMING', 'red')
    }, 500)
    setTimeout(() => {
      this.print('  ⚠ PROXIMITY ALERT — LOCATION IDENTIFIED', 'red')
    }, 1300)

    // Trigger end sequence after the alerts land
    setTimeout(() => {
      if (typeof window.triggerEndSequence === 'function') {
        window.triggerEndSequence(() => this._renderCompletion())
      } else {
        this._renderCompletion()
      }
    }, 2600)
  }

  _renderCompletion() {
    this._clearOutput()

    // ── Build stats table ──────────────────────────────
    const totalTime  = this.layerStats.reduce((s, l) => s + l.time, 0)
    const totalWrong = this.layerStats.reduce((s, l) => s + l.wrong, 0)
    const totalHints = this.layerStats.reduce((s, l) => s + l.hints, 0)

    const fmtTime = (s) => {
      const m = Math.floor(s / 60)
      const sec = s % 60
      return m > 0 ? `${m}m ${String(sec).padStart(2,'0')}s` : `${sec}s`
    }

    const rating =
      totalHints === 0 && totalWrong === 0 ? 'PERFECT RUN — GHOST PROTOCOL' :
      totalHints === 0                      ? 'GHOST PROTOCOL — Zero hints used' :
      totalWrong <= 5 && totalHints <= 2    ? 'ELITE OPERATOR' :
      totalWrong <= 15                      ? 'SYSTEMS BREACH CONFIRMED' :
                                              'OPERATION COMPLETE'

    const statRows = this.layerStats.map(l =>
      `  ${String(l.layer).padStart(2)}    ${fmtTime(l.time).padEnd(10)}  ${String(l.wrong).padEnd(7)} ${l.hints}`
    )

    const completionLines = [
      { text: '', style: 'empty' },
      { text: '  +----------------------------------------------------+', style: 'cyan' },
      { text: '  |                                                    |', style: 'cyan' },
      { text: '  |       C O R E   A C C E S S   G R A N T E D        |', style: 'cyan' },
      { text: '  |                                                    |', style: 'cyan' },
      { text: '  +----------------------------------------------------+', style: 'cyan' },
      { text: '', style: 'empty' },
      { text: '  Retrieving classified file...', style: 'dim' },
      { text: '  [████████████████████████] 100%  DOWNLOAD COMPLETE', style: 'green' },
      { text: '', style: 'empty' },
      { text: '  ---------------------------------------------------', style: 'dim' },
      { text: '  RUN STATISTICS', style: 'cyan' },
      { text: '  ---------------------------------------------------', style: 'dim' },
      { text: '', style: 'empty' },
      { text: '  LYR   TIME        WRONG   HINTS', style: 'dim' },
      { text: '  ───   ──────────  ─────   ─────', style: 'dim' },
      ...statRows.map(t => ({ text: t, style: 'green' })),
      { text: '', style: 'empty' },
      { text: `  Total time     : ${fmtTime(totalTime)}`, style: 'bright' },
      { text: `  Wrong attempts : ${totalWrong}`, style: 'bright' },
      { text: `  Hints used     : ${totalHints}`, style: 'bright' },
      { text: `  Rating         : ${rating}`, style: 'yellow' },
      { text: `  Run #           : ${this._completionRun || 1}`, style: 'dim' },
      { text: '', style: 'empty' },
      { text: '  ---------------------------------------------------', style: 'dim' },
      { text: '', style: 'empty' },
      { text: `  USER: ${USERNAME}`, style: 'dim' },
      { text: '  STATUS: LEGENDARY', style: 'yellow' },
      { text: '', style: 'empty' },
      { text: '  The classified file has been downloaded.', style: 'cyan' },
      { text: '  Type: cat ORIGIN_UNKNOWN.CORE', style: 'yellow' },
      { text: '', style: 'empty' },
    ]

    // Trigger achievements for this run
    this._unlockAchievement('good_ending', 'THE FLOOR IS STILL WET', 'Good ending. You know why.')
    if (totalHints === 0 && totalWrong === 0)
      this._unlockAchievement('ghost', 'GHOST', 'No hints. No wrong answers. Flawless.')

    this._printLinesDelayed(completionLines, 50, () => {
      document.title             = 'CORE ACCESS GRANTED'
      this.$layer.textContent    = 'LAYER: 15/15'
      this.$progress.style.width = '100%'
      this.detection = 0
      this._updateDetectionUI()

      // Set up post-game filesystem with the classified file
      this.state.fs = new Filesystem({
        dirs:  ['/'],
        files: { '/ORIGIN_UNKNOWN.CORE': CLASSIFIED_FILE },
      })
      this.state.cwd   = '/'
      this.state.levelId = 16
      this._setPrompt()
      this.locked = false
    })
  }

  // ── UTILITY ──────────────────────────────────────────────────────────────

  _printLinesDelayed(lines, defaultDelayMs, callback) {
    let i = 0
    const step = () => {
      if (i >= lines.length) { if (callback) callback(); return }
      const { text, style, delay } = lines[i++]
      this.print(text, style)
      setTimeout(step, delay !== undefined ? delay : defaultDelayMs)
    }
    step()
  }
}
