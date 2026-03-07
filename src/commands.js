/**
 * Process a command string and return an array of output line objects.
 * Each line: { text: string, style: string }
 *
 * Internal markers (handled by terminal.js):
 *   __CLEAR__        clear the output
 *   __SCAN__         run animated vulnerability scan
 *   __THEME__ <name> change color theme
 *   __VOL__ <dir>    adjust volume
 */

// ── INTERCEPTED MAIL ─────────────────────────────────────────────────────────

const MAIL = [
  {
    id: 1,
    from: 'r.fromm@KIMINA-corp.int',
    to: 'security@KIMINA-corp.int',
    subject: 'Re: Security audit',
    date: '14 days ago',
    body: `Director R. Fromm — CONFIDENTIAL
-----------------------------------
The audit flagged anomalies on nodes 192.168.44.x again.
This is the third incident this month.

I want those nodes isolated immediately.
No external traffic. No exceptions.

If someone is inside our system, I want to know
who they are, how they got in, and what they want.
This does not leave this thread.

  — R. Fromm, Director of Operations`,
  },
  {
    id: 2,
    from: 'k.chen@KIMINA-corp.int',
    to: 'r.fromm@KIMINA-corp.int',
    subject: 'URGENT: Anomaly in sector 9',
    date: '6 days ago',
    body: `Director Fromm,

I have been tracking the intrusion pattern for 72 hours.
This is not a script. This is not automated.

Someone is manually navigating the security layers.
They know the architecture. They understand the ciphers.
They are moving deliberately — like they designed this system.

I believe this may be the Architect themselves.
The person who built our security framework before
they disappeared four years ago.

I recommend we initiate PHANTOM PROTOCOL immediately.

  — Dr. K. Chen, Systems Architecture`,
  },
  {
    id: 3,
    from: 'UNKNOWN',
    to: '[RECIPIENT REDACTED]',
    subject: '[ENCRYPTED] you will find what you are looking for',
    date: '3 days ago',
    body: `[PARTIAL DECRYPTION — KIMINA INTERCEPT UNIT]

...you'll find it at the core...

...all 15 layers...I built them so only one person
could break through...

...the last key is the only one I couldn't encrypt...
...because it was never mine to keep...

  — A.

[END OF RECOVERABLE CONTENT]`,
  },
  {
    id: 4,
    from: 'sec_daemon@KIMINA-corp.int',
    to: 'security@KIMINA-corp.int',
    subject: 'AUTOMATED ALERT — Active intrusion in progress',
    date: 'just now',
    body: `=== AUTOMATED SECURITY ALERT — PRIORITY: CRITICAL ===

Active intrusion session detected.
Entry point  : Port 9001
User agent   : breach_client --stealth
Status       : SESSION CANNOT BE TERMINATED

The intrusion has progressed past layer 3.
Countermeasures are failing.

Detection probability increasing over time.
Manual intervention recommended.

=== END ALERT ===`,
  },
  {
    id: 5,
    from: 'intern_01@KIMINA-corp.int',
    to: 'all@KIMINA-corp.int',
    subject: 'free food in the breakroom',
    date: '22 days ago',
    body: `hey everyone,

Karen brought donuts to the breakroom on floor 1.
there's like 2 dozen of them. act fast

  — Jake (intern, systems)

p.s. the glazed ones are already going`,
  },
]

// ── FAKE PROCESS LIST ─────────────────────────────────────────────────────────

const PS_OUTPUT = [
  '',
  'USER              PID  %CPU  %MEM  COMMAND',
  '────────────────  ───  ────  ────  ──────────────────────────────────────────',
  'root                1   0.0   0.1  /sbin/init splash',
  'root              144   0.0   0.1  /usr/sbin/sshd -D',
  'KIMINA_sec         201   0.8   0.4  /opt/KIMINA/security_daemon --watch --alert=CRITICAL',
  'KIMINA_sec         389   0.2   0.2  /opt/KIMINA/logger --output=/var/log/trace.log',
  'db_admin          412   1.2   1.8  /opt/KIMINA/db_engine --port=5432 --encrypt',
  'KIMINA_sec         887   3.1   0.1  /opt/KIMINA/intrusion_detect --sensitivity=HIGH',
  'vodkashotsandvolvos  1891   0.1   0.1  -bash',
  'vodkashotsandvolvos  1892   0.3   0.2  breach_client --stealth --layers=15',
  '',
]

const TOP_OUTPUT = [
  '',
  'Kimina Corp SYSTEM MONITOR ─────────────────────── 04:31:15 UTC',
  'CPU: 31%   MEM: 67%   SWAP: 12%   UPTIME: 847 days',
  '',
  'PID   USER                  %CPU   %MEM   COMMAND',
  '────  ────────────────────  ─────  ─────  ─────────────────────────────',
  ' 887  KIMINA_sec             12.4    0.1   intrusion_detect --sensitivity=HIGH',
  ' 201  KIMINA_sec              8.1    0.4   security_daemon --watch',
  ' 412  db_admin               7.9    1.8   db_engine --port=5432',
  '1892  vodkashotsandvolvos    0.3    0.2   breach_client --stealth',
  '1891  vodkashotsandvolvos    0.1    0.1   -bash',
  '',
  '⚠  WARNING: Process 1892 (breach_client) flagged for security review.',
  '',
]

const NETSTAT_OUTPUT = [
  '',
  'Active Internet connections',
  '═══════════════════════════════════════════════════════════════',
  'Proto  Local Address           Foreign Address         State',
  '─────  ──────────────────────  ──────────────────────  ─────────────',
  'tcp    10.44.7.9:9001          192.168.0.1:49152       ESTABLISHED',
  'tcp    10.44.7.9:443           192.168.0.1:49153       ESTABLISHED',
  'tcp    10.44.7.9:22            0.0.0.0:*               LISTEN',
  'tcp    10.44.7.9:5432          0.0.0.0:*               LISTEN',
  'tcp    10.44.7.9:8080          0.0.0.0:*               LISTEN',
  '',
  '⚠  NOTE: Connection on port 9001 is UNREGISTERED.',
  '         Source: 192.168.0.1 — identity unknown.',
  '',
]

// ── NETMAP ────────────────────────────────────────────────────────────────────

function generateNetmap(levelId) {
  const s = (min, max, done) => {
    if (levelId > done)  return { label: '[BYPASSED]', style: 'dim' }
    if (levelId >= min)  return { label: '[ACTIVE]  ', style: 'yellow' }
    return               { label: '[SECURED] ', style: 'green' }
  }

  const outer = s(1, 5, 5)
  const mid   = s(6, 10, 10)
  const core  = s(11, 15, 15)

  const pad = (str, style) => ({ text: str, style })

  return [
    pad('', 'empty'),
    pad('  Kimina Corp NETWORK MAP — LIVE VIEW', 'cyan'),
    pad('  ════════════════════════════════════════════════════', 'dim'),
    pad('', 'empty'),
    pad('  [YOU] ──── [192.168.0.1] ──── [FIREWALL] ──── [KIMINA: 10.44.7.9]', 'green'),
    pad('                                                           │', 'dim'),
    pad('                           ┌───────────────────────────────┤', 'dim'),
    pad('                           │               │               │', 'dim'),
    pad('               ┌───────────┴──────┐ ┌──────┴──────┐ ┌─────┴──────────┐', 'dim'),
    { text: `               │   OUTER SHELL    │ │ INNER VAULT │ │     CORE       │`, style: 'dim' },
    { text: `               │   Layers  1-5    │ │  Layers 6-10│ │  Layers 11-15  │`, style: 'dim' },
    { text: `               │   ${outer.label}   │ │  ${mid.label}│ │  ${core.label}  │`, style: 'bright' },
    pad('               └──────────────────┘ └─────────────┘ └────────────────┘', 'dim'),
    pad('', 'empty'),
    { text: `  Current layer: ${levelId > 0 ? levelId : '--'}/15`, style: 'dim' },
    pad('', 'empty'),
  ]
}

// ── COMMAND PROCESSOR ────────────────────────────────────────────────────────

export function processCommand(input, state, onUnlock) {
  const trimmed = input.trim()
  if (!trimmed) return []

  const [cmd, ...argArr] = trimmed.split(/\s+/)
  const args = argArr.join(' ')
  const arg1 = argArr[0] || ''

  const line  = (text, style = 'green') => [{ text, style }]
  const err   = text => [{ text: `bash: ${text}`, style: 'red' }]

  switch (cmd.toLowerCase()) {

    // ── HELP ────────────────────────────────────────────
    case 'help': {
      return [
        { text: '', style: 'empty' },
        { text: 'AVAILABLE COMMANDS', style: 'cyan' },
        { text: '----------------------------------------------', style: 'dim' },
        { text: '  ls [-a] [path]    list directory contents (-a shows hidden)', style: 'green' },
        { text: '  cd <path>         change directory', style: 'green' },
        { text: '  cat <file>        print file contents', style: 'green' },
        { text: '  pwd               print working directory', style: 'green' },
        { text: '  clear             clear the terminal', style: 'green' },
        { text: '  history           show command history', style: 'green' },
        { text: '  whoami            print current user', style: 'green' },
        { text: '  ps                list running processes', style: 'green' },
        { text: '  top               system process monitor', style: 'green' },
        { text: '  netstat           show network connections', style: 'green' },
        { text: '  netmap            show network topology map', style: 'green' },
        { text: '  scan              run vulnerability scan', style: 'green' },
        { text: '  mail              read intercepted mail', style: 'green' },
        { text: '  man <cmd>         show command manual', style: 'green' },
        { text: '  theme <name>      change terminal theme  (green/amber/blue/red)', style: 'green' },
        { text: '  vol <up|down>     adjust background music volume', style: 'green' },
        { text: '  achievements      view unlocked achievements', style: 'green' },
        { text: '  reply             post-game only — respond to the message', style: 'dim' },
        { text: '  reset             wipe progress and restart', style: 'dim' },
        { text: '  unlock <answer>   submit answer for this layer', style: 'cyan' },
        { text: '  hint              request a hint  ⚠ costs +10% detection', style: 'yellow' },
        { text: '', style: 'empty' },
        { text: '  Tab               autocomplete filenames', style: 'dim' },
        { text: '', style: 'empty' },
      ]
    }

    // ── WHOAMI ──────────────────────────────────────────
    case 'whoami':
      return line('vodkashotsandvolvos', 'bright')

    // ── PWD ─────────────────────────────────────────────
    case 'pwd':
      return line(state.cwd, 'bright')

    // ── CLEAR ───────────────────────────────────────────
    case 'clear':
      return [{ text: '__CLEAR__', style: 'internal' }]

    // ── HISTORY ─────────────────────────────────────────
    case 'history': {
      if (!state.history || state.history.length === 0) return line('(no history)', 'dim')
      return state.history.map((h, i) => ({
        text: `  ${String(i + 1).padStart(3)}  ${h}`,
        style: 'dim',
      }))
    }

    // ── LS ──────────────────────────────────────────────
    case 'ls': {
      const fs = state.fs
      if (!fs) return err('no filesystem mounted')
      const showHidden = argArr.includes('-a')
      const pathArg    = argArr.find(a => !a.startsWith('-'))
      const targetPath = pathArg ? fs.resolve(state.cwd, pathArg) : state.cwd
      if (!fs.isDir(targetPath)) {
        if (fs.isFile(targetPath)) return err(`ls: ${pathArg}: Not a directory`)
        return err(`ls: cannot access '${pathArg}': No such file or directory`)
      }
      const entries = fs.list(targetPath, { showHidden })
      if (entries.length === 0) return line('(empty directory)', 'dim')
      return [
        { text: '', style: 'empty' },
        ...entries.map(e => ({
          text: `  ${e.name}${e.isDir ? '/' : ''}`,
          style: e.isDir ? 'cyan' : (e.name.startsWith('.') ? 'dim' : 'green'),
        })),
        { text: '', style: 'empty' },
      ]
    }

    // ── CD ──────────────────────────────────────────────
    case 'cd': {
      const fs = state.fs
      if (!fs) return err('no filesystem mounted')
      if (!arg1 || arg1 === '~') { state.cwd = '/'; return [] }
      const target = fs.resolve(state.cwd, arg1)
      if (!fs.isDir(target)) {
        if (fs.isFile(target)) return err(`cd: ${arg1}: Not a directory`)
        return err(`cd: ${arg1}: No such file or directory`)
      }
      state.cwd = target
      return []
    }

    // ── CAT ─────────────────────────────────────────────
    case 'cat': {
      const fs = state.fs
      if (!fs) return err('no filesystem mounted')
      if (!arg1) return err('cat: missing operand')
      const filePath = fs.resolve(state.cwd, arg1)
      if (fs.isDir(filePath)) return err(`cat: ${arg1}: Is a directory`)
      if (!fs.isFile(filePath)) return err(`cat: ${arg1}: No such file or directory`)
      const content = fs.read(filePath)
      return [
        { text: '', style: 'empty' },
        ...content.split('\n').map(t => ({ text: t, style: 'bright' })),
        { text: '', style: 'empty' },
      ]
    }

    // ── MAN ─────────────────────────────────────────────
    case 'man': {
      const manuals = {
        ls:      'ls [-a] [PATH]  —  List directory. -a shows hidden dotfiles.',
        cd:      'cd <PATH>       —  Change current working directory.',
        cat:     'cat <FILE>      —  Print file contents to terminal.',
        pwd:     'pwd             —  Print current working directory.',
        clear:   'clear           —  Clear all terminal output.',
        unlock:  'unlock <ANSWER> —  Submit answer for current security layer.',
        hint:    'hint            —  Get a hint. Costs +10% detection. Max 3 per layer.',
        whoami:  'whoami          —  Print current user identity.',
        history: 'history         —  Show previously entered commands.',
        ps:      'ps              —  Show running processes on this node.',
        top:     'top             —  Live process monitor snapshot.',
        netstat: 'netstat         —  Show active network connections.',
        netmap:  'netmap          —  Show visual network topology map.',
        scan:    'scan            —  Run a vulnerability scan on this node.',
        mail:    'mail            —  Read intercepted internal mail. Use: mail read <n>',
        theme:   'theme <name>    —  Change terminal color theme. Options: green amber blue red',
        vol:     'vol <up|down>   —  Adjust background music volume.',
        reset:   'reset           —  Wipe saved progress and restart from layer 1.',
      }
      if (!arg1) return err('man: what manual page do you want?')
      const m = manuals[arg1.toLowerCase()]
      if (!m) return err(`man: no manual entry for ${arg1}`)
      return [{ text: '', style: 'empty' }, { text: m, style: 'bright' }, { text: '', style: 'empty' }]
    }

    // ── HINT ────────────────────────────────────────────
    case 'hint': {
      const puzzle = state.puzzle
      if (!puzzle) return err('no active puzzle')
      const used = state.hintsUsed ?? 0
      if (used >= puzzle.hints.length)
        return [{ text: 'No more hints available for this layer.', style: 'yellow' }]
      const hint = puzzle.hints[used]
      state.hintsUsed = used + 1
      const remaining = puzzle.hints.length - state.hintsUsed
      // Penalty — bump detection
      if (state.bumpDetection) state.bumpDetection(10)
      return [
        { text: '', style: 'empty' },
        { text: `[HINT ${used + 1}/${puzzle.hints.length}]  ⚠ Detection +10%`, style: 'yellow' },
        { text: hint, style: 'yellow' },
        { text: '', style: 'empty' },
        { text: `${remaining} hint${remaining === 1 ? '' : 's'} remaining.`, style: 'dim' },
        { text: '', style: 'empty' },
      ]
    }

    // ── UNLOCK ──────────────────────────────────────────
    case 'unlock': {
      const puzzle = state.puzzle
      if (!puzzle) return err('no active puzzle')
      if (!arg1) return [{ text: 'Usage: unlock <answer>', style: 'yellow' }]
      const answer = args.trim()
      const correct = puzzle.caseSensitive
        ? puzzle.answers.includes(answer)
        : puzzle.answers.map(a => a.toUpperCase()).includes(answer.toUpperCase())
      onUnlock(correct, answer)
      return []
    }

    // ── PS ──────────────────────────────────────────────
    case 'ps':
      return PS_OUTPUT.map(t => ({
        text: t,
        style: t.includes('vodkashotsandvolvos') ? 'yellow' : 'green',
      }))

    // ── TOP ─────────────────────────────────────────────
    case 'top':
      return TOP_OUTPUT.map(t => ({
        text: t,
        style: t.includes('vodkashotsandvolvos') ? 'yellow'
             : t.includes('WARNING') ? 'red'
             : 'green',
      }))

    // ── NETSTAT ─────────────────────────────────────────
    case 'netstat':
      return NETSTAT_OUTPUT.map(t => ({
        text: t,
        style: t.includes('NOTE') || t.includes('Source') ? 'yellow' : 'green',
      }))

    // ── NETMAP ──────────────────────────────────────────
    case 'netmap':
      return generateNetmap(state.levelId || 0)

    // ── SCAN ────────────────────────────────────────────
    case 'scan':
      return [{ text: '__SCAN__', style: 'internal' }]

    // ── THEME ───────────────────────────────────────────
    case 'theme':
      return [{ text: `__THEME__ ${arg1 || 'green'}`, style: 'internal' }]

    // ── VOL ─────────────────────────────────────────────
    case 'vol':
      return [{ text: `__VOL__ ${arg1 || 'up'}`, style: 'internal' }]

    // ── MAIL ────────────────────────────────────────────
    case 'mail': {
      if (arg1 === 'read') {
        const id = parseInt(argArr[1])
        if (!id) return [{ text: 'Usage: mail read <number>', style: 'yellow' }]
        const email = MAIL.find(m => m.id === id)
        if (!email) return err(`mail: no message numbered ${id}`)
        return [
          { text: '', style: 'empty' },
          { text: `FROM    : ${email.from}`, style: 'cyan' },
          { text: `TO      : ${email.to}`, style: 'dim' },
          { text: `SUBJECT : ${email.subject}`, style: 'bright' },
          { text: `DATE    : ${email.date}`, style: 'dim' },
          { text: '─'.repeat(52), style: 'dim' },
          { text: '', style: 'empty' },
          ...email.body.split('\n').map(t => ({ text: t, style: 'green' })),
          { text: '', style: 'empty' },
        ]
      }
      return [
        { text: '', style: 'empty' },
        { text: 'INTERCEPTED MAIL — Kimina Corp INTERNAL', style: 'cyan' },
        { text: '═'.repeat(60), style: 'dim' },
        { text: '', style: 'empty' },
        { text: '  #  FROM                          SUBJECT                    DATE', style: 'dim' },
        { text: '  ─  ───────────────────────────── ─────────────────────────  ────────────', style: 'dim' },
        ...MAIL.map(m => ({
          text: `  ${m.id}  ${m.from.slice(0, 29).padEnd(30)} ${m.subject.slice(0, 25).padEnd(26)} ${m.date}`,
          style: m.id === 4 ? 'yellow' : 'green',
        })),
        { text: '', style: 'empty' },
        { text: '  Use: mail read <number>', style: 'dim' },
        { text: '', style: 'empty' },
      ]
    }

    // ── EASTER EGGS + UNKNOWN ────────────────────────────
    default: {
      if (['sudo', 'su'].includes(cmd))
        return [{ text: 'vodkashotsandvolvos is not in the sudoers file. This incident will be reported.', style: 'red' }]
      if (cmd === 'ssh')
        return [{ text: `ssh: connect to host ${arg1 || 'target'} port 22: Connection refused`, style: 'red' }]
      if (cmd === 'nmap')
        return [
          { text: 'Starting Nmap 7.94 ( https://nmap.org )', style: 'dim' },
          { text: 'Note: All external routes are sealed on this node.', style: 'dim' },
        ]
      if (cmd === 'python' || cmd === 'python3')
        return [{ text: 'Python is not available on this node.', style: 'dim' }]
      if (cmd === 'grep' || cmd === 'find')
        return [{ text: `${cmd}: disabled on this node. Try cat and ls.`, style: 'dim' }]
      if (cmd === 'vim' || cmd === 'nano' || cmd === 'emacs')
        return [{ text: `${cmd}: read-only filesystem. You can only look, not touch.`, style: 'dim' }]
      if (cmd === 'exit' || cmd === 'quit')
        return [{ text: 'There is no exit. Only forward.', style: 'dim' }]
      if (cmd === 'reset' || cmd === 'theme' || cmd === 'vol')
        return []  // handled by terminal.js

      // ── EASTER EGG: OUTER WILDS ────────────────────────
      if (cmd === 'outerwilds') return [
        { text: '', style: 'empty' },
        { text: '  [ OUTER WILDS MEMORIAL ARCHIVE — READ-ONLY ]', style: 'cyan' },
        { text: '', style: 'empty' },
        { text: '               ·  ✦  ·', style: 'dim' },
        { text: '          ·          ·  ✦', style: 'dim' },
        { text: '       ✦      ( ☀ )      ·', style: 'yellow' },
        { text: '          ·          ·', style: 'dim' },
        { text: '               ·  ·  ✦', style: 'dim' },
        { text: '', style: 'empty' },
        { text: '  "It\'s the end of the universe."', style: 'bright' },
        { text: '  "The question isn\'t whether it ends."', style: 'bright' },
        { text: '  "The question is what you do before it does."', style: 'bright' },
        { text: '', style: 'empty' },
        { text: '  You sat with it. You figured it out alone.', style: 'dim' },
        { text: '  No guides. No hints. Just you and a universe', style: 'dim' },
        { text: '  that doesn\'t explain itself.', style: 'dim' },
        { text: '  That says a lot about who you are.', style: 'dim' },
        { text: '', style: 'empty' },
      ]

      // ── EASTER EGG: PRODUCE / ABLETON ─────────────────
      if (cmd === 'produce' || cmd === 'ableton') return [
        { text: '', style: 'empty' },
        { text: '  [ AUDIO ENGINE — SESSION ACTIVE ]', style: 'cyan' },
        { text: '', style: 'empty' },
        { text: '  TRACK 1  ▓▓▓▓▓▓▓░░░░░░░░░░░░░  [ KICK  ]  -6dB', style: 'green' },
        { text: '  TRACK 2  ░░░▓▓▓▓▓▓▓▓░░░░░░░░░  [ BASS  ]  -9dB', style: 'green' },
        { text: '  TRACK 3  ░░░░░░░▓▓▓▓▓▓▓░░░░░░  [ SYNTH ]  -12dB', style: 'dim' },
        { text: '  TRACK 4  ▓░░▓░░▓░░▓░░▓░░▓░░▓  [ PERC  ]  -14dB', style: 'dim' },
        { text: '  MASTER   ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░  [ MIX   ]  -3dB', style: 'yellow' },
        { text: '', style: 'empty' },
        { text: '  "Every EQ cut is a structural choice."', style: 'bright' },
        { text: '  "You just call it a drop."', style: 'dim' },
        { text: '', style: 'empty' },
      ]

      // ── EASTER EGG: VOLVO ──────────────────────────────
      if (cmd === 'volvo') return [
        { text: '', style: 'empty' },
        { text: '  [ VOLVO IDENTIFICATION SYSTEM v4.2 ]', style: 'cyan' },
        { text: '', style: 'empty' },
        { text: '       _______________', style: 'dim' },
        { text: '      /               \\', style: 'dim' },
        { text: '     /   V O L V O    \\', style: 'green' },
        { text: '    |_________________|', style: 'dim' },
        { text: '    | []   []   []   [] |', style: 'dim' },
        { text: '    |___________________|', style: 'dim' },
        { text: '     (o)           (o)', style: 'dim' },
        { text: '', style: 'empty' },
        { text: '  MAKE    : Volvo', style: 'green' },
        { text: '  STATUS  : INDESTRUCTIBLE', style: 'green' },
        { text: '  RATING  : WILL OUTLIVE ALL OF US', style: 'yellow' },
        { text: '', style: 'empty' },
      ]

      // ── POST-GAME: REPLY ───────────────────────────────
      if (cmd === 'reply' || cmd === 'respond') {
        if (state.levelId !== 16)
          return err(`${cmd}: command not found`)
        return [
          { text: '', style: 'empty' },
          { text: '  > connecting to [IDENTITY REDACTED]...', style: 'dim' },
          { text: '  > routing through 7 anonymous nodes...', style: 'dim' },
          { text: '', style: 'empty' },
          { text: '  [CONNECTION REFUSED]', style: 'red' },
          { text: '', style: 'empty' },
          { text: '  no reply needed.', style: 'dim' },
          { text: '  just go live your life.', style: 'dim' },
          { text: '', style: 'empty' },
        ]
      }

      return err(`${cmd}: command not found`)
    }
  }
}
