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
  {
    id: 6,
    from: 'k.chen@KIMINA-corp.int',
    to: '[IDENTITY REDACTED]',
    subject: 'I think I understand now',
    date: 'after the breach',
    postGameOnly: true,
    body: `To whoever you are —

I spent six days trying to stop the person who just
walked through our entire security system.

I built countermeasures. They didn't work.
I offered a deal. They didn't need it (or they took it —
either way, they made it to the end).

I kept looking at the logs. The access patterns.
The specific files they opened, in the specific order
they opened them.

This wasn't a hack.

You built a puzzle for someone you love, and you hid it
inside the most secure system you could find, and you
waited for them to find it.

I don't know if they made it.
I hope they did.

I won't report this breach.

  — Dr. K. Chen, Systems Architecture, Kimina Corp

P.S. The NOMAI reference was a nice touch.
     Outer Wilds. Good game.`,
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
    pad('                                                            ', 'dim'),
    pad('                          ┌────────────────────────────────┐', 'dim'),
    pad('                          │                  │                │', 'dim'),
    pad('               ┌─────────┴───────┐ ┌──────┴───────┐ ┌─────┴──────────┐', 'dim'),
    { text: `               │     OUTER SHELL   │ │  INNER VAULT  │ │       CORE       │`, style: 'dim' },
    { text: `               │     Layers  1-5   │ │  Layers 6-10  │ │   Layers 11-15   │`, style: 'dim' },
    { text: `               │      ${outer.label}   │ │   ${mid.label}  │ │     ${core.label}   │`, style: 'white' },
    pad('               └─────────────────┘ └──────────────┘ └────────────────┘', 'dim'),
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
        { text: '  nmap              port scan the target node', style: 'green' },
        { text: '  ping <host>       ping a host', style: 'green' },
        { text: '  ifconfig          show network interfaces', style: 'green' },
        { text: '  uname [-a]        show system information', style: 'green' },
        { text: '  id                show current user identity and groups', style: 'green' },
        { text: '  env               show environment variables', style: 'green' },
        { text: '  strace <process>  trace syscalls of a running process', style: 'green' },
        { text: '  base64 <encode|decode> <str>  encode or decode a base64 string', style: 'green' },
        { text: '  xxd <file>        hex dump of a file', style: 'green' },
        { text: '  scan              run vulnerability scan', style: 'green' },
        { text: '  analyze <file>    show file metadata and analyst notes', style: 'green' },
        { text: '  mail              read intercepted mail', style: 'green' },
        { text: '  man <cmd>         show command manual', style: 'green' },
        { text: '  theme <name>      change terminal theme  (green/amber/blue/red)', style: 'green' },
        { text: '  vol <up|down>     adjust background music volume', style: 'green' },
        { text: '  mute              mute background music', style: 'green' },
        { text: '  unmute            unmute background music', style: 'green' },
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

      // Virtual system files — not in the puzzle filesystem
      const VIRTUAL_FILES = {
        '/etc/passwd': [
          'root:x:0:0:root:/root:/bin/bash',
          'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin',
          'sshd:x:103:65534::/run/sshd:/usr/sbin/nologin',
          'kimina_sec:x:500:500:Kimina Security Daemon:/home/kimina_sec:/bin/bash',
          'k.chen:x:501:501:Dr K. Chen — Systems Architecture:/home/k.chen:/bin/bash',
          'r.fromm:x:502:502:Director R. Fromm:/home/r.fromm:/bin/bash',
          'vodkashotsandvolvos:x:1000:1000::/home/vodkashotsandvolvos:/bin/bash',
        ],
        '/etc/hosts': [
          '127.0.0.1       localhost',
          '127.0.1.1       BREACH-SYS',
          '10.44.7.9       KIMINA-MAINFRAME-SEC',
          '10.44.7.1       KIMINA-GATEWAY',
          '10.44.0.1       KIMINA-CORP-HQ',
          '',
          '# KIMINA internal routing — DO NOT MODIFY',
          '# Last modified: k.chen@KIMINA-corp.int',
        ],
        '/etc/hostname': ['BREACH-SYS'],
        '/proc/version': [
          'Linux version 5.15.0-KIMINA (kimina_build@KIMINA-corp.int)',
          '(gcc version 11.3.0) #1 SMP Tue Sep 14 12:00:00 UTC 2021',
        ],
        '/proc/uptime': ['847 days, 14:31:22 — node has not rebooted since deployment'],
      }

      // Resolve against virtual paths (always absolute)
      const virtualKey = arg1.startsWith('/') ? arg1
        : (state.cwd === '/' ? '/' + arg1 : state.cwd + '/' + arg1)
      if (VIRTUAL_FILES[virtualKey]) {
        return [
          { text: '', style: 'empty' },
          ...VIRTUAL_FILES[virtualKey].map(t => ({ text: t, style: 'bright' })),
          { text: '', style: 'empty' },
        ]
      }

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
        nmap:     'nmap              —  Port scan KIMINA-MAINFRAME-SEC (10.44.7.9).',
        ping:     'ping <HOST>       —  Ping a host. Only 10.44.7.9 and localhost are reachable.',
        ifconfig: 'ifconfig          —  Show network interfaces and IP configuration.',
        uname:    'uname [-a]        —  Print system information. -a shows full kernel string.',
        id:       'id                —  Print current user UID, GID, and group memberships.',
        env:      'env               —  Print all environment variables for this session.',
        strace:   'strace <PROCESS>  —  Trace syscalls of a running process. Try: strace breach_client',
        base64:   'base64 <encode|decode> <STR>  —  Encode or decode a base64 string.',
        xxd:      'xxd <FILE>        —  Hex dump of a file. Alias: hexdump',
        scan:     'scan            —  Run a vulnerability scan on this node.',
        analyze:  'analyze <FILE>  —  Display metadata and analyst notes for a file. Does not reveal answers.',
        mail:    'mail            —  Read intercepted internal mail. Use: mail read <n>',
        theme:   'theme <name>    —  Change terminal color theme. Options: green amber blue red',
        vol:     'vol <up|down>   —  Adjust background music volume.',
        mute:    'mute            —  Mute background music.',
        unmute:  'unmute          —  Unmute background music (restores default volume).',
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
      const isPostGame = state.levelId === 16
      const visibleMail = MAIL.filter(m => !m.postGameOnly || isPostGame)
      if (arg1 === 'read') {
        const id = parseInt(argArr[1])
        if (!id) return [{ text: 'Usage: mail read <number>', style: 'yellow' }]
        const email = MAIL.find(m => m.id === id)
        if (!email) return err(`mail: no message numbered ${id}`)
        if (email.postGameOnly && !isPostGame) return err(`mail: no message numbered ${id}`)
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
      const postGameNote = isPostGame
        ? [{ text: '  > New mail available: email 6 — unlocked after breach.', style: 'yellow' }, { text: '', style: 'empty' }]
        : []
      return [
        { text: '', style: 'empty' },
        { text: 'INTERCEPTED MAIL — Kimina Corp INTERNAL', style: 'cyan' },
        { text: '═'.repeat(60), style: 'dim' },
        { text: '', style: 'empty' },
        ...postGameNote,
        { text: '  #  FROM                          SUBJECT                    DATE', style: 'dim' },
        { text: '  ─  ────────────────────────── ──────────────────────  ────────────', style: 'dim' },
        ...visibleMail.map(m => ({
          text: `  ${m.id}  ${m.from.slice(0, 29).padEnd(30)} ${m.subject.slice(0, 25).padEnd(26)} ${m.date}`,
          style: m.id === 4 ? 'yellow' : m.id === 6 ? 'cyan' : 'green',
        })),
        { text: '', style: 'empty' },
        { text: '  Use: mail read <number>', style: 'dim' },
        { text: '', style: 'empty' },
      ]
    }

    // ── ANALYZE ─────────────────────────────────────────
    case 'analyze': {
      const fs = state.fs
      if (!fs) return err('no filesystem mounted')
      if (!arg1) return [{ text: 'Usage: analyze <file>', style: 'yellow' }]
      const filePath = fs.resolve(state.cwd, arg1)
      if (fs.isDir(filePath)) return err(`analyze: ${arg1}: Is a directory`)
      if (!fs.isFile(filePath)) return err(`analyze: ${arg1}: No such file or directory`)

      const fname = filePath.split('/').pop()

      const META = {
        'manifesto.txt': {
          type: 'TEXT/ASCII — RECOVERED DOCUMENT',
          created: '2023.06.14  02:47:03 UTC',
          size: '734 bytes',
          note: 'Recovered from dead drop. Origin unknown. The content may be irrelevant. Look at structure.',
        },
        'integrity_report.log': {
          type: 'LOG — AUTOMATED AUDIT OUTPUT',
          created: '04:31:22 UTC (current session)',
          size: '1.2 KB',
          note: 'Generated by security_daemon v4.1. One process failed the CRC check. The anomaly is flagged.',
        },
        'algorithm.pseudo': {
          type: 'PSEUDOCODE — ITERATIVE TRACE REQUIRED',
          created: '2019.08.02  12:00:00 UTC',
          size: '288 bytes',
          note: 'Variables persist across iterations. Trace each step in order. One mistake propagates forward.',
        },
        'xor_cipher.txt': {
          type: 'ENCRYPTED — SINGLE-BYTE XOR CIPHER',
          created: '2021.11.30  03:15:11 UTC',
          size: '512 bytes',
          note: 'Key byte is provided in the file. XOR is self-inverse — the same operation decrypts.',
        },
        'vault_msg.enc': {
          type: 'ENCRYPTED — POLYALPHABETIC VIGENERE CIPHER',
          created: '2020.04.18  22:08:30 UTC',
          size: '401 bytes',
          note: 'Repeating key cipher. The key is a 4-letter word hidden elsewhere on this node.',
        },
        'encrypted_msg.txt': {
          type: 'ENCRYPTED — MONOALPHABETIC CAESAR SHIFT',
          created: '2023.02.14  07:55:00 UTC',
          size: '302 bytes',
          note: 'Shift value is not provided directly. Derive it from context on this node.',
        },
        'transmission.morse': {
          type: 'SIGNAL LOG — MORSE ENCODED TRANSMISSION',
          created: '2019.07.07  00:00:01 UTC',
          size: '184 bytes',
          note: 'Deep signal. Origin unknown. Pre-dates this node by several years. Still repeating.',
        },
        'ORIGIN_UNKNOWN.CORE': {
          type: 'CORE FILE — CLASSIFICATION BEYOND TOP SECRET',
          created: '[TIMESTAMP SCRUBBED]',
          size: '[REDACTED]',
          note: 'This file was not installed. It was placed here intentionally. The Architect left it.',
        },
        '.confession': {
          type: 'PRIVATE — ACCESS LOG: 1 READ (ARCHITECT ONLY)',
          created: '[REDACTED]',
          size: '[REDACTED]',
          note: 'Metadata access is not authorised on this file. The Architect is watching.',
        },
      }

      const m = META[fname]
      if (!m) {
        return [
          { text: '', style: 'empty' },
          { text: `  FILE ANALYSIS — ${fname}`, style: 'cyan' },
          { text: '  ─────────────────────────────────────────────────', style: 'dim' },
          { text: `  PATH     : ${filePath}`, style: 'dim' },
          { text: `  TYPE     : TEXT/ASCII`, style: 'dim' },
          { text: `  ACCESS   : 04:31:22 (this session)`, style: 'dim' },
          { text: '', style: 'empty' },
          { text: '  No metadata annotations on record for this file.', style: 'dim' },
          { text: '', style: 'empty' },
        ]
      }

      return [
        { text: '', style: 'empty' },
        { text: `  FILE ANALYSIS — ${fname}`, style: 'cyan' },
        { text: '  ─────────────────────────────────────────────────', style: 'dim' },
        { text: `  PATH     : ${filePath}`, style: 'dim' },
        { text: `  TYPE     : ${m.type}`, style: 'dim' },
        { text: `  CREATED  : ${m.created}`, style: 'dim' },
        { text: `  SIZE     : ${m.size}`, style: 'dim' },
        { text: '  ─────────────────────────────────────────────────', style: 'dim' },
        { text: `  NOTE     : ${m.note}`, style: 'green' },
        { text: '', style: 'empty' },
      ]
    }

    // ── BASE64 ──────────────────────────────────────────
    case 'base64': {
      const op    = arg1.toLowerCase()
      const input = argArr.slice(1).join(' ').trim()
      if (!arg1) return [
        { text: '', style: 'empty' },
        { text: '  Usage: base64 encode <string>', style: 'yellow' },
        { text: '         base64 decode <string>', style: 'yellow' },
        { text: '', style: 'empty' },
      ]
      if (op === 'decode' || op === 'd') {
        if (!input) return err('base64: missing input string')
        try {
          const decoded = atob(input)
          return [
            { text: '', style: 'empty' },
            { text: `  INPUT  : ${input}`, style: 'dim' },
            { text: `  OUTPUT : ${decoded}`, style: 'bright' },
            { text: '', style: 'empty' },
          ]
        } catch {
          return err('base64: invalid base64 — check padding and characters')
        }
      }
      if (op === 'encode' || op === 'e') {
        if (!input) return err('base64: missing input string')
        try {
          const encoded = btoa(input)
          return [
            { text: '', style: 'empty' },
            { text: `  INPUT  : ${input}`, style: 'dim' },
            { text: `  OUTPUT : ${encoded}`, style: 'bright' },
            { text: '', style: 'empty' },
          ]
        } catch {
          return err('base64: encoding failed — non-ASCII characters detected')
        }
      }
      return err(`base64: unknown operation '${op}' — use encode or decode`)
    }

    // ── XXD / HEXDUMP ────────────────────────────────────
    case 'xxd':
    case 'hexdump': {
      const fs = state.fs
      if (!fs) return err('no filesystem mounted')
      if (!arg1) return err(`${cmd}: missing operand`)
      const filePath = fs.resolve(state.cwd, arg1)
      if (fs.isDir(filePath))  return err(`${cmd}: ${arg1}: Is a directory`)
      if (!fs.isFile(filePath)) return err(`${cmd}: ${arg1}: No such file or directory`)
      const content  = fs.read(filePath)
      const bytes    = []
      const limit    = Math.min(content.length, 256)
      for (let i = 0; i < limit; i++) bytes.push(content.charCodeAt(i))
      const lines = [{ text: '', style: 'empty' }]
      for (let i = 0; i < bytes.length; i += 16) {
        const chunk    = bytes.slice(i, i + 16)
        const offset   = i.toString(16).padStart(8, '0')
        const hexPart  = chunk.map(b => b.toString(16).padStart(2, '0')).join(' ').padEnd(47)
        const asciiPart = chunk.map(b => (b >= 0x20 && b < 0x7f) ? String.fromCharCode(b) : '.').join('')
        lines.push({ text: `  ${offset}: ${hexPart}  ${asciiPart}`, style: 'dim' })
      }
      if (content.length > 256)
        lines.push({ text: `  ... (${content.length - 256} more bytes truncated)`, style: 'dim' })
      lines.push({ text: '', style: 'empty' })
      return lines
    }

    // ── EASTER EGGS + UNKNOWN ────────────────────────────
    default: {
      if (['sudo', 'su'].includes(cmd))
        return [{ text: 'vodkashotsandvolvos is not in the sudoers file. This incident will be reported.', style: 'red' }]
      if (cmd === 'ssh')
        return [{ text: `ssh: connect to host ${arg1 || 'target'} port 22: Connection refused`, style: 'red' }]
      if (cmd === 'nmap') return [
        { text: '', style: 'empty' },
        { text: `  Starting Nmap 7.94 ( https://nmap.org ) at 04:31:22 UTC`, style: 'dim' },
        { text: `  Nmap scan report for KIMINA-MAINFRAME-SEC (10.44.7.9)`, style: 'green' },
        { text: `  Host is up (0.00031s latency).`, style: 'dim' },
        { text: '', style: 'empty' },
        { text: '  PORT      STATE  SERVICE        VERSION', style: 'dim' },
        { text: '  ───────   ─────  ─────────────  ────────────────────────────────────', style: 'dim' },
        { text: '  22/tcp    open   ssh            OpenSSH 8.9p1 Ubuntu', style: 'green' },
        { text: '  443/tcp   open   https          Kimina Corp Secure API v3', style: 'green' },
        { text: '  5432/tcp  open   postgresql     PostgreSQL 14.2', style: 'green' },
        { text: '  8080/tcp  open   http           Kimina Internal Dashboard', style: 'green' },
        { text: '  9001/tcp  open   ???            [UNREGISTERED]', style: 'yellow' },
        { text: '                                  source: 192.168.0.1 (YOU)', style: 'yellow' },
        { text: '                                  process: breach_client --stealth', style: 'red' },
        { text: '', style: 'empty' },
        { text: '  Nmap done: 1 IP address (1 host up) scanned in 0.47 seconds', style: 'dim' },
        { text: '', style: 'empty' },
        { text: '  ⚠  Port 9001 is your session. You are visible in this scan.', style: 'red' },
        { text: '', style: 'empty' },
      ]
      if (cmd === 'ifconfig' || cmd === 'ip') return [
        { text: '', style: 'empty' },
        { text: '  eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500', style: 'green' },
        { text: '        inet 10.44.7.9   netmask 255.255.255.0   broadcast 10.44.7.255', style: 'green' },
        { text: '        inet6 fe80::1a4b:c8ff:fede:f291  prefixlen 64  scopeid 0x20', style: 'dim' },
        { text: '        ether 00:1a:4b:de:f2:91  txqueuelen 1000  (Ethernet)', style: 'dim' },
        { text: '        RX packets 847293  bytes 1.2 GB', style: 'dim' },
        { text: '        TX packets 312847  bytes 284 MB', style: 'dim' },
        { text: '', style: 'empty' },
        { text: '  lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536', style: 'green' },
        { text: '       inet 127.0.0.1  netmask 255.0.0.0', style: 'dim' },
        { text: '       inet6 ::1  prefixlen 128  scopeid 0x10', style: 'dim' },
        { text: '       RX packets 1337  bytes 114688 (112.0 KiB)', style: 'dim' },
        { text: '', style: 'empty' },
      ]
      if (cmd === 'ping') return [
        { text: '', style: 'empty' },
        ...(arg1 && arg1 !== '10.44.7.9' && arg1 !== 'localhost' && arg1 !== '127.0.0.1'
          ? [
              { text: `  ping: connect: Network unreachable — outbound routes sealed.`, style: 'red' },
              { text: `  This node cannot reach external hosts.`, style: 'dim' },
            ]
          : [
              { text: `  PING ${arg1 || '10.44.7.9'} 56(84) bytes of data.`, style: 'dim' },
              { text: `  64 bytes from 10.44.7.9: icmp_seq=1 ttl=64 time=0.312 ms`, style: 'green' },
              { text: `  64 bytes from 10.44.7.9: icmp_seq=2 ttl=64 time=0.287 ms`, style: 'green' },
              { text: `  64 bytes from 10.44.7.9: icmp_seq=3 ttl=64 time=0.301 ms`, style: 'green' },
              { text: `  64 bytes from 10.44.7.9: icmp_seq=4 ttl=64 time=0.298 ms`, style: 'green' },
              { text: '', style: 'empty' },
              { text: `  --- 10.44.7.9 ping statistics ---`, style: 'dim' },
              { text: `  4 packets transmitted, 4 received, 0% packet loss`, style: 'dim' },
              { text: `  rtt min/avg/max/mdev = 0.287/0.299/0.312/0.009 ms`, style: 'dim' },
            ]
        ),
        { text: '', style: 'empty' },
      ]
      if (cmd === 'uname') return [
        { text: '', style: 'empty' },
        { text: args.includes('-a') || args.includes('--all')
            ? '  Linux BREACH-SYS 5.15.0-KIMINA #1 SMP Tue Sep 14 12:00:00 UTC 2021 x86_64 GNU/Linux'
            : '  Linux',
          style: 'bright' },
        { text: '', style: 'empty' },
      ]
      if (cmd === 'id') return [
        { text: '', style: 'empty' },
        { text: '  uid=1000(vodkashotsandvolvos) gid=1000(vodkashotsandvolvos)', style: 'green' },
        { text: '  groups=1000(vodkashotsandvolvos),4(adm),27(sudo),1337(breach)', style: 'green' },
        { text: '', style: 'empty' },
      ]
      if (cmd === 'env' || cmd === 'printenv') return [
        { text: '', style: 'empty' },
        { text: '  USER=vodkashotsandvolvos', style: 'dim' },
        { text: '  HOME=/home/vodkashotsandvolvos', style: 'dim' },
        { text: '  SHELL=/bin/bash', style: 'dim' },
        { text: '  TERM=xterm-256color', style: 'dim' },
        { text: '  PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', style: 'dim' },
        { text: '  BREACH_SESSION_ID=0x1892', style: 'green' },
        { text: '  BREACH_STEALTH=active', style: 'green' },
        { text: '  BREACH_TARGET=10.44.7.9', style: 'green' },
        { text: '  KIMINA_NODE=MAINFRAME-SEC', style: 'dim' },
        { text: '  WATCHDOG_BYPASS=1', style: 'red' },
        { text: '  _=/usr/bin/env', style: 'dim' },
        { text: '', style: 'empty' },
      ]
      if (cmd === 'strace') {
        if (!arg1) return err('strace: missing process name or PID')
        const target = args.trim()
        if (!target.includes('breach') && !target.includes('1892')) return [
          { text: `strace: attach: ptrace(PTRACE_SEIZE, ...): No such process`, style: 'red' },
        ]
        return [
          { text: '', style: 'empty' },
          { text: '  strace: attaching to PID 1892 (breach_client)...', style: 'dim' },
          { text: '', style: 'empty' },
          { text: '  [04:31:22.001] openat(AT_FDCWD, "/proc/self/mem", O_RDWR) = 3', style: 'green' },
          { text: '  [04:31:22.003] read(3, "\\x4b\\x49\\x4d\\x49\\x4e\\x41", 6) = 6', style: 'green' },
          { text: '  [04:31:22.007] mmap(NULL, 4096, PROT_READ|PROT_EXEC, MAP_PRIVATE) = 0x7f3a2b000000', style: 'green' },
          { text: '  [04:31:22.009] connect(4, {AF_INET, sin_addr="10.44.7.9", port=9001}, 16) = 0', style: 'green' },
          { text: '  [04:31:22.012] write(4, "[BREACH] layer_bypass --stealth", 31) = 31', style: 'green' },
          { text: '  [04:31:22.015] ptrace(PTRACE_TRACEME, 0, NULL, NULL) = -1 EPERM', style: 'yellow' },
          { text: '  [04:31:22.017] prctl(PR_SET_DUMPABLE, 0) = 0       ← hiding from core dumps', style: 'yellow' },
          { text: '  [04:31:22.019] getuid() = 1000', style: 'dim' },
          { text: '  [04:31:22.021] setuid(0) = -1 EPERM               ← tried to escalate to root. failed.', style: 'red' },
          { text: '  [04:31:22.023] write(4, "[BREACH] continuing anyway", 26) = 26', style: 'green' },
          { text: '  [04:31:22.025] nanosleep({tv_sec=0, tv_nsec=100000000}, NULL) = 0', style: 'dim' },
          { text: '  ...', style: 'dim' },
          { text: '', style: 'empty' },
          { text: '  strace: 847 syscalls logged. breach_client does not stop when attached.', style: 'yellow' },
          { text: '  strace: detaching from PID 1892...', style: 'dim' },
          { text: '', style: 'empty' },
        ]
      }
      if (cmd === 'curl' || cmd === 'wget') return [
        { text: '', style: 'empty' },
        { text: `  ${cmd}: failed to connect — outbound routes sealed.`, style: 'red' },
        { text: `  This node operates in island mode.`, style: 'dim' },
        { text: `  Reachable: 10.44.7.9 (localhost), 127.0.0.1`, style: 'dim' },
        { text: `  Unreachable: everything else.`, style: 'dim' },
        { text: '', style: 'empty' },
      ]
      if (cmd === 'python' || cmd === 'python3')
        return [{ text: 'Python is not available on this node.', style: 'dim' }]
      if (cmd === 'grep') {
        const pattern = arg1 || '.*'
        return [
          { text: '', style: 'empty' },
          { text: `  grep: scanning filesystem for "${pattern}"...`, style: 'dim' },
          { text: '', style: 'empty' },
          { text: '  /ORIGIN_UNKNOWN.CORE:1:   BREACH is a letter.', style: 'green' },
          { text: '  /ORIGIN_UNKNOWN.CORE:2:   The fifteen layers are not obstacles.', style: 'green' },
          { text: '  /ORIGIN_UNKNOWN.CORE:3:   They are sentences.', style: 'green' },
          { text: '', style: 'empty' },
          { text: '  grep: 3 matches — /ORIGIN_UNKNOWN.CORE', style: 'dim' },
          { text: '  grep: 0 matches — all other files', style: 'dim' },
          { text: '', style: 'empty' },
          { text: '  Note: full grep is disabled on this node.', style: 'dim' },
          { text: '        This file is the only thing the system cannot hide from a search.', style: 'dim' },
          { text: '', style: 'empty' },
        ]
      }
      if (cmd === 'find')
        return [{ text: `find: disabled on this node. Try cat and ls.`, style: 'dim' }]
      if (cmd === 'vim' || cmd === 'nano' || cmd === 'emacs')
        return [{ text: `${cmd}: read-only filesystem. You can only look, not touch.`, style: 'dim' }]
      if (cmd === 'exit' || cmd === 'quit')
        return [{ text: 'There is no exit. Only forward.', style: 'dim' }]
      if (cmd === 'reset' || cmd === 'theme' || cmd === 'vol')
        return []  // handled by terminal.js
      if (cmd === 'mute')   return [{ text: '__VOL__ mute',   style: 'internal' }]
      if (cmd === 'unmute') return [{ text: '__VOL__ unmute', style: 'internal' }]

      // ── STOP AUDIO ─────────────────────────────────────
      if (cmd === 'stop')
        return [{ text: '__STOP_AUDIO__', style: 'internal' }]

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

      // ── EASTER EGG: PRODUCE ────────────────────────────
      if (cmd === 'produce') return [
        { text: '', style: 'empty' },
        { text: '  [ AUDIO ENGINE — SESSION ACTIVE ]', style: 'cyan' },
        { text: '', style: 'empty' },
        { text: '  TRACK 1  ▓▓▓▓▓▓▓░░░░░░░░░░░░░  [ KICK  ]  -6dB', style: 'green' },
        { text: '  TRACK 2  ░░░▓▓▓▓▓▓▓▓░░░░░░░░░  [ BASS  ]  -9dB', style: 'green' },
        { text: '  TRACK 3  ░░░░░░░▓▓▓▓▓▓▓░░░░░░  [ SYNTH ]  -12dB', style: 'dim' },
        { text: '  TRACK 4  ▓░░▓░░▓░░▓░░▓░░▓░░▓░  [ PERC  ]  -14dB', style: 'dim' },
        { text: '  MASTER   ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░  [ MIX   ]  -3dB', style: 'yellow' },
        { text: '', style: 'empty' },
        { text: '  "Every EQ cut is a structural choice."', style: 'bright' },
        { text: '  "You just call it a drop."', style: 'dim' },
        { text: '', style: 'empty' },
      ]

      // ── EASTER EGG: ABLETON ────────────────────────────
      if (cmd === 'ableton') return [
        { text: '', style: 'empty' },
        { text: '  [ ◉ PLAYBACK ACTIVE ]', style: 'cyan' },
        { text: '', style: 'empty' },
        { text: '  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌', style: 'dim' },
        { text: '  TRACK    ableton.mp3', style: 'green' },
        { text: '  START    0:18', style: 'dim' },
        { text: '  VOL      ▓▓▓▓▓▓▓▓▓▓▓▓░░░░  85%', style: 'green' },
        { text: '  STATUS   ▶  PLAYING', style: 'bright' },
        { text: '  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌', style: 'dim' },
        { text: '', style: 'empty' },
        { text: '  type  stop  to end playback.', style: 'dim' },
        { text: '', style: 'empty' },
        { text: '__ABLETON__', style: 'internal' },
      ]

      // ── EASTER EGG: VOLVO ──────────────────────────────
      if (cmd === 'volvo') return [
        { text: '', style: 'empty' },
        { text: '  [ VOLVO IDENTIFICATION SYSTEM v4.2 ]', style: 'cyan' },
        { text: '', style: 'empty' },
        { text: '       _______________', style: 'dim' },
        { text: '      /_______________\\', style: 'dim' },
        { text: '     /    V O L V O    \\', style: 'green' },
        { text: '    |___________________|', style: 'dim' },
        { text: '    | []   [EKN34C]  [] |', style: 'dim' },
        { text: '    |___________________|', style: 'dim' },
        { text: '     (o)             (o)', style: 'dim' },
        { text: '', style: 'empty' },
        { text: '  MAKE    : Volvo', style: 'green' },
        { text: '  STATUS  : INDESTRUCTIBLE', style: 'green' },
        { text: '  RATING  : WILL OUTLIVE ALL OF US', style: 'yellow' },
        { text: '', style: 'empty' },
      ]

      // ── EASTER EGG: PHANTOM ────────────────────────────
      if (cmd === 'phantom') return [
        { text: '', style: 'empty' },
        { text: '  [ PHANTOM TRACE ARCHIVE — RECOVERED SESSION LOG ]', style: 'red' },
        { text: '', style: 'empty' },
        { text: '  OPERATOR   : PHANTOM', style: 'dim' },
        { text: '  SESSION    : 2024.11.08 — 03:14:29 UTC', style: 'dim' },
        { text: '  MAX LAYER  : 10', style: 'dim' },
        { text: '  DURATION   : 37m 12s', style: 'dim' },
        { text: '  STATUS     : EXPELLED AT LAYER 11 — REASON UNKNOWN', style: 'red' },
        { text: '', style: 'empty' },
        { text: '  LAST RECORDED COMMAND:', style: 'dim' },
        { text: '  vodkashotsandvolvos@BREACH-SYS:/$ cat /.phantom_trace', style: 'yellow' },
        { text: '', style: 'empty' },
        { text: '  [LOG FRAGMENT] PHANTOM\'s final note:', style: 'dim' },
        { text: '  "I got to layer 10. The manifesto. PHANTOM."', style: 'bright' },
        { text: '  "I don\'t know what this system IS."', style: 'bright' },
        { text: '  "I don\'t know who built it or why."', style: 'bright' },
        { text: '  "But whoever you are reading this —"', style: 'bright' },
        { text: '  "— finish it."', style: 'bright' },
        { text: '', style: 'empty' },
        { text: '  [SESSION EXPIRED — PHANTOM NEVER RETURNED]', style: 'red' },
        { text: '', style: 'empty' },
      ]

      // ── POST-GAME: REPLY ───────────────────────────────
      if (cmd === 'reply' || cmd === 'respond') {
        if (state.levelId !== 16)
          return err(`${cmd}: command not found`)
        // Trigger the full reply dialogue sequence
        return [{ text: '__REPLY__', style: 'internal' }]
      }

      return err(`${cmd}: command not found`)
    }
  }
}
