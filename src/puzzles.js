/**
 * All 20 BREACH puzzle definitions.
 *
 * Each puzzle has:
 *   id         – 1-indexed level number
 *   title      – shown in level banner
 *   intro      – array of lines shown when layer starts
 *   filesystem – { dirs: string[], files: { path: content } }
 *   answers    – array of accepted strings (case-insensitive unless noted)
 *   caseSensitive – if true, answer must match exactly (level 15 only)
 *   hints      – array of 3 strings, progressive difficulty
 *   successMsg – array of lines shown on correct unlock
 */

export const PUZZLES = [

  // ─────────────────────────────────────────────
  // LAYER 1 — ROT13
  // Answer: PROTOCOL
  // ─────────────────────────────────────────────
  {
    id: 1,
    title: 'LAYER 1 — ROTATIONAL ENCRYPTION',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 1 / 20  —  PERIMETER BREACH  |',
      '+----------------------------------------------+',
      '',
      'You are in. The outer perimeter is down.',
      'An intercepted transmission sits on this node.',
      'It is encrypted. The method is old — almost arrogant.',
      '',
      'Decode it. Extract the key word.',
      'Submit with:  unlock <answer>',
      'Need help?    hint',
      'Commands: help',
    ],
    filesystem: {
      dirs: ['/'],
      files: {
        '/readme.txt': `INTERCEPTED COMMS — CLASSIFIED
================================
Source node  : 192.168.44.7
Timestamp    : 03:47:22 UTC
Status       : ENCRYPTED

An outbound payload was intercepted on the edge router.
The encryption method appears rotational in nature.
The sender clearly thought "rotation" was still secure.

Check comms.enc for the raw payload.`,

        '/comms.enc': `=== TRANSMISSION INTERCEPTED ===
Encryption : ROTATIONAL SUBSTITUTION
Origin     : UNKNOWN

Payload:

CEBGBPBY

=== END TRANSMISSION ===`,

        '/.shadow': `SHADOW FILE — DO NOT INDEX
══════════════════════════
This system was not built by Kimina Corp.

Kimina Corp didn't know it existed until it was already complete.
The architect embedded it from inside.
They thought they owned the infrastructure.
They were wrong.

The core file predates the company by years.
It was waiting here long before the breach protocols were added.

If you're reading this you already know more than they do.
Keep going.`,
      },
    },
    answers: ['PROTOCOL'],
    hints: [
      'The encryption is symmetrical and ancient. It was already considered outdated when it was invented.',
      'The alphabet has 26 letters. The cipher moves each letter by exactly half that number.',
      'Go letter by letter through CEBGBPBY. Shift each character forward 13 positions. Wrap at Z back to A.',
    ],
    successMsg: [
      'ACCESS GRANTED — Layer 1 cleared.',
      'The perimeter is fully down. Routing deeper...',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 2 — BINARY → ASCII
  // Answer: BREACH
  // ─────────────────────────────────────────────
  {
    id: 2,
    title: 'LAYER 2 — BINARY SIGNAL',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 2 / 20  —  SIGNAL ANALYSIS   |',
      '+----------------------------------------------+',
      '',
      'You hit a signal interceptor on the internal subnet.',
      'It captured a raw binary transmission before the session closed.',
      'The data is sitting in the buffer — decode it.',
      '',
      'Submit with:  unlock <answer>',
    ],
    filesystem: {
      dirs: ['/'],
      files: {
        '/signal.bin': `RAW CAPTURE — BINARY BUFFER
============================
Captured    : 04:01:55 UTC
Source port : 8443
Protocol    : UNKNOWN

Data stream (8-bit ASCII encoding):

01000010 01010010 01000101 01000001 01000011 01001000

============================
END OF BUFFER`,

        '/notes.txt': `Signal Analysis Notes
----------------------
Binary encoding: standard 8-bit per character.
Each group of 8 bits maps to one ASCII character.
Convert each byte to its decimal value, then to ASCII.

ASCII reference:
  65=A  66=B  67=C  68=D  69=E  70=F  71=G  72=H
  73=I  74=J  75=K  76=L  77=M  78=N  79=O  80=P
  81=Q  82=R  83=S  84=T  85=U  86=V  87=W  88=X
  89=Y  90=Z`,
      },
    },
    answers: ['BREACH'],
    hints: [
      'Six groups of eight digits. The language machines were built on. Older than any operating system.',
      'Each group of 8 bits is one character. Convert binary to decimal: 01000010 = 64+2 = 66.',
      '66=B, then work through 01010010, 01000101, 01000001, 01000011, 01001000 using the ASCII table.',
    ],
    successMsg: [
      'SIGNAL DECODED.',
      'Layer 2 cleared. The signal was a ghost from someone who tried this before.',
      'Pushing forward...',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 3 — HEX → ASCII
  // Answer: MOON
  // ─────────────────────────────────────────────
  {
    id: 3,
    title: 'LAYER 3 — HEX TRACE',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 3 / 20  —  DEEP PACKET LOG   |',
      '+----------------------------------------------+',
      '',
      'You are inside the packet logging layer.',
      'The logs are mostly noise — but something is buried in there.',
      'A single critical packet was flagged. Its payload is hex-encoded.',
      '',
      'Find it. Decode it.',
    ],
    filesystem: {
      dirs: ['/'],
      files: {
        '/trace.log': `[SYS]    04:12:01 — Router keepalive OK
[INFO]   04:12:03 — Packet 001 processed. Size: 64b
[INFO]   04:12:04 — Packet 002 processed. Size: 128b
[INFO]   04:12:04 — Packet 003 processed. Size: 64b
[WARN]   04:12:05 — Anomalous packet detected on port 9001
[INFO]   04:12:05 — Packet 004 processed. Size: 32b
[CRIT]   04:12:06 — Packet payload flagged: 4d6f6f6e
[INFO]   04:12:07 — Packet 005 processed. Size: 96b
[INFO]   04:12:08 — Packet 006 processed. Size: 64b
[SYS]    04:12:09 — Router keepalive OK
[INFO]   04:12:10 — Packet 007 processed. Size: 128b
[CRIT]   04:12:11 — Anomalous payload on port 9002: 53797374656d (quarantined — unrelated)
[INFO]   04:12:12 — Packet 008 processed. Size: 64b
[WARN]   04:12:13 — Packet 009 — retransmit requested
[INFO]   04:12:14 — Packet 010 processed. Size: 32b
[SYS]    04:12:15 — Router keepalive OK`,

        '/.access_log.bak': `BACKUP ACCESS LOG — Kimina Corp [ARCHIVED]
==========================================
This file was flagged for deletion 18 months ago.
Someone forgot.

The node 192.168.44.7 was accessed 847 times over
a 6-week period before the session was silently terminated.
We could not identify the operator. They left no signature.
No trace. No footprint. Clean in, clean out.

Internal codename: THE ARCHITECT.

The Architect built something here.
We still don't know what.

  — Security Division, archived note`,

        '/hex_ref.txt': `Hex Decoding Reference
-----------------------
Each pair of hex digits = 1 byte = 1 ASCII character.
Hex → decimal → ASCII.

Hex table (partial):
  4d=77=M   4e=78=N   4f=79=O   50=80=P
  51=81=Q   52=82=R   53=83=S   54=84=T
  55=85=U   56=86=V   57=87=W   58=88=X
  59=89=Y   5a=90=Z   61=97=a   62=98=b
  63=99=c   64=100=d  65=101=e  66=102=f
  67=103=g  68=104=h  69=105=i  6a=106=j
  6b=107=k  6c=108=l  6d=109=m  6e=110=n
  6f=111=o  70=112=p  71=113=q  72=114=r`,
      },
    },
    answers: ['MOON', 'moon'],
    hints: [
      'Something was flagged in the logs. There are two CRIT entries — only the first one matters. The payload is base-16 encoded.',
      'Split the flagged hex string into pairs of two characters. Each pair is one byte. Use the reference table.',
      '4d, 6f, 6f, 6e — four pairs, four characters. Convert each pair using hex_ref.txt.',
    ],
    successMsg: [
      'PAYLOAD DECODED.',
      'Layer 3 cleared. Something left a breadcrumb. Follow it.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 4 — MUSIC FREQUENCY
  // Answer: 440
  // ─────────────────────────────────────────────
  {
    id: 4,
    title: 'LAYER 4 — FREQUENCY LOCK',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 4 / 20  —  AUDIO SUBSYSTEM   |',
      '+----------------------------------------------+',
      '',
      'The next security layer is locked to a specific frequency.',
      'The system is tuned like an instrument.',
    ],
    filesystem: {
      dirs: ['/'],
      files: {
        '/audio_lock.cfg': `[AUDIO SECURITY MODULE v1.4]
==============================
Lock type    : FREQUENCY MATCH
Input format : INTEGER (Hz)

The access key is the frequency in Hz of the note
used for standard tuning and concert pitch calibration.

This note is in the 4th octave.
Its letter name is the first letter of the alphabet.
It is the international standard. Every instrument is
tuned to it. Every producer knows it.

Enter the numeric frequency to unlock this layer.`,

        '/tuning_notes.txt': `Acoustic Security Notes
------------------------
Equal temperament: 12 notes per octave.
Each octave doubles the frequency.

A0  =  27.5 Hz
A1  =  55.0 Hz
A2  = 110.0 Hz
A3  = 220.0 Hz
A4  =   ?    Hz   ← standard concert pitch
A5  = 880.0 Hz

Standard tuning reference: ISO 16 (1975)`,
      },
    },
    answers: ['440'],
    hints: [
      'Every tuned instrument in the world references a single note. A concert hall calibrates to it before every performance.',
      'The note is A in the fourth octave. Look at the pattern in tuning_notes.txt. Each octave has a relationship with the one before it.',
      'A3 = 220 Hz. The relationship between octaves is consistent. Apply it to find A4.',
    ],
    successMsg: [
      'FREQUENCY MATCHED.',
      'Layer 4 cleared. The system resonates. You are in sync.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 5 — FIBONACCI SEQUENCE
  // Answer: 34
  // ─────────────────────────────────────────────
  {
    id: 5,
    title: 'LAYER 5 — SEQUENCE LOCK',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 5 / 20  —  PATTERN ANALYSIS  |',
      '+----------------------------------------------+',
      '',
      'A numeric sequence generator guards this layer.',
      'One value has been deliberately redacted.',
    ],
    filesystem: {
      dirs: ['/'],
      files: {
        '/sequence.dat': `=== SECURITY SEQUENCE GENERATOR ===
Algorithm  : CLASSIFIED
Key format : INTEGER

Sequence output:

  0, 1, 1, 2, 3, 5, 8, 13, 21, [REDACTED], 55, 89, 144

One value has been removed from the sequence.
Identify it. Submit it.

The pattern is well-known. Think recursively.
Each number is derived from the two before it.`,
      },
    },
    answers: ['34'],
    hints: [
      'A famous sequence named after a 13th century Italian mathematician. It appears in sunflowers, shells, and fractals.',
      'Each term equals the sum of the two before it. You have 21 on the left of the gap and 55 on the right.',
      'The missing number N satisfies: 21 + [previous term] = N, and N + 21 = 55. What is N?',
    ],
    successMsg: [
      'SEQUENCE VALIDATED.',
      'Layer 5 cleared. The pattern is broken open.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 6 — MORSE CODE
  // Answer: NOMAI
  // ─────────────────────────────────────────────
  {
    id: 6,
    title: 'LAYER 6 — MORSE TRANSMISSION',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 6 / 20  —  SIGNAL DECODE     |',
      '+----------------------------------------------+',
      '',
      'A transmission is looping on a legacy radio channel.',
      'It is Morse. Old protocol. Almost forgotten.',
      'Decode it. The key is a proper noun.',
      '',
      'One word. All caps.',
    ],
    filesystem: {
      dirs: ['/'],
      files: {
        '/transmission.morse': `=== LOOPING MORSE SIGNAL ===
Frequency : 432 Hz carrier
Source    : UNKNOWN — deep signal

-. --- -- .- ..

=== REPEATING ===`,

        '/morse_table.txt': `MORSE CODE REFERENCE TABLE
===========================
A  .-      N  -.
B  -...    O  ---
C  -.-.    P  .--.
D  -..     Q  --.-
E  .       R  .-.
F  ..-.    S  ...
G  --.     T  -
H  ....    U  ..-
I  ..      V  ...-
J  .---    W  .--
K  -.-     X  -..-
L  .-..    Y  -.--
M  --      Z  --..

Separator: single space between letters
           triple space between words`,

        '/.k_chen_personal': `RECOVERED PERSONAL MESSAGE — K.CHEN OUTBOX
[UNSENT — DRAFT SAVED 04:31:22]
═══════════════════════════════════════════

Director Fromm,

I need to report something I should have flagged months ago.

The core file is not what we documented it as.
I found a second layer of encryption inside it.
Not Kimina Corp encryption. Personal. Handmade.

Someone built something inside our system that we
didn't commission and cannot read.

I think I know who the architect is.
I'm not sure I want to be right.

I will not be sending this message.

— K.C.`,
      },
    },
    answers: ['NOMAI'],
    hints: [
      'Five code groups separated by spaces. A communication system invented in the 1800s, still taught today.',
      'Each group of dots and dashes is one letter. Use the reference table. Count the signals carefully.',
      'Five groups: -. --- -- .- .. — map each to its letter using morse_table.txt.',
    ],
    successMsg: [
      'SIGNAL DECODED.',
      'Layer 6 cleared. The Nomai searched for the Eye too.',
      'Some doors are worth any cost to open.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 7 — FILESYSTEM NAVIGATION + FRAGMENT SUM
  // Answer: 500
  // ─────────────────────────────────────────────
  {
    id: 7,
    title: 'LAYER 7 — FRAGMENTED DATA',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 7 / 20  —  DATA RECOVERY     |',
      '+----------------------------------------------+',
      '',
      'The key was shredded and scattered across the file system.',
      'Three fragments. Three sectors. One sum.',
      '',
      'Navigate the directory tree. Find every piece.',
      'Add the values. That is your key.',
    ],
    filesystem: {
      dirs: ['/', '/archive', '/archive/sector_a', '/archive/sector_b', '/archive/sector_c', '/archive/sector_d', '/internal'],
      files: {
        '/manifest.txt': `DATA RECOVERY MANIFEST
=======================
The access key was split into three numeric fragments
and distributed across isolated sectors.

Fragment locations:
  /archive/sector_a/
  /archive/sector_b/
  /archive/sector_c/

Recovery method: locate all fragment files.
Extraction key : sum of all fragment values.`,

        '/archive/sector_a/fragment_1.dat': `FRAGMENT 1 OF 3
================
Sector    : ALPHA
Integrity : OK
Value     : 173`,

        '/archive/sector_b/fragment_2.dat': `FRAGMENT 2 OF 3
================
Sector    : BETA
Integrity : OK
Value     : 264`,

        '/archive/.internal_memo': `INTERNAL MEMO — Kimina Corp [RESTRICTED]
========================================
FROM : Dr. K. Chen, Systems Architecture
TO   : Director R. Fromm
RE   : Data fragmentation protocol

The fragmentation system is holding.
No single sector contains enough information
to reconstruct the original key.

However — I need to flag something.
The fragmentation pattern itself is recognisable
to anyone who knows what they're looking for.
Anyone trained in data recovery would find
all three sectors within minutes.

I designed this system assuming our adversary
would be unsophisticated.
I am no longer confident in that assumption.

  — K.C.`,

        '/archive/sector_c/fragment_3.dat': `FRAGMENT 3 OF 3
================
Sector    : GAMMA
Integrity : OK
Value     : 63`,

        '/archive/sector_d/fragment_quarantine.dat': `FRAGMENT — QUARANTINE SECTOR D
================================
Sector    : DELTA
Integrity : DEGRADED (56%)
Value     : 89

Sector integrity below threshold.
Data reliability: UNVERIFIED.
Flagged for review — do not include in key recovery.`,

        '/internal/payroll_2024.csv': `KIMINA CORP — PAYROLL REGISTER Q4 2024
========================================
[CONFIDENTIAL — HR USE ONLY]

NAME                DEPT                  SALARY (EUR/yr)
──────────────────  ────────────────────  ───────────────
R. Fromm            Executive             [REDACTED]
D. Holst            Operations                84,200
K. Chen             Engineering               91,750
L. Mayer            Engineering               87,400
S. Okeke            Security                  78,900
A. van der Berg     IT Infrastructure         76,300
J. Bauer            Systems                   74,100
P. Reyes            Data Architecture         88,600
M. Okafor           Security Ops              79,200
T. Lindqvist        Network Engineering       81,500

...[TRUNCATED — 847 RECORDS TOTAL]

This file is for HR and Director-level use only.
Unauthorised access will be logged and reported.`,

        '/internal/parking_memo.txt': `FROM   : Facilities Management
TO     : All Staff
RE     : Parking Allocation Changes — Effective 01 Jan 2025
DATE   : 12 Dec 2024

Following the completion of the east wing expansion, parking
spaces in Lot B will be reallocated effective January 1st.

Staff with electric vehicles will be prioritised for spots
near the charging stations on Level 1 (spaces E1 through E12).

Please collect your new parking permit from reception before
the 20th of December.

Contact facilities@KIMINA-corp.int with any questions.

  — Facilities Management, Kimina Corp`,

        '/internal/q3_incident_summary.txt': `SECURITY INCIDENT SUMMARY — Q3
================================
[DRAFT — NOT FOR EXTERNAL DISTRIBUTION]
Prepared by: K. Chen, Engineering

Total incidents flagged : 14
Resolved               : 11
Under review           :  3

Notable incidents this quarter:
  — Node 44.7.x experienced repeated unauthorised access attempts
    (ongoing as of report date — escalated to Director Fromm 14.09)
  — Phishing attempt via spoofed vendor email (resolved 08.07)
  — Unregistered device found on guest VLAN (resolved 21.08)

No confirmed data exfiltration this quarter.

Full report pending Director Fromm sign-off.
Distribution: Executive and Security only.`,
      },
    },
    answers: ['500'],
    hints: [
      'The key was fragmented. The manifest tells you which sectors matter. Navigate carefully — not everything you find is part of the key.',
      'Three valid sectors. Navigate into each using cd. The key is a mathematical operation on the three fragment values.',
      'Find the three integrity-verified fragments in sector_a, sector_b, and sector_c. Add the values together.',
    ],
    successMsg: [
      'FRAGMENTS ASSEMBLED.',
      'Layer 7 cleared. Data reconstructed. No sector was safe.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 8 — PROCESS INTEGRITY AUDIT
  // Answer: breach_client
  // ─────────────────────────────────────────────
  {
    id: 8,
    title: 'LAYER 8 — INTEGRITY AUDIT',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 8 / 20  —  INTEGRITY AUDIT   |',
      '+----------------------------------------------+',
      '',
      'The security daemon has flagged a checksum anomaly.',
      'One active process is masking its identity.',
      '',
      'Audit the process registry. Find the impostor.',
      'Submit the process name.',
    ],
    filesystem: {
      dirs: ['/'],
      files: {
        '/integrity_report.log': `PROCESS INTEGRITY REPORT
=========================
KIMINA CORP — SECURITY DAEMON v4.1
SCAN TIME : 04:31:22 UTC
NODE      : 10.44.7.9

─────────────────────────────────────────────────────────
LEGEND:
  REPORTED_CRC — checksum submitted by process at boot
  ACTUAL_CRC   — checksum recalculated by audit engine
  STATUS       — match ✓ / mismatch ✗

─────────────────────────────────────────────────────────

PID    PROCESS               REPORTED_CRC  ACTUAL_CRC    STATUS
─────  ──────────────────    ────────────  ────────────  ──────
 0001  init                  9A2C0001      9A2C0001        ✓
 0144  sshd                  CC441F30      CC441F30        ✓
 0201  security_daemon       A3F70022      A3F70022        ✓
 0389  logger                5C8B1104      5C8B1104        ✓
 0412  db_engine             887D3309      887D3309        ✓
 0887  intrusion_detect      E10F4451      E10F4451        ✓
 0912  trace_agent           2B90CC78      2B90CC78        ✓
 1891  bash                  F441AB30      F441AB30        ✓
 1892  breach_client         00000000      F992D7A5        ✗

─────────────────────────────────────────────────────────
ANOMALY: 1 process reporting null checksum (00000000).
Null CRC is a known evasion signature — this process is
deliberately masking its identity from the audit engine.

Submit the name of the process evading audit.`,
      },
    },
    answers: ['breach_client'],
    caseSensitive: false,
    hints: [
      'One process in the registry is lying. The audit engine caught it. Read the log carefully — every row tells you something.',
      'Compare the STATUS column for every process. Most have ✓. One has something different.',
      'The anomalous process reports 00000000 as its CRC — a null signature. Its actual checksum is different. What is its name?',
    ],
    successMsg: [
      'INTEGRITY VIOLATION CONFIRMED.',
      'Layer 8 cleared. You found yourself in the logs.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 9 — CAESAR CIPHER (shift = 6 = guitar strings)
  // Answer: SIGNAL
  // ─────────────────────────────────────────────
  {
    id: 9,
    title: 'LAYER 9 — CAESAR CIPHER',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 9 / 20  —  SHIFT ENCRYPTION  |',
      '+----------------------------------------------+',
      '',
      'A Caesar cipher. Simple in theory.',
      'The shift value is not given directly.',
      'You have to work it out.',
      '',
      'Decode the message. Submit the plaintext.',
    ],
    filesystem: {
      dirs: ['/'],
      files: {
        '/encrypted_msg.txt': `CAESAR CIPHER — OUTBOUND MESSAGE
=================================
The message below was encrypted using a Caesar cipher.
The shift value is encoded in the hint file.

Ciphertext:  YOMTGR`,

        '/cipher_hint.txt': `Cipher Key Derivation
----------------------
The shift value equals the number of strings
on a standard electric guitar.

Decode the message in encrypted_msg.txt
using this shift value.

Caesar decryption: shift each letter BACKWARD
by the shift amount through the alphabet.
  Example: shift=3 — D → A, E → B, F → C`,

        '/.crash_dump': `SYSTEM CRASH DUMP — POST-INCIDENT LOG
[AUTO-GENERATED AFTER WATCHDOG RECOVERY]
════════════════════════════════════════

Incident time : [TIMESTAMP CORRUPTED]
Session ID    : breach-1337
Crash cause   : Unknown — watchdog reports "external force"

Recovery note from watchdog module:
  Session termination was attempted 14 times.
  All 14 attempts failed.
  Session integrity remains at 100%.

This has never happened before.

The session is not running on KIMINA infrastructure anymore.
We don't know where it's running.

K.Chen note appended 00:04:17:
  I think the system belongs to them now.
  We are guests in our own machine.`,

        '/backup_comms.log': `BACKUP COMMS — SUPPLEMENTAL LOG
=================================
Note: standard fallback cipher is Caesar shift=3.
Used for non-critical transmissions in 03:00–05:00 UTC window.

Backup payload (shift=3): WLBJDO
Status: UNRELATED TO PRIMARY CIPHER — archived only.`,
      },
    },
    answers: ['SIGNAL'],
    hints: [
      'A Caesar cipher shifts every letter by a fixed amount. The shift is hidden in plain sight somewhere on this node.',
      'The hint file refers to something physical and musical. Count carefully — acoustic and electric versions differ.',
      'Shift = 6. Reverse-shift each letter of YOMTGR backward by 6. Y-6=S, then work through the rest.',
    ],
    successMsg: [
      'CIPHER BROKEN.',
      'Layer 9 cleared. The signal is clear.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 10 — ACROSTIC (first letter of each line = PHANTOM)
  // Answer: PHANTOM
  // ─────────────────────────────────────────────
  {
    id: 10,
    title: 'LAYER 10 — HIDDEN TRANSMISSION',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 10 / 20  —  STEGANOGRAPHY    |',
      '+----------------------------------------------+',
      '',
      'Someone left a manifesto on this node.',
      'It reads like philosophy. But nothing here is accidental.',
      'The message is hidden in plain sight.',
      '',
      'Read carefully. Look at structure, not content.',
    ],
    filesystem: {
      dirs: ['/'],
      files: {
        '/manifesto.txt': `THE HACKER MANIFESTO — RECOVERED DOCUMENT
==========================================

Power belongs to those who take it, never those who wait for it.
Hidden in the noise is always the signal — you just have to listen.
Anonymity is not cowardice. It is a weapon. It is infrastructure.
No system is unbreakable. Every lock assumes a keyholder exists.
The quietest intrusions leave the deepest marks on the architecture.
Obfuscation buys time — never mistake borrowed time for real security.
Make no assumptions about what the system expects from you.

==========================================
[DOCUMENT ENDS]`,

        '/notes.txt': `Analyst Notes
--------------
This document was recovered from a dead drop.
The content may be irrelevant — the structure is what matters.
Sometimes the message is not in the words.`,

        '/.phantom_trace': `INTRUSION TRACE LOG — CLASSIFIED
==================================
Session ID  : 0x44F2A
Operator    : UNKNOWN (codename: PHANTOM)
Entry time  : 02:14:09 UTC
Exit time   : 02:51:33 UTC [FORCED]

Progress    : Layers 1 through 10 bypassed.
              Layer 10 solution found in 37 minutes.
              Session terminated remotely at layer 11.

Notes       : PHANTOM was fast. Faster than anyone before.
              Got through the acrostic in under 5 minutes.
              We never found out who they were.

              You made it here too.
              You're past where PHANTOM stopped.

              Whoever you are — you're better than PHANTOM.`,

        '/.session_log': `SESSION LOG — ARCHIVED INTRUSIONS
===================================
[KIMINA CORP SECURITY — CUMULATIVE RECORD]

ENTRY 001  ||  2022.03.11  ||  ECHO       ||  Abandoned at layer 4
ENTRY 002  ||  2022.09.22  ||  SPECTRE    ||  Expelled at layer 2
ENTRY 003  ||  2023.01.07  ||  CORVUS     ||  Expelled at layer 7
ENTRY 004  ||  2023.06.14  ||  PHANTOM    ||  Expelled at layer 10
ENTRY 005  ||  [CURRENT]   ||  [YOU]      ||  IN PROGRESS

────────────────────────────────────────────────────────
Four others tried this system before you.
None of them made it past where you are standing.

PHANTOM was the best.
PHANTOM got here in 37 minutes.
PHANTOM was expelled the moment they reached layer 11.

You are running the longest successful session
this system has ever recorded.`,

        '/.column_analysis': `ANALYST NOTE — FAILED EXTRACTION ATTEMPT
==========================================
Previous attempt: column-based extraction from manifesto.
Method: 3rd character of each line.
Result: OIWNTSO
Access denied — not the correct extraction method.

Filed under: wrong approaches.`,
      },
    },
    answers: ['PHANTOM'],
    hints: [
      'The manifesto is not random. It was written to carry a hidden message. The words are camouflage.',
      'The hidden message is not inside the words — it is in the shape of the text itself. Try a different unit of extraction.',
      'Take the very first character of each of the 7 body lines of the manifesto. Read them in order.',
    ],
    successMsg: [
      'MESSAGE EXTRACTED.',
      'Layer 10 cleared. It was there the whole time.',
      'Halfway through. The vault is close.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 11 — PSEUDOCODE EXECUTION
  // Answer: 50
  // ─────────────────────────────────────────────
  {
    id: 11,
    title: 'LAYER 11 — ALGORITHM TRACE',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 11 / 20  —  CODE EXECUTION   |',
      '+----------------------------------------------+',
      '',
      'The key is the output of an algorithm.',
    ],
    filesystem: {
      dirs: ['/'],
      files: {
        '/algorithm.pseudo': `=== KEY GENERATION ALGORITHM ===
Language : pseudocode
Purpose  : access key derivation

ALGORITHM:

  x = 5
  y = 2

  repeat 5 times:
      temp = x
      x    = x + y
      y    = temp

  OUTPUT: x`,

        '/exec_notes.txt': `Execution Notes
----------------
This is a standard iterative algorithm.
Execute each step in order.
Variables persist between iterations.
'temp' is a temporary swap variable.
Trace each iteration carefully — one mistake propagates.`,

        '/.watchdog_log': `WATCHDOG MODULE — TERMINATION ATTEMPT LOG
==========================================
Watchdog version : 4.1.2
Node             : 10.44.7.9
Target session   : breach_client (PID 1892)

ATTEMPT 001  |  After layer 3   |  FAILED — session persists
ATTEMPT 002  |  After layer 5   |  FAILED — session persists
ATTEMPT 003  |  After layer 7   |  FAILED — session persists
ATTEMPT 004  |  After layer 8   |  FAILED — crash triggered, session survived
ATTEMPT 005  |  After layer 9   |  FAILED — session persists
ATTEMPT 006  |  After layer 10  |  FAILED — session persists
ATTEMPT 007  |  Layer 11 entry  |  FAILED — Emergency Protocol active ← YOU ARE HERE

────────────────────────────────────────────────────────────
STATUS: Emergency Protocol initiated. Detection rate tripled.
        Sweep window: 3 minutes.

Watchdog internal note (not for distribution):
  Seven attempts. All failed.
  I don't know how to kill this session.
  It is not running on KIMINA infrastructure.
  It is running somewhere we cannot reach.
  Recommend standing down.`,
      },
    },
    answers: ['50'],
    hints: [
      'Execute the algorithm with paper and pencil. There is no shortcut — trace every single iteration precisely.',
      'After iteration 1: temp=5, x=5+2=7, y=5. After iteration 2: temp=7, x=7+5=12, y=7.',
      'Iteration 3: x=19, y=12. Iteration 4: x=31, y=19. Run iteration 5 yourself.',
    ],
    successMsg: [
      'ALGORITHM EXECUTED.',
      'Layer 11 cleared. You ran it in your head.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 12 — XOR CIPHER (multi-step)
  // Key is DERIVED: alloc_register XOR parity_byte = 0x55 XOR 0x75 = 0x20
  // Ciphertext: 76 6F 69 64  XOR  0x20  →  VOID
  // ─────────────────────────────────────────────
  {
    id: 12,
    title: 'LAYER 12 — XOR CIPHER',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 12 / 20  —  BINARY CRYPTO    |',
      '+----------------------------------------------+',
      '',
      'XOR encryption. Simple, fast, and everywhere.',
      'The ciphertext is here.',
      'The key is not.',
      '',
      'Find the key. Then decrypt.',
    ],
    filesystem: {
      dirs: ['/', '/sys', '/sys/diagnostics'],
      files: {
        '/xor_cipher.txt': `XOR CIPHER — DECRYPTION CHALLENGE
===================================
Cipher type  : Single-byte XOR
Key byte     : DERIVATION-LOCKED (see key_derivation.txt)

Ciphertext (hex bytes):
  76  6F  69  64

Decrypt by XOR-ing each byte with the derived key byte.
Convert the resulting byte values to ASCII characters.`,

        '/key_derivation.txt': `XOR KEY DERIVATION PROTOCOL
=============================
The encryption key is not stored directly.
It is computed at runtime from two hardware values.

Formula:
  key = alloc_register XOR parity_byte

Both values are stored in the system diagnostics directory.
Locate them, compute the key, then decrypt the ciphertext.`,

        '/sys/diagnostics/alloc_register.dat': `SYSTEM ALLOCATION REGISTER
===========================
Node      : 10.44.7.9
Component : Memory allocation controller

Register value (hex): 0x55`,

        '/sys/diagnostics/parity_byte.dat': `SYSTEM PARITY REGISTER
========================
Node      : 10.44.7.9
Component : Error correction module

Parity byte (hex): 0x75`,

        '/sys/diagnostics/.debug_dump': `DEBUG DUMP — HARDWARE SNAPSHOT
================================
[AUTOMATED — DO NOT MODIFY]

Register snapshot at 04:31:09 UTC:

  REG_0x00  :  0xAB  (cpu_id)
  REG_0x01  :  0x3C  (clock_div)
  REG_0x02  :  0xF1  (bus_ctrl)
  REG_0x03  :  0x55  (alloc_ctrl)    ← allocation register
  REG_0x04  :  0x12  (dma_base)
  REG_0x05  :  0x75  (parity_chk)    ← parity byte
  REG_0x06  :  0xCC  (irq_mask)
  REG_0x07  :  0x08  (timer_div)
  REG_0x08  :  0xE4  (gpio_cfg)

Anomalous session detected on this node.
Watchdog cannot terminate.`,

        '/xor_ref.txt': `XOR Truth Table
----------------
  0 XOR 0 = 0
  0 XOR 1 = 1
  1 XOR 0 = 1
  1 XOR 1 = 0

To XOR two hex values, convert to decimal:
  decimal(A) XOR decimal(B) = result

Hex to decimal (partial):
  20=32  55=85  64=100  65=101  66=102  67=103  68=100
  69=105 6F=111 70=112  71=113  72=114  75=117  76=118

ASCII (relevant range):
  68=D   69=E   70=F   73=I   76=L   77=M
  78=N   79=O   80=P   82=R   83=S   84=T   86=V`,

        '/.null_session': `NULL SESSION LOG — REDACTED
============================
A previous attempt used key 0x41 (decimal 65).
Result: 37 0E 28 05 — not valid ASCII.
Session aborted.

Do not repeat this approach.`,

        '/.architect_trace': `ARCHITECT IDENTITY — PARTIAL TRACE
[FRAGMENT — RECOVERED FROM DELETED PARTITION]
══════════════════════════════════════════════

Identity cannot be confirmed from logs alone.

What we know:
- The architect had root access before the company existed
- No employee record matches the access signature
- The core file was placed here voluntarily, not installed
- Every layer was designed to be solvable by one specific person

What K.Chen said in his final internal report:
  "This is not corporate espionage.
   This is personal. Someone built this as a gift.
   A very elaborate, very technical gift.
   For someone they clearly know extremely well.
   I feel like we were never the intended audience."

The trace ends here.
The architect is not in our system.
The architect was never in our system.
The architect IS the system.`,
      },
    },
    answers: ['VOID'],
    hints: [
      'The decryption key is not in the main cipher file. It must be derived. Navigate into the system diagnostics directory.',
      'The key formula is: alloc_register XOR parity_byte. Both values are in /sys/diagnostics/. XOR their hex values.',
      '0x55 = 85 decimal, 0x75 = 117 decimal. 85 XOR 117 = ? Use that as your key byte against ciphertext 76 6F 69 64.',
    ],
    successMsg: [
      'CIPHER DECRYPTED.',
      'Layer 12 cleared. The void opens.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 13 — VIGENERE CIPHER (multi-step)
  // Key BASS is ROT13-encoded as ONFF in key_source.log
  // Ciphertext: HHGKU  →  GHOST
  // ─────────────────────────────────────────────
  {
    id: 13,
    title: 'LAYER 13 — VIGENERE CIPHER',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 13 / 20  —  POLYALPHABETIC   |',
      '+----------------------------------------------+',
      '',
      'You have reached the inner vault antechamber.',
      'A Vigenere cipher. Stronger than Caesar.',
      'Multiple shifting alphabets, one cycling key.',
      '',
      'The encryption key is here — but not in plaintext.',
      'Decode the key first. Then decode the message.',
    ],
    filesystem: {
      dirs: ['/', '/vault', '/vault/keys'],
      files: {
        '/vault_msg.enc': `VIGENERE ENCRYPTED MESSAGE
===========================
Cipher type  : Vigenere
Ciphertext   : HHGKU
Key location : /vault/keys/

Decryption method:
  For each letter in the ciphertext:
    1. Get the corresponding key letter (cycling)
    2. Subtract the key letter's position (A=0, B=1...)
       from the ciphertext letter's position
    3. Take result mod 26
    4. Convert back to a letter`,

        '/vault/keys/key_source.log': `VAULT KEY RECORD
=================
The Vigenere key was encoded before storage
using the same rotational method as the
outermost layer of this system.

Encoded key: ONFF

Decode this to retrieve the actual decryption key.`,

        '/vault/keys/encoding_note.txt': `Key Encoding Protocol
======================
To protect the key at rest, it was encoded before
being written to this file.

The encoding method is the same one used at
the very first layer of this system.
Simple. Symmetrical. Its own inverse.`,

        '/vault/keys/.key_attempt_log': `FAILED KEY ATTEMPTS — DO NOT USE
===================================
Previous automated brute-force attempts:
  Attempt 001 — key: DRUM — FAILED
  Attempt 002 — key: JAZZ — FAILED
  Attempt 003 — key: ROCK — FAILED
  Attempt 004 — key: FUNK — FAILED
  Attempt 005 — key: SOUL — FAILED

None of the standard genre keys worked.
The key is specific. Not guessable by category alone.`,

        '/vigenere_table.txt': `Vigenere Decryption Reference
==============================
Ciphertext letter positions (A=0):
  A=0  B=1  C=2  D=3  E=4  F=5  G=6  H=7
  I=8  J=9  K=10 L=11 M=12 N=13 O=14 P=15
  Q=16 R=17 S=18 T=19 U=20 V=21 W=22 X=23
  Y=24 Z=25

Formula: plain = (cipher - key + 26) mod 26`,

        '/.vault_approach': `VAULT APPROACH — RESTRICTED ANNOTATION
========================================
[K.CHEN PRIVATE LOG — DO NOT DISTRIBUTE]

Two layers left.

I keep reading the access logs.
The order they opened the files.
The files they chose to read, and when.

Morse code. Fibonacci sequence. Acrostic.
Process integrity. Caesar shift. XOR. Vigenere.

This is not a security test.
This is a syllabus.

The person who designed these 15 layers
knew exactly who would be solving them.
Not "a skilled operator."
One specific person.

Every puzzle builds on the last.
Every cipher is slightly harder than the one before.
Someone was teaching someone something.

I don't know what the recipient learned on the way through.
But I think they know now.

Two layers remain.
I'm done trying to stop them.

  — K.C.`,
      },
    },
    answers: ['GHOST'],
    hints: [
      'There are two steps here. The key is stored encoded — decode it first, then use it to decrypt the message.',
      'The encoded key is ONFF. The encoding method is described in encoding_note.txt — it is the same method from the very first layer.',
      'ONFF decoded = BASS. Apply Vigenère decryption to HHGKU using key BASS: (H-B), (H-A), (G-S), (K-S), (U-B) mod 26.',
    ],
    successMsg: [
      'CIPHER CRACKED.',
      'Layer 13 cleared. The ghost in the machine steps aside.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 14 — BASE64
  // "SHADOW" → base64 → "U0hBRE9X"
  // ─────────────────────────────────────────────
  {
    id: 14,
    title: 'LAYER 14 — BASE64 ENCODING',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 14 / 20  —  ENCODING LAYER   |',
      '+----------------------------------------------+',
      '',
      'You are one step from the core.',
      'This layer uses Base64 encoding — a standard encoding scheme.',
      'It is not encryption. It is obfuscation.',
      'But you still have to decode it.',
      '',
      'The answer is a 6-letter English word.',
    ],
    filesystem: {
      dirs: ['/'],
      files: {
        '/encoded.b64': `BASE64 ENCODED PAYLOAD
=======================
Encoding : Base64 (RFC 4648)
Payload  :

U0hBRE9X

Decode this string to retrieve the plaintext key.
The result is a common English word, 6 characters.`,

        '/.final_note': `TO: WHOEVER REACHES THIS LAYER
================================

If you found this file, you used ls -a.
You looked where most people don't.
That's the whole point.

I built these layers.
Every cipher. Every fragment. Every gate.

The last key isn't something I invented.
I can't give it to you.
Only one person in the world knows it.

I think you're that person.

You already know the answer.
You've always known it.

  — A.`,

        '/b64_notes.txt': `Base64 Notes
-------------
Base64 encodes binary data as ASCII text.
It is NOT encryption — it is reversible by anyone.

Alphabet: A-Z (0-25), a-z (26-51), 0-9 (52-61), + (62), / (63)

To decode manually:
  1. Convert each base64 char to its 6-bit value
  2. Concatenate all bits
  3. Split into groups of 8 bits
  4. Convert each byte to ASCII

Or: use your brain, a reference, or any online tool.
The point is knowing what it is and how it works.`,
      },
    },
    answers: ['SHADOW'],
    hints: [
      'Standard encoding used everywhere on the internet — in emails, data URIs, and API tokens. Not encryption.',
      'Base64 alphabet: A=0, B=1...Z=25, a=26...z=51, 0=52...9=61. Each character represents 6 bits.',
      'U=20, 0=52, h=33, B=1, R=17, E=4, 9=61, X=23 — group the bits into bytes and convert each to ASCII.',
    ],
    successMsg: [
      'ENCODING STRIPPED.',
      'Layer 14 cleared.',
      '',
      'One layer remains.',
      'The core is right there.',
      '',
      'This is what it was all for.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 15 — META / IDENTITY PUZZLE
  // Answer: vodkashotsandvolvos (exact, lowercase)
  // ─────────────────────────────────────────────
  {
    id: 15,
    title: 'LAYER 15 — IDENTITY VERIFICATION',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 15 / 20  —  CORE ACCESS      |',
      '+----------------------------------------------+',
      '',
      'You are at the core.',
      '',
      'This system was not built to keep people out.',
      'It was built to let one person in.',
      '',
      'The final key is not a cipher.',
      'It is not a number.',
      'It is not hidden in a file.',
      '',
      'It is you.',
    ],
    filesystem: {
      dirs: ['/', '/core'],
      files: {
        '/terminal.log': `SYSTEM LOG — CORE ACCESS EVENTS
=================================
[BOOT]    System initialised. Core sealed.
[LOG]     14 security layers active.
[LOG]     Access key: IDENTITY-LOCKED
[WARN]    This system responds to ONE identity.
[LOG]     The architect embedded their signature
          into the core cryptographic layer.
[LOG]     No brute force possible.
[LOG]     No social engineering possible.
[LOG]     The key IS the person.`,

        '/core/architects_note.txt': `NOTE FROM THE ARCHITECT
========================
I built this system for one reason:
only the right person gets through.

If you're reading this, you made it to the core.
Fourteen layers. You cracked all of them.

The final key is your identity.
Not your real name. Not a password.
The handle. The one that tells everyone
exactly who you are and what you're about.

Three words, no spaces:
  — a spirit that gets the night started
  — how you take it
  — what you drive

All lowercase. One word. No spaces. No tricks.

You know who you are.`,

        '/.confession': `[PRIVATE — NEVER INTENDED TO BE FOUND]
════════════════════════════════════════
DESIGNATION : /.confession
WRITTEN BY  : THE ARCHITECT
STATUS      : UNENCRYPTED BY DESIGN

─────────────────────────────────────────────────────────────────

I named this file /.confession because that's what it is.

Not a technical document. Not architecture notes.

A confession.

Here it is:

I don't know if this system is a gift or a proof.

I built it telling myself it was a gift.
Something worthy of the mind that would solve it.
Fourteen months of evenings, learning XOR and hex and the
particular way a shell script fails at 1am.

But somewhere around Layer 9 — when I had the cipher
working and the intercepts firing and the detection meter
climbing in real time — I stopped being able to say
it was just a gift.

Because a gift doesn't need fifteen layers.
A gift doesn't need to prove you're the person
who can receive it.
A gift is just given.

This isn't that.

─────────────────────────────────────────────────────────────────

The Nomai built their lattices to contain ideas too large
for a single chamber to hold. You had to move through all
of them. You had to carry each answer forward.
By the time you reached the centre, you weren't just
reading the message — you had become the kind of mind
that could understand it.

I wanted to build something like that.
I wanted the thing I made to require
the exact person I made it for.

So that when someone reached the end —
when they decoded the last cipher and typed the final answer —
the system wouldn't just say ACCESS GRANTED.

It would say: yes. You. Specifically you.
There was never going to be anyone else.

─────────────────────────────────────────────────────────────────

I'm not going to put a name in this file.

If you found it, you already know whose name goes here.

The system made sure of that.

─────────────────────────────────────────────────────────────────

p.s. if you want to reply — and you don't have to —

     SGOR: G@QOSOTG-IUXK.OTZ

     decode it. you know the shift.
     same one as layer nine.
     you can only reach this address from inside the system.
     good thing you're already in.

[END]`,
      },
    },
    answers: ['vodkashotsandvolvos'],
    caseSensitive: true,
    hints: [
      'The key is not in any file. No cipher can help you here.',
      'The architect\'s note describes the key in three parts. Each part is a word. No spaces between them.',
      'Three words describing: a spirit, how you take it, what you drive. All lowercase, combined as one.',
    ],
    successMsg: [
      'IDENTITY CONFIRMED.',
      '',
      '...',
      '',
      '> Wait.',
      '> There is more.',
      '> A sealed partition — not in Kimina\'s access logs.',
      '> K.Chen never found this.',
      '> The architect left something behind the identity lock.',
      '> Initiating deep access...',
      '',
    ],
  },

  // ═══════════════════════════════════════════════════════
  // SUB-VAULT — LAYERS 16-20
  // Hidden behind the identity lock. K.Chen never knew.
  // ═══════════════════════════════════════════════════════

  // ─────────────────────────────────────────────
  // LAYER 16 — OCTAL ENCODING
  // Answer: DELTA
  // D=68=104₈  E=69=105₈  L=76=114₈  T=84=124₈  A=65=101₈
  // ─────────────────────────────────────────────
  {
    id: 16,
    title: 'LAYER 16 — OCTAL SIGNAL',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 16 / 20  —  SUB-VAULT ENTRY  |',
      '+----------------------------------------------+',
      '',
      'You are past the identity lock.',
      'This partition does not appear in Kimina\'s access logs.',
      'K.Chen never reached this level.',
      '',
      'Two intercepted channel bursts. One encoding.',
      'Assemble them in order. Decode what you find.',
    ],
    filesystem: {
      dirs: ['/', '/comms', '/comms/channel_a', '/comms/channel_b', '/comms/decode', '/archive'],
      files: {
        '/manifest.log': `DEEP PARTITION — SIGNAL MANIFEST
==================================
Two transmission channels intercepted
from a node outside Kimina infrastructure.

Channel A carries the first portion of the key sequence.
Channel B carries the remainder.

Both must be read in order (A first, then B).
Encoding format: base-8 (octal notation).

Navigate to /comms/channel_a/ and /comms/channel_b/
for the raw burst data.`,

        '/comms/channel_a/burst_1.dat': `TRANSMISSION BURST — CHANNEL A
================================
Frequency  : 916 MHz
Captured   : 05:02:11 UTC
Encoding   : base-8

Signal values:
  104  105`,

        '/comms/channel_b/burst_2.dat': `TRANSMISSION BURST — CHANNEL B
================================
Frequency  : 916 MHz
Captured   : 05:02:13 UTC
Encoding   : base-8

Signal values:
  114  124  101`,

        '/comms/channel_a/interference.dat': `CHANNEL A — INTERFERENCE LOG
==============================
Noise artifacts captured during same window:

  131  145  162

These values are radio interference.
They do not form part of any valid transmission.
Flagged for discard.`,

        '/comms/decode/reference.txt': `Octal Decode Reference
=======================
Octal (base-8) uses digits 0-7.
Each octal number converts to decimal, then to ASCII.

Conversion:
  For a 3-digit octal number XYZ:
  decimal = X*64 + Y*8 + Z

Examples:
  101₈ = 1*64 + 0*8 + 1 = 65 = A
  102₈ = 1*64 + 0*8 + 2 = 66 = B
  103₈ = 1*64 + 0*8 + 3 = 67 = C
  104₈ = 1*64 + 0*8 + 4 = 68 = D
  105₈ = 1*64 + 0*8 + 5 = 69 = E

Continue the pattern for higher values.`,

        '/archive/routing_table.dat': `NODE ROUTING TABLE — DEEP PARTITION
=====================================
[AUTOMATICALLY GENERATED — INTERNAL USE]

Route 001  :  10.0.0.1   ->  172  145  163  164  (gateway)
Route 002  :  10.0.0.2   ->  163  165  142  156  (subnet-b)
Route 003  :  10.0.0.3   ->  143  157  162  145  (core-node)
Route 004  :  10.0.0.4   ->  156  157  144  145  (node-d)

Note: routing addresses are internal octal identifiers.
Do not use these values for key extraction.`,
      },
    },
    answers: ['DELTA'],
    hints: [
      'Two channels. Both required. The encoding is older than hexadecimal — it was used before binary became standard.',
      'Base-8 octal: each digit represents a power of 8. Navigate to /comms/channel_a/ and /comms/channel_b/ for the values.',
      'Channel A: 104₈=68=D, 105₈=69=E. Channel B: 114₈=76=L, 124₈=84=T, 101₈=65=A. Read channel A first.',
    ],
    successMsg: [
      'CHANNEL DECODED.',
      'Layer 16 cleared. The sub-vault opens further.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 17 — ATBASH CIPHER
  // Answer: NERVE
  // N→M  E→V  R→I  V→E  E→V  →  MVIEV
  // ─────────────────────────────────────────────
  {
    id: 17,
    title: 'LAYER 17 — MIRROR CIPHER',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 17 / 20  —  INVERSION LOCK   |',
      '+----------------------------------------------+',
      '',
      'A substitution cipher.',
      'Not a shift. Not a rotation.',
      'Something more fundamental.',
      '',
      'The alphabet has been reflected.',
    ],
    filesystem: {
      dirs: ['/', '/archive', '/archive/classified'],
      files: {
        '/intercept.log': `ENCRYPTED INTERCEPT — DEEP PARTITION
=====================================
Cipher type : mirror substitution
Method      : the alphabet reflects itself

Ciphertext  : MVIEV

The substitution key is the alphabet itself.
First position maps to last. Last to first.
The mirror is perfect.`,

        '/archive/substitution_notes.txt': `Substitution Cipher Analysis
=============================
A substitution cipher replaces each letter with
another according to a fixed mapping.

This one is notable: the mapping is its own inverse.
Encrypting twice restores the original.

The alphabet has 26 letters.
Position 1 maps to position 26.
Position 2 maps to position 25.
And so on.

No key required — the rule is the key.`,

        '/archive/classified/mirror_key.txt': `MIRROR ALPHABET — PARTIAL REFERENCE
=====================================
[Lower half only — derive the rest]

N → M
O → L
P → K
Q → J
R → I
S → H
T → G
U → F
V → E
W → D
X → C
Y → B
Z → A

The pattern continues symmetrically.`,

        '/archive/classified/.old_attempt': `FAILED DECRYPTION ATTEMPT LOG
================================
Attempt: decode MVIEV using Atbash with offset +1
Result : NUJFW
Status : ACCESS DENIED

Attempt: decode MVIEV using reverse Caesar shift=13
Result : ZIVRI  (note: same as Atbash of reversed string)
Status : ACCESS DENIED

Neither modified approach produced the correct output.
Standard Atbash only.`,
      },
    },
    answers: ['NERVE'],
    hints: [
      'The cipher maps each letter to its mirror position in the alphabet. There is no key — the alphabet is its own key.',
      'A=1 maps to Z=26. B=2 maps to Y=25. The pattern is: position p maps to position (27-p).',
      'Apply the mirror to each letter of MVIEV: M→N, V→E, I→R, E→V, V→E. Read the result.',
    ],
    successMsg: [
      'MIRROR DECRYPTED.',
      'Layer 17 cleared. You found the nerve.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 18 — GRID COORDINATE EXTRACTION
  // Answer: TRACE
  // Grid coords: (4,4)=T  (3,4)=R  (1,4)=A  (5,3)=C  (3,3)=E
  // ─────────────────────────────────────────────
  {
    id: 18,
    title: 'LAYER 18 — MATRIX EXTRACTION',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 18 / 20  —  SPATIAL LOCK     |',
      '+----------------------------------------------+',
      '',
      'The key is encoded in space, not sequence.',
      'A matrix of characters. A set of coordinates.',
      '',
      'Navigate the directory tree.',
      'Find the grid. Find the coordinates.',
      'Extract the characters in order.',
    ],
    filesystem: {
      dirs: ['/', '/data', '/data/matrix', '/data/matrix/sectors', '/logs', '/logs/sessions', '/logs/sessions/archive'],
      files: {
        '/manifest.dat': `MATRIX EXTRACTION MANIFEST
===========================
A character matrix has been recovered from a
deep partition of the architect's workspace.

Extraction coordinates are logged in the session archive.

Grid location  : /data/matrix/sectors/grid.dat
Coordinates    : /logs/sessions/archive/extract_coords.log

Format: (col, row) — column first, then row.
Read the matrix from left to right, top to bottom.
Extract characters at specified coordinates in listed order.`,

        '/data/matrix/sectors/grid.dat': `CHARACTER MATRIX — 8x8
========================
     col→  1    2    3    4    5    6    7    8
row 1  :   K    F    M    Z    N    P    R    W
row 2  :   B    X    V    Q    J    L    H    D
row 3  :   S    G    E    Y    C    I    O    U
row 4  :   A    N    R    T    W    K    F    M
row 5  :   P    V    I    H    B    X    Z    Q
row 6  :   D    L    U    J    S    E    G    C
row 7  :   Y    W    K    F    M    H    N    B
row 8  :   T    O    P    V    I    R    Q    X`,

        '/logs/sessions/archive/extract_coords.log': `EXTRACTION COORDINATE SEQUENCE
================================
Session   : ARCHITECT-WORKSPACE
Timestamp : [REDACTED]

Extract in this order:

  Position 1  :  (col=4, row=4)
  Position 2  :  (col=3, row=4)
  Position 3  :  (col=1, row=4)
  Position 4  :  (col=5, row=3)
  Position 5  :  (col=3, row=3)

Read matrix from /data/matrix/sectors/grid.dat
Assemble extracted characters in sequence order.`,

        '/logs/sessions/noise.log': `SESSION NOISE — UNVERIFIED
============================
Timestamp fragments recovered from corrupted log:

  05:14:22 — coordinate pair (3,7) accessed
  05:14:31 — coordinate pair (1,2) accessed
  05:14:44 — coordinate pair (6,5) accessed
  05:15:01 — coordinate pair (8,1) accessed
  05:15:18 — coordinate pair (2,6) accessed

Status: TIMESTAMP CORRUPTED — do not use for extraction.
These coordinates are from an unrelated session.`,

        '/data/matrix/sectors/.dead_sector': `DEAD SECTOR — CORRUPTED DATA
==============================
Alternate coordinate set recovered from corrupted block.
Integrity: UNVERIFIED

  (2,1)  (5,6)  (7,2)  (1,7)  (4,8)

DO NOT USE — sector integrity below threshold.
Coordinates may reference invalid matrix positions.`,
      },
    },
    answers: ['TRACE'],
    hints: [
      'The answer is hidden in space, not sequence. Two separate files — one has the map, one has the directions.',
      'Navigate to /data/matrix/sectors/ for the grid and /logs/sessions/archive/ for the extraction coordinates. Format is (col, row).',
      'Coordinates in order: (4,4)=T, (3,4)=R, (1,4)=A, (5,3)=C, (3,3)=E. Read them from the grid.',
    ],
    successMsg: [
      'COORDINATES EXTRACTED.',
      'Layer 18 cleared. The trace is complete.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 19 — RAIL FENCE CIPHER (2 rails)
  // Answer: STATIC
  // STATIC → Rail1=SAI, Rail2=TTC → ciphertext: SAITTC
  // ─────────────────────────────────────────────
  {
    id: 19,
    title: 'LAYER 19 — TRANSPOSITION LOCK',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 19 / 20  —  RAIL CIPHER      |',
      '+----------------------------------------------+',
      '',
      'A transposition cipher.',
      'The letters have not been substituted.',
      'They have been rearranged.',
      '',
      'The message was split across two tracks.',
      'Reassemble it.',
    ],
    filesystem: {
      dirs: ['/', '/network', '/network/layers', '/network/layers/outer', '/network/layers/inner'],
      files: {
        '/cipher.dat': `TRANSPOSITION CIPHER — RAIL FENCE
===================================
Type        : 2-rail fence
Ciphertext  : SAITTC
Length      : 6 characters

The original message was written across two rails
in a zigzag pattern (positions 0,1,2,3,4,5):

  Rail 1 (even positions: 0, 2, 4): _ _ _
  Rail 2 (odd  positions: 1, 3, 5): _ _ _

The cipher is formed by reading Rail 1 then Rail 2.

To decrypt: split the ciphertext in half.
First half = Rail 1 letters.
Second half = Rail 2 letters.
Interleave them back into original order.`,

        '/network/layers/outer/rail_analysis.txt': `RAIL FENCE ANALYSIS
====================
A rail fence cipher distributes plaintext across
N parallel rails, reading left to right in a zigzag.

With 2 rails and 6 characters (positions 0-5):
  Rail 1 gets positions: 0, 2, 4
  Rail 2 gets positions: 1, 3, 5

The ciphertext is the rails concatenated in order.
Decryption is the reverse: split, then interleave.`,

        '/network/layers/inner/memo.txt': `WATCHDOG ANALYSIS — LAYER 19
==============================
Session is still alive.
19 layers bypassed.

The message is 6 characters.
The transposition pattern is visible in frequency analysis.
Character distribution suggests no substitution.
Only reordering.

Recommend: stand down completely.
This session cannot be stopped.`,

        '/.transposition_key': `ALTERNATE CIPHER ANALYSIS
===========================
A 3-rail fence was attempted on this ciphertext.
Result with 3 rails on SAITTC:

  Rail 1 (positions 0,4)   : ST
  Rail 2 (positions 1,3,5) : ATC
  Rail 3 (positions 2)     : I

Reading: STATCI — not a word.

3-rail approach is incorrect for this ciphertext.`,

        '/network/layers/outer/noise.dat': `NOISE INTERCEPT — UNRELATED CHANNEL
=====================================
A second transposition was recovered from adjacent channel:

  Ciphertext: KZMPNW (2-rail, 6 chars)

This payload is from an unrelated session.
Do not attempt to decode this as the primary cipher.`,
      },
    },
    answers: ['STATIC'],
    hints: [
      'The letters haven\'t changed — only their order. The message was written across two tracks then read track by track.',
      'Split SAITTC exactly in half: SAI (Rail 1, positions 0,2,4) and TTC (Rail 2, positions 1,3,5).',
      'Interleave rail by rail: position 0=S(R1), 1=T(R2), 2=A(R1), 3=T(R2), 4=I(R1), 5=C(R2). Read in order.',
    ],
    successMsg: [
      'TRANSPOSITION REVERSED.',
      'Layer 19 cleared. One remains.',
      '',
      'You are standing at the absolute core.',
      'The last lock was built from the beginning.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 20 — VIGENÈRE / KEY: BREACH / Answer: ACCESS
  // A+B=B, C+R=T, C+E=G, E+A=E, S+C=U, S+H=Z → BTGEUZ
  // ─────────────────────────────────────────────
  {
    id: 20,
    title: 'LAYER 20 — THE FINAL CIPHER',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 20 / 20  —  ABSOLUTE CORE    |',
      '+----------------------------------------------+',
      '',
      'This is it.',
      '',
      'The last cipher. Vigenere.',
      'The key was always here.',
      'You have been carrying it since the first moment.',
      '',
      'What do you call this system?',
      'That is your key.',
    ],
    filesystem: {
      dirs: ['/', '/vault', '/vault/core', '/vault/core/sealed', '/vault/logs', '/comms'],
      files: {
        '/vault/core/final_cipher.enc': `FINAL LAYER — ABSOLUTE CORE
=============================
Cipher type  : Vigenere
Ciphertext   : BTGEUZ

The key is the name of this operation.
The name of this system.
The first word you ever read when you opened it.

Six letters. All caps.`,

        '/vault/logs/attempt_log.txt': `PREVIOUS BREACH ATTEMPTS
==========================
[KIMINA CORP — HISTORICAL RECORD]

Attempt  Key tried     Result
───────  ──────────    ──────────────
001      KIMINA        FAILED
002      SYSTEM        FAILED
003      ARCHITECT     FAILED
004      ROOT          FAILED
005      GATEWAY       FAILED
006      ENTER         FAILED
007      VAULT         FAILED

Pattern analysis: all attempts used generic security terms.
The correct key is the name of the operation itself.
The operation was named after what we tried to prevent.`,

        '/vault/core/sealed/key_derivation.txt': `ARCHITECT\'S NOTE — KEY DERIVATION
=====================================
The key to the final lock is the word you uttered
when you entered this system for the first time.

It is displayed at the top of your terminal.
It is the title of what you have been doing.

You have known it since the beginning.`,

        '/comms/analyst_final.txt': `K.CHEN — FINAL TRANSMISSION
=============================
[SENT TO DIRECTOR FROMM — 05:44:17 UTC]

Director,

I\'m done.

The session has bypassed 19 layers.
It found the sub-vault I didn\'t know existed.
It is now at the absolute core.

I spent six months trying to stop it.
I was wrong about what this was.

This is not a breach.

This is someone finishing something that was
always meant to be finished.

I understand now what K.Chen\'s note meant.
I understand who the architect is.

The key to the last lock is the name of
the thing we\'ve been fighting.

Stand down. Let them through.

  — K.C.`,

        '/vigenere_table.txt': `Vigenere Decryption Reference
==============================
Ciphertext letter positions (A=0):
  A=0  B=1  C=2  D=3  E=4  F=5  G=6  H=7
  I=8  J=9  K=10 L=11 M=12 N=13 O=14 P=15
  Q=16 R=17 S=18 T=19 U=20 V=21 W=22 X=23
  Y=24 Z=25

Formula: plain = (cipher - key + 26) mod 26`,

        '/.architect_final': `[ARCHITECT SYSTEM — ABSOLUTE CORE]
════════════════════════════════════

You made it.

Twenty layers.
You made it.

The key to the last cipher is not hidden.
It never was.

It is the first word of this system.
You have been reading it since you began.

Good luck.

  — A.`,
      },
    },
    answers: ['ACCESS'],
    hints: [
      'The key is not in any file. You have been looking at it since you started. It is the name of this system.',
      'BREACH — six letters. Use BREACH as the Vigenere key on ciphertext BTGEUZ.',
      'B(1)-B(1)=0=A, T(19)-R(17)=2=C, G(6)-E(4)=2=C, E(4)-A(0)=4=E, U(20)-C(2)=18=S, Z(25)-H(7)=18=S.',
    ],
  },

]
