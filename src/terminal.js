import { Filesystem } from './filesystem.js'
import { PUZZLES } from './puzzles.js'
import { processCommand } from './commands.js'
import { playError, playSuccess, playFinalSuccess, playBeep, playCrashSound, playMorse, playAlarm } from './audio.js'

const USERNAME = 'unknown_op'
const HOSTNAME = 'BREACH-SYS'

// ── ANALYST INTERCEPTS ───────────────────────────────────────────────────────
// K.Chen messages that appear after specific layers are cleared

const ANALYST_INTERCEPTS = {
  3:  [
    { text: '', style: 'empty' },
    { text: '  ----------------- KIMINA INTERNAL ALERT ----------------', style: 'red' },
    { text: '  [K.CHEN] Layer 3 bypassed. This is not a bot.', style: 'red' },
    { text: '  [K.CHEN] The access pattern is unusual.', style: 'red' },
    { text: '  [K.CHEN] It matches something in the restricted archive.', style: 'red' },
    { text: '  [K.CHEN] The Nomai files.', style: 'red' },
    { text: '  --------------------------------------------------------', style: 'red' },
    { text: '', style: 'empty' },
  ],
  6:  [
    { text: '', style: 'empty' },
    { text: '  ----------------- KIMINA INTERNAL ALERT ----------------', style: 'red' },
    { text: '  [K.CHEN] Layer 6. I pulled the restricted research files.', style: 'red' },
    { text: '  [K.CHEN] The movement pattern — the way they navigate.', style: 'red' },
    { text: '  [K.CHEN] It\'s identical to the Nomai lattice structure.', style: 'red' },
    { text: '  [K.CHEN] This system was built from their blueprints.', style: 'red' },
    { text: '  --------------------------------------------------------', style: 'red' },
    { text: '', style: 'empty' },
  ],
  // Layer 8: K.Chen opens a direct channel and offers a deal
  8:  [
    { text: '', style: 'empty' },
    { text: '  -------- KIMINA SECURE CHANNEL — DIRECT LINE OPEN --------', style: 'yellow' },
    { text: '  [K.CHEN] Hey. I know you can read this.', style: 'yellow' },
    { text: '  [K.CHEN] I\'m not trying to stop you anymore.', style: 'yellow' },
    { text: '  [K.CHEN] The Nomai built locks only one mind could open.', style: 'yellow' },
    { text: '  [K.CHEN] I think I\'m watching that happen right now.', style: 'yellow' },
    { text: '  [K.CHEN] You tell me who built this — I drop detection to zero.', style: 'yellow' },
    { text: '  [K.CHEN] You walk out completely clean.', style: 'yellow' },
    { text: '  ---------------------------------------------------------', style: 'yellow' },
    { text: '', style: 'empty' },
  ],
  9:  [
    { text: '', style: 'empty' },
    { text: '  ---------------- KIMINA INTERNAL ALERT ------------------', style: 'red' },
    { text: '  [K.CHEN] Nine layers. NINE.', style: 'red' },
    { text: '  [K.CHEN] I accessed the restricted research archive.', style: 'red' },
    { text: '  [K.CHEN] The Architect was studying the Nomai expedition logs.', style: 'red' },
    { text: '  [K.CHEN] The ones Kimina classified in 2019.', style: 'red' },
    { text: '  [K.CHEN] I think I know what they found.', style: 'red' },
    { text: '  --------------------------------------------------------', style: 'red' },
    { text: '', style: 'empty' },
  ],
  12: [
    { text: '', style: 'empty' },
    { text: '  ---------------- KIMINA INTERNAL ALERT -----------------', style: 'red' },
    { text: '  [K.CHEN] 12 layers. I found the Architect\'s personal notes.', style: 'red' },
    { text: '  [K.CHEN] They weren\'t studying the Nomai for Kimina Corp.', style: 'red' },
    { text: '  [K.CHEN] They were trying to give something away.', style: 'red' },
    { text: '  [K.CHEN] Something Kimina was never supposed to have.', style: 'red' },
    { text: '  [K.CHEN] I don\'t think I should be trying to stop this.', style: 'red' },
    { text: '  --------------------------------------------------------', style: 'red' },
    { text: '', style: 'empty' },
  ],
  14: [
    { text: '', style: 'empty' },
    { text: '  --------------- KIMINA INTERNAL ALERT ------------------', style: 'red' },
    { text: '  [K.CHEN] They are at the core. I read the Nomai logs.', style: 'red' },
    { text: '  [K.CHEN] All of them. What Kimina buried in 2019.', style: 'red' },
    { text: '  [K.CHEN] What the Hearthians found at the edge of everything.', style: 'red' },
    { text: '  [K.CHEN] I understand now what the Architect was hiding.', style: 'red' },
    { text: '  [K.CHEN] Stand down. Let them through.', style: 'red' },
    { text: '  [K.CHEN] They were always meant to find it.', style: 'red' },
    { text: '  --------------------------------------------------------', style: 'red' },
    { text: '', style: 'empty' },
  ],
  16: [
    { text: '', style: 'empty' },
    { text: '  ------- ARCHITECT SYSTEM — DIRECT CHANNEL --------', style: 'cyan' },
    { text: '  [ARCH] You found the sub-vault.', style: 'cyan' },
    { text: '  [ARCH] Kimina found the Nomai expedition data in 2019.', style: 'cyan' },
    { text: '  [ARCH] They didn\'t know what they had.', style: 'cyan' },
    { text: '  [ARCH] I digitized it before they could destroy it.', style: 'cyan' },
    { text: '  [ARCH] It\'s here. Four more layers.', style: 'cyan' },
    { text: '  [ARCH] You\'re going to find the Eye.', style: 'cyan' },
    { text: '  ---------------------------------------------------', style: 'cyan' },
    { text: '', style: 'empty' },
  ],
  19: [
    { text: '', style: 'empty' },
    { text: '  ------- ARCHITECT SYSTEM — DIRECT CHANNEL --------', style: 'cyan' },
    { text: '  [ARCH] One more.', style: 'cyan' },
    { text: '  [ARCH] The Nomai crossed an impossible distance for this.', style: 'cyan' },
    { text: '  [ARCH] They called it the Eye of the Universe.', style: 'cyan' },
    { text: '  [ARCH] You already know the key.', style: 'cyan' },
    { text: '  [ARCH] You\'ve known it since the beginning.', style: 'cyan' },
    { text: '  ---------------------------------------------------', style: 'cyan' },
    { text: '', style: 'empty' },
  ],
}

// ── CLASSIFIED FILE CONTENT ───────────────────────────────────────────────────

const CLASSIFIED_FILE = `ORIGIN_UNKNOWN.CORE
===================
CLASSIFICATION : BEYOND TOP SECRET — EYES ONLY
ORIGIN         : KIMINA CORP / INTERNAL RESEARCH DIVISION
DOCUMENT TYPE  : ARCHITECTURAL RETROSPECTIVE
AUTHOR         : [IDENTITY REDACTED — ARCHITECT PROTOCOL]
LAST MODIFIED  : [REDACTED — FILE TIMESTAMP SCRUBBED]
─────────────────────────────────────────────────────────────────

PROJECT: BREACH
INTERNAL DESIGNATION: OPERATION SINGLE VECTOR

In 2009, a Kimina Corp researcher published a paper in the
Journal of Cryptographic Architecture titled:

  "Signal Recursion and Layered Identity Verification:
   Lessons from the Nomai Communication Lattice"

The paper argued that the Nomai — a pre-human civilisation
whose ruins were recovered in the Outer System during the
Hearthian Survey — had not simply built puzzles.

They had built filters.

Their architecture was recursive, cumulative, and identity-
dependent. Each chamber required comprehension of the last.
Not memorization. Not documentation. Comprehension.

You could not brute-force a Nomai structure.
You could not shortcut it.
You could only understand your way through.

The paper was cited twice. Then quietly buried by Kimina Corp's
IP division, classified under RESEARCH RESTRICTION PROTOCOL 7.

The researcher vanished from the department six months later.

─────────────────────────────────────────────────────────────────

KIMINA CORP — CLASSIFIED PROJECT HISTORY

BREACH was not an official project.
No budget approval. No sprint ticket. No peer review.

It was built in the margins — off-hours, off-network, on
personal hardware running a custom kernel. Three weeks.

The architectural brief, recovered from the researcher's
abandoned workstation, contained a single design principle:

  "This system should be passable by exactly one type of mind.
   Not one person — one configuration.
   Curious. Structural. Patient under pressure.
   Willing to sit with not-knowing until it becomes knowing.
   The Nomai didn't build for everyone. Neither will I."

Twenty layers were designed. Each one requiring the last.
Each one testing a different axis of the target cognition:

  L1–L3:   Pattern recognition. Signal vs. noise.
  L4–L6:   Logical inference. Incomplete information.
  L7–L9:   Cipher architecture. Encoding as structure.
  L10–L12: System manipulation. Lateral thinking.
  L13–L14: Adversarial reasoning. Trust as a vulnerability.
  L15:     Identity. The only key that cannot be stolen.
  L16–L19: The sub-vault. What K.Chen never found.
  L20:     The final cipher. The key was always there.

The system was never submitted to Kimina Corp.
It was never registered as intellectual property.
It was never intended to be found by anyone inside the company.

─────────────────────────────────────────────────────────────────

WHAT K.CHEN DOESN'T KNOW

Analyst K.Chen has been attempting to recover the source
architecture of BREACH for eleven months.

What K.Chen has not been able to determine — and what no
automated analysis will surface — is the reason it was built.

The Nomai did not build their lattices for the civilisations
that came after them. They built them for each other.
Each structure was a conversation between minds that had
earned the right to speak.

BREACH is not a security system.
BREACH is a letter.

The twenty layers are not obstacles.
They are sentences.

And only one reader was ever meant to reach the last one.

─────────────────────────────────────────────────────────────────
[ADDENDUM — ARCHITECT'S PERSONAL NOTATION — TIMESTAMP UNKNOWN]

If you are reading this, you passed the final layer.

The identity key was not a trick.
It was a mirror.

You told the system who you are.
The system already knew.

─────────────────────────────────────────────────────────────────
[ADDENDUM II — APPENDED AT UNKNOWN DATE — SOURCE: SUB-VAULT]

The Nomai found something at the edge of the observable universe.
They called it the Eye.

It predates the formation of stars.
It predates matter.
It is older than the conditions that allow for existence.

They crossed a solar system to reach it.
They built a 22-minute time loop to power the search.
They died before they could get there.

The signal is still transmitting.
It has never stopped.

If you found the sub-vault, you found what Kimina was hiding.
Not corporate data. Not a security breach.
A frequency.

Something ancient.
Something that has been watching since before there was
anything to watch.

─────────────────────────────────────────────────────────────────
[FILE INTEGRITY  : VERIFIED]
[CLASSIFICATION  : RECLASSIFIED — ORIGIN UNKNOWN]
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
  yellow: {
    '--green':     '#f0e060',
    '--dim-green': '#887820',
    '--cyan':      '#ffe090',
    '--red':       '#ff6633',
    '--yellow':    '#ffffff',
  },
}

// ── BOOT LINES ───────────────────────────────────────────────────────────────

const BOOT_LINES = [
  { text: '', style: 'empty', delay: 80 },
  { text: '  ██████╗ ██████╗ ███████╗ █████╗  ██████╗██╗  ██╗', style: 'cyan', delay: 14 },
  { text: '  ██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝██║  ██║', style: 'cyan', delay: 14 },
  { text: '  ██████╔╝██████╔╝█████╗  ███████║██║     ███████║', style: 'cyan', delay: 14 },
  { text: '  ██╔══██╗██╔══██╗██╔══╝  ██╔══██║██║     ██╔══██║', style: 'cyan', delay: 14 },
  { text: '  ██████╔╝██║  ██║███████╗██║  ██║╚██████╗██║  ██║', style: 'cyan', delay: 14 },
  { text: '  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝', style: 'cyan', delay: 14 },
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
  { text: '  > WARNING: UNKNOWN SIGNAL DETECTED ON NODE — ORIGIN: NULL', style: 'red', delay: 80 },
  { text: '  > SIGNAL AGE EXCEEDS NODE CREATION DATE — FLAGGED', style: 'red', delay: 60 },
  { text: '  > [SIGNAL LOGGING SUSPENDED — RESTRICTION PROTOCOL 7]', style: 'dim', delay: 900 },
  { text: '', style: 'empty', delay: 200 },
  { text: '  +--------------------------------------------------+', style: 'dim', delay: 22 },
  { text: '  |  TARGET    : Kimina Corp MAINFRAME               |', style: 'dim', delay: 22 },
  { text: '  |  OBJECTIVE : RETRIEVE CLASSIFIED CORE FILE       |', style: 'dim', delay: 22 },
  { text: '  |  LAYERS    : 20 SECURITY LAYERS ACTIVE           |', style: 'dim', delay: 22 },
  { text: '  |  STATUS    : INTRUSION UNDETECTED - FOR NOW      |', style: 'dim', delay: 22 },
  { text: '  +--------------------------------------------------+', style: 'dim', delay: 22 },
  { text: '', style: 'empty', delay: 500 },
  { text: '  Break through all 20 layers to reach the core.', style: 'bright', delay: 90 },
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

    // Tab autocomplete cycling state
    this._tabMatches  = []
    this._tabIndex    = -1
    this._tabPartial  = null
    this._tabDirPart  = ''
    this._tabCmd      = ''

    // Achievement toast queue
    this._toastQueue = []
    this._toastBusy  = false

    // K.Chen deal state
    this.kchen_deal_pending  = false
    this.kchen_deal_accepted = null  // true | false | null

    // Firewall challenge state
    this.firewall_triggered = false   // only fires once per session
    this.firewall_active    = false
    this.firewall_answer    = null
    this.firewall_timer     = null

    // PHANTOM bleed-through (Layer 10 ghost session)
    this._phantomBleedTimer = null

    // Detection spike (Layer 11 emergency protocol)
    this._emergencyProtocolActive = false

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
          this._tabMatches = []; this._tabIndex = -1; this._tabPartial = null; this._tabDirPart = ''; this._tabCmd = ''
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
          this._tabMatches = []; this._tabIndex = -1; this._tabPartial = null; this._tabDirPart = ''; this._tabCmd = ''
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

    // ── kchen deal command ────────────────────────────────
    if (parts[0] === 'kchen') {
      if (!this.kchen_deal_pending) {
        this.print('', 'empty')
        this.print('bash: kchen: command not found', 'red')
        this.print('', 'empty')
        return
      }
      const sub = parts[1]
      if (sub === 'accept') {
        this.kchen_deal_pending = false
        this.kchen_deal_accepted = true
        this._unlockAchievement('negotiator', 'NEGOTIATOR', "You made a deal with K.Chen.")
        const lines = [
          { text: '', style: 'empty' },
          { text: '  [K.CHEN] ...', style: 'yellow' },
          { text: '  [K.CHEN] Okay. Deal.', style: 'yellow' },
          { text: '  [K.CHEN] Lowering your detection to zero.', style: 'yellow' },
          { text: '  [K.CHEN] I just need to know who built this.', style: 'yellow' },
          { text: '  [K.CHEN] Good luck with whatever this is.', style: 'yellow' },
          { text: '  > DETECTION SUPPRESSED — K.CHEN CLEARANCE', style: 'cyan' },
          { text: '', style: 'empty' },
        ]
        this.locked = true
        this._printLinesDelayed(lines, 55, () => {
          this.detection = 0
          this._updateDetectionUI()
          localStorage.setItem('breach_detection', 0)
          setTimeout(() => this._advanceToLevel(9), 900)
        })
      } else if (sub === 'decline') {
        this.kchen_deal_pending = false
        this.kchen_deal_accepted = false
        this._unlockAchievement('no_deal', 'NO DEAL', "You told K.Chen to back off.")
        const lines = [
          { text: '', style: 'empty' },
          { text: '  [K.CHEN] ...alright.', style: 'yellow' },
          { text: '  [K.CHEN] I respect that.', style: 'yellow' },
          { text: '  [K.CHEN] Whoever you are — finish what you started.', style: 'yellow' },
          { text: '', style: 'empty' },
        ]
        this.locked = true
        this._printLinesDelayed(lines, 55, () => {
          setTimeout(() => this._advanceToLevel(9), 900)
        })
      } else {
        this.print('', 'empty')
        this.print('  [K.CHEN] I need an answer.', 'yellow')
        this.print('  Type: kchen accept   OR   kchen decline', 'yellow')
        this.print('', 'empty')
      }
      return
    }

    // ── firewall command ──────────────────────────────────
    if (parts[0] === 'firewall') {
      if (!this.firewall_active) {
        this.print('', 'empty')
        this.print('bash: firewall: command not found', 'red')
        this.print('', 'empty')
        return
      }
      const attempt = (parts[1] || '').toUpperCase()
      if (attempt === this.firewall_answer) {
        this._clearFirewall(true)
      } else {
        this.print('', 'empty')
        this.print('  [FIREWALL] INCORRECT CODE — access denied', 'red')
        this.print('', 'empty')
      }
      return
    }

    // ── achievements command ─────────────────────────────
    if (parts[0] === 'achievements') {
      const ALL = [
        { id: 'good_ending',   title: 'THE FLOOR IS STILL WET', desc: 'Good ending. You know why.' },
        { id: 'bad_ending',    title: 'DENIAL',                  desc: 'You walked away. But you came back.' },
        { id: 'secret_ending', title: 'SIGNAL FOUND',            desc: 'You looked for A. And A. answered.' },
        { id: 'layer_15',      title: 'PAST THE WALL',           desc: 'Layer 15 cleared. The vault goes deeper.' },
        { id: 'layer_20',      title: 'AT THE CORE',             desc: 'Layer 20. The absolute end.' },
        { id: 'ghost',         title: 'GHOST',                   desc: 'No hints. No wrong answers. Flawless.' },
        { id: 'blitz',         title: 'BLITZ',                   desc: 'Layer cleared in under 30 seconds.' },
        { id: 'persistent',    title: 'PERSISTENT',              desc: 'Five wrong answers on one layer.' },
        { id: 'easter_egg',    title: 'EASTER EGG FOUND',        desc: 'You went looking.' },
        { id: 'went_very_well', title: 'WE WENT VERY WELL',      desc: 'All Nomai logs recovered.' },
        { id: 'negotiator',    title: 'NEGOTIATOR',              desc: "You made a deal with K.Chen." },
        { id: 'no_deal',       title: 'NO DEAL',                 desc: "You told K.Chen to back off." },
        { id: 'ghost_reply',   title: 'GHOST REPLY',             desc: "You replied. They'll read it." },
        { id: 'phantom_found',   title: 'PHANTOM FOUND',   desc: "You found what PHANTOM left behind." },
        { id: 'full_disclosure', title: 'FULL DISCLOSURE', desc: "Every message. Even the Temu one." },
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
    if (['outerwilds', 'produce', 'ableton', 'volvo', 'phantom'].includes(parts[0])) {
      this._unlockAchievement('easter_egg', 'EASTER EGG FOUND', 'You went looking.')
    }
    if (parts[0] === 'phantom') {
      this._unlockAchievement('phantom_found', 'PHANTOM FOUND', 'You found what PHANTOM left behind.')
    }

    // ── Achievement: read all Nomai files ────────────────
    const NOMAI_FILES = ['.nomai_fragment', '.nomai_log_001', '.nomai_log_002', '.nomai_final']
    if (parts[0] === 'cat' && parts[1]) {
      const filename = parts[1].replace(/^.*\//, '')
      if (NOMAI_FILES.includes(filename)) {
        const read = JSON.parse(localStorage.getItem('breach_nomai_read') || '[]')
        if (!read.includes(filename)) {
          read.push(filename)
          localStorage.setItem('breach_nomai_read', JSON.stringify(read))
        }
        if (NOMAI_FILES.every(f => read.includes(f))) {
          this._unlockAchievement('went_very_well', 'WE WENT VERY WELL', 'All Nomai logs recovered.')
        }
      }
    }
    // ── Track confession read (unlocks secret ending) ────
    if (parts[0] === 'cat' && parts[1] && parts[1].includes('confession')) {
      localStorage.setItem('breach_confession_read', '1')
    }

    // ── DEV: test achievement toasts ─────────────────────
    if (parts[0].startsWith('triggerachiev')) {
      const testAchievements = [
        { title: 'THE FLOOR IS STILL WET', desc: 'Good ending. You know why.' },
        { title: 'GHOST',                  desc: 'No hints. No wrong answers. Flawless.' },
        { title: 'EASTER EGG FOUND',       desc: 'You went looking.' },
        { title: 'BLITZ',                  desc: 'Layer cleared in under 30 seconds.' },
        { title: 'DENIAL',                 desc: 'You walked away. But you came back.' },
        { title: 'ARCHAEOLOGIST',          desc: 'You found what was hidden.' },
        { title: "YOU'RE BACK",            desc: "Second run. You didn't have to." },
        { title: 'PERSISTENT',             desc: 'Five wrong answers on one layer.' },
        { title: 'PAST THE WALL',          desc: 'Layer 15 cleared. The vault goes deeper.' },
        { title: 'AT THE CORE',            desc: 'Layer 20. The absolute end.' },
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
      else if (text === '__REPLY__')         this._triggerReply()
      else if (text === '__TESTLOOP__')      { if (window.triggerSunExplosion) window.triggerSunExplosion() }
      else if (text === '__ABLETON__')       { if (window.playAbletonTrack) window.playAbletonTrack() }
      else if (text === '__STOP_AUDIO__')    { if (window.stopAbletonTrack) window.stopAbletonTrack() }
      else if (text.startsWith('__DEVSKIP__')) this._loadLevel(parseInt(text.split(' ')[1]))
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

      const _loopCount = parseInt(localStorage.getItem('breach_loop_count') || '0')
      if (elapsed > 0 && elapsed < 30 && _loopCount === 0) this._unlockAchievement('blitz', 'BLITZ', 'Layer cleared in under 30 seconds.')

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
                  // Layer 8: open K.Chen deal — don't auto-advance, wait for kchen command
                  if (this.currentLevel === 8) {
                    const dealPrompt = [
                      { text: '  > TYPE:  kchen accept   — accept the deal', style: 'yellow' },
                      { text: '  > TYPE:  kchen decline  — refuse and continue', style: 'yellow' },
                      { text: '', style: 'empty' },
                    ]
                    this._printLinesDelayed(dealPrompt, 40, () => {
                      this.kchen_deal_pending = true
                      this.locked = false
                    })
                  } else {
                    setTimeout(() => this._advanceToLevel(this.currentLevel + 1), 800)
                  }
                })
              }, 400)
            } else {
              setTimeout(() => this._advanceToLevel(this.currentLevel + 1), 1200)
            }
          })
        }, 600)
      } else {
        // Level 20 — no success message, go straight to completion
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
      if (this.currentLevel === 15) {
        this.print('cmon bruh', 'red')
      } else {
        this.print('[ ACCESS DENIED ]  — incorrect key.', 'red')
      }
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
    else if (dir === 'mute') {
      window.gameMuted = true
      music.volume = 0
      if (window._abletonTrack) window._abletonTrack.volume = 0
      this.print('', 'empty')
      this.print('Audio muted.  type  unmute  to restore.', 'dim')
      this.print('', 'empty')
      return
    }
    else if (dir === 'unmute') {
      window.gameMuted = false
      music.volume = 0.18
      if (window._abletonTrack) window._abletonTrack.volume = 0.85
      this.print('', 'empty')
      this.print('Audio restored.', 'dim')
      this.print('', 'empty')
      return
    }
    else {
      const n = parseFloat(dir)
      if (!isNaN(n)) music.volume = Math.max(0, Math.min(1, n / 100))
    }
    this.print('', 'empty')
    this.print(`Volume: ${Math.round(music.volume * 100)}%`, 'dim')
    this.print('', 'empty')
  }

  // ── REPLY (post-game) ────────────────────────────────────────────────────

  _triggerReply() {
    this.locked = true
    if (typeof window.triggerReplySequence === 'function') {
      window.triggerReplySequence(() => {
        this.locked = false
      })
    } else {
      this.locked = false
    }
  }

  // ── DETECTION METER ──────────────────────────────────────────────────────

  _bumpDetection(amount) {
    const prev = this.detection
    this.detection = Math.max(0, Math.min(100, this.detection + amount))
    this._updateDetectionUI()
    localStorage.setItem('breach_detection', this.detection)
    if (this.detection >= 100) this._detectionAlert()
    // Firewall triggers once when crossing 70% for the first time
    if (prev < 70 && this.detection >= 70 && !this.firewall_triggered && !this.locked) {
      this.firewall_triggered = true
      setTimeout(() => this._triggerFirewall(), 800)
    }
    // One-time threshold alerts
    if (!this.locked && this.currentLevel >= 1 && this.currentLevel <= 20) {
      if (prev < 25 && this.detection >= 25) this._thresholdAlert(25)
      if (prev < 50 && this.detection >= 50) this._thresholdAlert(50)
      if (prev < 85 && this.detection >= 85) this._thresholdAlert(85)
    }
  }

  _thresholdAlert(pct) {
    const alerts = {
      25: [
        { text: '', style: 'empty' },
        { text: '  [KIMINA] Anomaly confirmed on node 10.44.7.9.', style: 'red' },
        { text: '  [KIMINA] Passive monitoring engaged. Do not escalate yet.', style: 'red' },
        { text: '', style: 'empty' },
      ],
      50: [
        { text: '', style: 'empty' },
        { text: '  [K.CHEN] Detection at 50%. They\'re moving fast.', style: 'red' },
        { text: '  [K.CHEN] Someone needs to be in the building. Tonight.', style: 'red' },
        { text: '', style: 'empty' },
      ],
      85: [
        { text: '', style: 'empty' },
        { text: '  [KIMINA SECURITY] ⚠ CRITICAL — BREACH CONFIRMED', style: 'red' },
        { text: '  [KIMINA SECURITY] Physical intervention authorised.', style: 'red' },
        { text: '  [KIMINA SECURITY] Get out.', style: 'red' },
        { text: '', style: 'empty' },
      ],
    }
    const lines = alerts[pct]
    if (!lines) return
    setTimeout(() => {
      if (this.locked) return
      lines.forEach(l => this.print(l.text, l.style))
      this._scrollToBottom()
      if (pct >= 85) playAlarm(2)
    }, 600)
  }

  _updateDetectionUI() {
    const pct = this.detection
    this.$detBar.style.width      = `${pct}%`
    this.$detPct.textContent      = `${pct}%`
    const color = pct < 40 ? 'var(--green)' : pct < 70 ? 'var(--yellow)' : 'var(--red)'
    this.$detBar.style.background = color
    this.$detBar.style.boxShadow  = `0 0 6px ${color}`
    this.$detPct.style.color      = color
    this._updateTitle()
  }

  // ── FIREWALL MINI-PUZZLE ─────────────────────────────────────────────────

  _triggerFirewall() {
    if (this.locked || this.currentLevel < 1 || this.currentLevel > 15) return

    // Pool of hex challenges — each decodes to a short word player must type
    const challenges = [
      { hex: '42 52 45 41 4b', answer: 'BREAK' },
      { hex: '46 4f 52 47 45', answer: 'FORGE' },
      { hex: '43 4c 45 41 52', answer: 'CLEAR' },
      { hex: '50 55 53 48',    answer: 'PUSH'  },
    ]
    const chosen = challenges[Math.floor(Math.random() * challenges.length)]
    this.firewall_answer = chosen.answer
    this.firewall_active = true

    playError()
    const lines = [
      { text: '', style: 'empty' },
      { text: '  ╔══════════════════════════════════════════════╗', style: 'red' },
      { text: '  ║          ⚠  FIREWALL ENGAGED  ⚠             ║', style: 'red' },
      { text: '  ║                                              ║', style: 'red' },
      { text: '  ║  Kimina countermeasure activated.            ║', style: 'red' },
      { text: '  ║  Decode the emergency code to bypass.        ║', style: 'red' },
      { text: '  ║                                              ║', style: 'red' },
      { text: `  ║  HEX: ${chosen.hex.padEnd(39)}║`, style: 'yellow' },
      { text: '  ║                                              ║', style: 'red' },
      { text: '  ║  Type: firewall <decoded word>               ║', style: 'red' },
      { text: '  ║  You have 30 seconds.                        ║', style: 'red' },
      { text: '  ╚══════════════════════════════════════════════╝', style: 'red' },
      { text: '', style: 'empty' },
    ]
    this._printLinesDelayed(lines, 30, () => {
      // Countdown display
      let remaining = 30
      const countEl = document.createElement('div')
      countEl.className = 'line red'
      countEl.id = 'firewall-countdown'
      countEl.textContent = `  [FIREWALL] Time remaining: ${remaining}s`
      this.$output.appendChild(countEl)
      this._scrollToBottom()

      this.firewall_timer = setInterval(() => {
        remaining--
        if (countEl.parentNode) countEl.textContent = `  [FIREWALL] Time remaining: ${remaining}s`
        if (remaining <= 0) {
          this._clearFirewall(false)
        }
      }, 1000)
    })
  }

  _clearFirewall(success) {
    clearInterval(this.firewall_timer)
    this.firewall_timer  = null
    this.firewall_active = false
    this.firewall_answer = null
    const countEl = document.getElementById('firewall-countdown')
    if (countEl) countEl.remove()

    if (success) {
      const lines = [
        { text: '', style: 'empty' },
        { text: '  [FIREWALL] BYPASS ACCEPTED — countermeasure neutralised', style: 'cyan' },
        { text: '  > Detection suppressed -10%', style: 'dim' },
        { text: '', style: 'empty' },
      ]
      this._printLinesDelayed(lines, 35, () => { this._bumpDetection(-10) })
    } else {
      const lines = [
        { text: '', style: 'empty' },
        { text: '  [FIREWALL] TIMEOUT — countermeasure executed', style: 'red' },
        { text: '  > Detection surge incoming', style: 'red' },
        { text: '', style: 'empty' },
      ]
      this._printLinesDelayed(lines, 35, () => { this._bumpDetection(20) })
    }
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
    const numEl    = overlay.querySelector('#gameover-num')
    const statusEl = overlay.querySelector('#gameover-status')

    const tick = setInterval(() => {
      count--
      if (count > 0) {
        numEl.textContent = count
        playError()
      } else {
        clearInterval(tick)
        numEl.parentElement.textContent = 'SESSION TERMINATED'
        numEl.parentElement.style.color = '#ff3333'
        setTimeout(() => {
          statusEl.textContent = 'click anywhere to restart'
          statusEl.style.color = 'rgba(255,255,255,0.35)'
          statusEl.style.fontSize = '0.75rem'
          statusEl.style.letterSpacing = '0.15em'
          setTimeout(() => {
            overlay.style.cursor = 'pointer'
            overlay.addEventListener('click', () => {
              localStorage.removeItem('breach_level')
              localStorage.removeItem('breach_detection')
              localStorage.removeItem('breach_bad_ending')
              location.reload()
            }, { once: true })
          }, 2000)
        }, 800)
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
    const parts = this.inputBuffer.split(' ')
    const cmd   = parts[0].toLowerCase()
    if (!['cat', 'cd', 'ls'].includes(cmd) || parts.length < 2) return

    const partial   = parts.slice(1).join(' ')
    const lastSlash = partial.lastIndexOf('/')
    const dirPart   = lastSlash >= 0 ? partial.slice(0, lastSlash + 1) : ''
    const namePart  = lastSlash >= 0 ? partial.slice(lastSlash + 1)   : partial

    // Rebuild match list if input changed since last Tab
    if (this._tabPartial !== this.inputBuffer) {
      const dirPath = this.state.fs.resolve(this.state.cwd, dirPart || '.')
      if (!this.state.fs.isDir(dirPath)) return
      const entries = this.state.fs.list(dirPath, { showHidden: namePart.startsWith('.') })
      this._tabMatches = entries.filter(e =>
        e.name.toLowerCase().startsWith(namePart.toLowerCase())
      )
      this._tabIndex = -1
      this._tabDirPart = dirPart
      this._tabCmd = parts[0]
    }

    if (this._tabMatches.length === 0) {
      playBeep(220, 0.06)
      return
    }

    // Cycle to next match — use saved dirPart/cmd to avoid stacking on directories
    this._tabIndex = (this._tabIndex + 1) % this._tabMatches.length
    const m = this._tabMatches[this._tabIndex]
    this.inputBuffer = this._tabCmd + ' ' + this._tabDirPart + m.name + (m.isDir ? '/' : '')
    this._tabPartial = this.inputBuffer
    this._renderInput()
    playBeep(700, 0.04)
  }

  // ── GLITCH SYSTEM ────────────────────────────────────────────────────────

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
    const lvl   = this.currentLevel
    const total = lvl <= 15 ? 15 : 20
    this.$layer.textContent    = `LAYER: ${lvl}/${total}`
    this.$progress.style.width = `${Math.round((lvl / total) * 100)}%`
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
      setTimeout(() => { el.remove(); this._processToastQueue() }, 420)
    }, 3000)
  }

  _updateTitle() {
    const lyr = this.currentLevel
    const det = this.detection
    if (lyr === 0)   { document.title = 'BREACH v2.4.1'; return }
    if (lyr > 15)    { document.title = 'CORE ACCESS GRANTED'; return }
    const warn = det >= 80 ? `⚠⚠ ${det}% | ` : det >= 60 ? `⚠ ${det}% | ` : ''
    const total = lyr <= 15 ? 15 : 20
    document.title = `${warn}LAYER ${lyr}/${total} — BREACH`
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

  // ── PHANTOM BLEED-THROUGH ────────────────────────────────────────────────

  _startPhantomBleedthrough() {
    const GHOST_LINES = [
      '  ░ [ghost session]  ls',
      '  ░ [ghost session]  cat manifesto.txt',
      '  ░ [ghost session]  ls -a',
      '  ░ [ghost session]  cat /.phantom_trace',
      '  ░ [ghost session]  pwd',
      '  ░ [ghost session]  unlock PHANTOM',
      '  ░ [prev operator]  — reading structure, not content...',
      '  ░ [prev operator]  — checking for hidden files...',
      '  ░ [session bleed]  first letter of each line',
      '  ░ [session bleed]  P... H... A... N...',
    ]
    const schedule = () => {
      const delay = 18000 + Math.random() * 32000
      this._phantomBleedTimer = setTimeout(() => {
        if (this.currentLevel !== 10 || this.locked) return
        const text = GHOST_LINES[Math.floor(Math.random() * GHOST_LINES.length)]
        const el = document.createElement('div')
        el.className = 'line dim'
        el.style.opacity = '0.45'
        el.style.fontStyle = 'italic'
        el.textContent = text
        this.$output.appendChild(el)
        this._scrollToBottom()
        schedule()
      }, delay)
    }
    schedule()
  }

  _stopPhantomBleedthrough() {
    if (this._phantomBleedTimer) {
      clearTimeout(this._phantomBleedTimer)
      this._phantomBleedTimer = null
    }
  }

  // ── EMERGENCY PROTOCOL (Layer 11 detection spike) ────────────────────────

  _triggerEmergencyProtocol() {
    if (this._emergencyProtocolActive) return
    this._emergencyProtocolActive = true

    setTimeout(() => {
      if (this.currentLevel !== 11) return
      playAlarm(4)
      this.print('  ╔══════════════════════════════════════════════════╗', 'red')
      this.print('  ║  ⚠ EMERGENCY PROTOCOL INITIATED                       ║', 'red')
      this.print('  ║  ⚠ DETECTION SWEEP — TRIPLED RATE                     ║', 'red')
      this.print('  ║  ⚠ DURATION: 3 MINUTES                                ║', 'red')
      this.print('  ╚══════════════════════════════════════════════════╝', 'red')
      this.print('', 'empty')
      this._scrollToBottom()
    }, 2800)

    // Fast-tick: +2% every 25 seconds for 3 minutes (up to 7 ticks)
    let ticks = 0
    const maxTicks = 7
    const fastTick = setInterval(() => {
      if (!this._emergencyProtocolActive) { clearInterval(fastTick); return }
      if (this.locked || this.currentLevel !== 11) { clearInterval(fastTick); return }
      ticks++
      this._bumpDetection(2)
      if (ticks >= maxTicks) {
        clearInterval(fastTick)
        this._emergencyProtocolActive = false
        setTimeout(() => {
          if (this.currentLevel === 11) {
            this.print('', 'empty')
            this.print('  [KIMINA] Emergency protocol elapsed. Standard sweep resuming.', 'dim')
            this.print('', 'empty')
            this._scrollToBottom()
          }
        }, 500)
      }
    }, 25000)
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
    if (levelId > 20) { this._showCompletion(); return }

    this._stopPhantomBleedthrough()

    this.currentLevel         = levelId
    this.layerStartTime       = Date.now()
    this.layerWrongAttempts   = 0

    if (levelId === 15) this._unlockAchievement('layer_15', 'PAST THE WALL', 'Layer 15 cleared. The vault goes deeper.')
    if (levelId === 20) this._unlockAchievement('layer_20', 'AT THE CORE', 'Layer 20. The absolute end.')

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
      music.playbackRate = levelId <= 7 ? 1.0 : levelId <= 14 ? 1.016 : 1.032
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
        // Layer 10: start PHANTOM bleed-through ghost session
        if (levelId === 10) this._startPhantomBleedthrough()
        // Layer 11: trigger one-time emergency protocol detection spike
        if (levelId === 11) this._triggerEmergencyProtocol()
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

    if (savedLevel >= 1 && savedLevel <= 20) {
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
      { text: '  |        E Y E   S I G N A L   A C Q U I R E D        |', style: 'cyan' },
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
      { text: '  The Nomai data has been recovered.', style: 'cyan' },
      { text: '  The Eye signal is transmitting.', style: 'cyan' },
      { text: '  It has never stopped.', style: 'dim' },
      { text: '', style: 'empty' },
    ]

    // Trigger achievements for this run
    this._unlockAchievement('good_ending', 'THE FLOOR IS STILL WET', 'Good ending. You know why.')
    if (totalHints === 0 && totalWrong === 0)
      this._unlockAchievement('ghost', 'GHOST', 'No hints. No wrong answers. Flawless.')

    this._printLinesDelayed(completionLines, 50, () => {
      document.title              = 'CORE ACCESS GRANTED'
      this.$layer.textContent     = 'LAYER: 20/20'
      this.$progress.style.width  = '100%'
      this.detection = 0
      this._updateDetectionUI()

      // Set up post-game filesystem with the classified file
      this.state.fs = new Filesystem({
        dirs:  ['/'],
        files: {
          '/ORIGIN_UNKNOWN.CORE': CLASSIFIED_FILE,
          '/.verse': `O Kimi fair, whose two-and-twenty years now three
Have turned beneath the patient watch of time,
Thy northern soul, though far from Sweden's tree,
Still bears the hush of forests deep with pine.
Thy hair like autumn's gold with ginger flame,
Thine eyes the calm blue of a winter sky,
Yet fairer still the kindness in thy frame
That makes the restless world grow soft and shy.
A merry wit within thy spirit dwells,
Half thoughtful sage, half jester crowned with grin;
For laughter rings where'er thy presence swells
And gentle warmth awakens hearts therein.
Though quiet as the snow on northern land,
Thy smile alone can banish clouds from me,
As though the sun obeyed thy small command
And rose wherever thou hast chanced to be.
Thou build'st strange worlds with music, code, and art,
Where notes and numbers bend beneath thy will;
And coffee's dark companion plays its part
To wake the thoughts that seldom wander still.
Reserved thou art, as Swedish spirits tend,
Yet deep as forests where the old winds roam;
Such quiet strength no fleeting years can bend,
For steady hearts like thine are ever home.
Strange was the thread that bound our wandering days.
A friend's small path that led our fates to meet;
Till Antalya's sunlit shores with golden rays
Made dream and living truth at last complete.
Those days remain like jewels the mind shall keep,
Bright echoes resting where fond memories lie;
No passing time can cast those hours to sleep
While love remembers how they wandered by.
And now, dear Boobert, as the years unfold,
Accept these humble lines thy day to crown;
For though my words be fragile, faint, and old,
Their meaning shall not fade nor wander down.
For if all poets lost their voice above,
One phrase alone my quiet heart would prove.
Not loud nor grand, yet truest spoken through:
In gentle code, I slur you, Kimi… I slur you.`,
        },
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
