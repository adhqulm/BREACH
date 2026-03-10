/**
 * All 15 BREACH puzzle definitions.
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
      '|  SECURITY LAYER 1 / 15  —  PERIMETER BREACH  |',
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
      'ROT13 replaces each letter with the letter 13 positions ahead in the alphabet. It is its own inverse — apply it once to encrypt, once to decrypt.',
      'Go letter by letter: C→P, E→R, B→O, T→G, B→O, P→C, B→O, Y→L. Map each through a +13 shift.',
      'The decoded word is PROTOCOL.',
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
      '|  SECURITY LAYER 2 / 15  —  SIGNAL ANALYSIS   |',
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
      'Convert each 8-bit binary group to a decimal number, then look up the ASCII character. There are 6 groups.',
      '01000010 = 66 = B. Work through the rest: 01010010, 01000101, 01000001, 01000011, 01001000.',
      'The six characters spell BREACH.',
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
      '|  SECURITY LAYER 3 / 15  —  DEEP PACKET LOG   |',
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
[INFO]   04:12:11 — Packet 008 processed. Size: 64b
[WARN]   04:12:12 — Packet 009 — retransmit requested
[INFO]   04:12:13 — Packet 010 processed. Size: 32b
[SYS]    04:12:14 — Router keepalive OK`,

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
      'Search trace.log for the CRIT line. The payload is a hex string. Split it into 2-character pairs.',
      '4d6f6f6e → pairs: 4d 6f 6f 6e. Use the hex_ref.txt table to decode each pair.',
      '4d=M, 6f=o, 6f=o, 6e=n → Moon. Submit: unlock MOON',
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
      '|  SECURITY LAYER 4 / 15  —  AUDIO SUBSYSTEM   |',
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
      'The note is A4 — A in the fourth octave. It is the international standard for concert pitch.',
      'Each octave is double the previous. A3 = 220 Hz. A4 = 220 × 2.',
      'A4 = 440 Hz. Submit: unlock 440',
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
      '|  SECURITY LAYER 5 / 15  —  PATTERN ANALYSIS  |',
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
      'This is a famous mathematical sequence. Each term equals the sum of the two preceding terms.',
      '21 is followed by [REDACTED], then 55. What number, when added to 21, gives the next term? And does [REDACTED] + that result = 89?',
      '21 + 13 = 34. 34 + 21 = 55. The missing value is 34.',
    ],
    successMsg: [
      'SEQUENCE VALIDATED.',
      'Layer 5 cleared. The pattern is broken open.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 6 — MORSE CODE
  // Answer: NOMAI
  // (The Nomai are the ancient alien civilisation from Outer Wilds)
  // ─────────────────────────────────────────────
  {
    id: 6,
    title: 'LAYER 6 — MORSE TRANSMISSION',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 6 / 15  —  SIGNAL DECODE     |',
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
      'Split the signal by spaces to get individual letter codes: [-.]  [---]  [--]  [.-]  [..]',
      'Decode each code using the morse_table.txt: -. = N, --- = O, -- = M, .- = A, .. = I',
      'The word is NOMAI. An ancient civilisation that left their mark on everything.',
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
      '|  SECURITY LAYER 7 / 15  —  DATA RECOVERY     |',
      '+----------------------------------------------+',
      '',
      'The key was shredded and scattered across the file system.',
      'Three fragments. Three sectors. One sum.',
      '',
      'Navigate the directory tree. Find every piece.',
      'Add the values. That is your key.',
    ],
    filesystem: {
      dirs: ['/', '/archive', '/archive/sector_a', '/archive/sector_b', '/archive/sector_c', '/internal'],
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
      'Navigate with cd. Try: cd archive, then ls. Keep going deeper into each sector.',
      'Fragment values: sector_a = 173, sector_b = 264, sector_c = 63. Add them.',
      '173 + 264 + 63 = 500. Submit: unlock 500',
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
      '|  SECURITY LAYER 8 / 15  —  INTEGRITY AUDIT   |',
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
      'Run: cat integrity_report.log — look at the STATUS column. One process has ✗ instead of ✓.',
      'The anomaly is the process reporting 00000000 as its checksum. Its actual CRC is different. What is its name?',
      'The process evading the audit is the one you are running. It is at PID 1892. Submit its name: breach_client',
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
      '|  SECURITY LAYER 9 / 15  —  SHIFT ENCRYPTION  |',
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
      },
    },
    answers: ['SIGNAL'],
    hints: [
      'A standard electric guitar has 6 strings. The shift is 6. Shift each letter back 6 positions.',
      'Y-6=S, O-6=I, M-6=G, T-6=N, G-6=A, R-6=L. Use modular arithmetic: A=0, Z=25, wrap around.',
      'The plaintext is SIGNAL.',
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
      '|  SECURITY LAYER 10 / 15  —  STEGANOGRAPHY    |',
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
      },
    },
    answers: ['PHANTOM'],
    hints: [
      'The key is hidden in the structure of the manifesto, not in its content. Read the first character of each line.',
      'Take the first letter of each of the 7 lines of the manifesto body (after the header).',
      'P-H-A-N-T-O-M. The word is PHANTOM.',
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
      '|  SECURITY LAYER 11 / 15  —  CODE EXECUTION   |',
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
      'Trace each iteration. After iter 1: temp=5, x=5+2=7, y=5. After iter 2: temp=7, x=7+5=12, y=7.',
      'Iter 3: x=12+7=19, y=12. Iter 4: x=19+12=31, y=19. Iter 5: x=31+19=50, y=31.',
      'The output is 50.',
    ],
    successMsg: [
      'ALGORITHM EXECUTED.',
      'Layer 11 cleared. You ran it in your head.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 12 — XOR CIPHER
  // Answer: VOID
  // Ciphertext bytes: 76 6F 69 64 XOR 0x20 = VOID
  // ─────────────────────────────────────────────
  {
    id: 12,
    title: 'LAYER 12 — XOR CIPHER',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 12 / 15  —  BINARY CRYPTO    |',
      '+----------------------------------------------+',
      '',
      'XOR encryption. Simple, fast, and everywhere.',
      'The ciphertext and key are both here.',
      'XOR is reversible — the same operation decrypts.',
      '',
      'Work byte by byte. The result is a 4-letter word.',
    ],
    filesystem: {
      dirs: ['/'],
      files: {
        '/xor_cipher.txt': `XOR CIPHER — DECRYPTION CHALLENGE
===================================
Cipher type  : Single-byte XOR
Key byte     : 0x20

Ciphertext (hex bytes):
  76  6F  69  64

Decrypt by XOR-ing each byte with the key byte (0x20).
Convert the resulting byte values to ASCII characters.`,

        '/xor_ref.txt': `XOR Truth Table
----------------
  0 XOR 0 = 0
  0 XOR 1 = 1
  1 XOR 0 = 1
  1 XOR 1 = 0

To XOR two hex values:
  Convert both to binary, XOR each bit pair, convert back.

  OR simply: decimal(A) XOR decimal(B) = result

Hex to decimal (partial):
  20=32  56=86  64=100  65=101  66=102  67=103  68=100
  69=105 6F=111 70=112  71=113  72=114  76=118

ASCII (relevant range):
  68=D   69=E   70=F   73=I   76=L   77=M
  78=N   79=O   80=P   82=R   83=S   84=T   86=V`,

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
      'XOR each ciphertext byte with the key byte 0x20 (decimal 32). Convert results to ASCII.',
      '0x76 XOR 0x20: 118 XOR 32 = 86 = V. 0x6F XOR 0x20: 111 XOR 32 = 79 = O. Continue.',
      '86=V, 79=O, 73=I, 68=D → VOID.',
    ],
    successMsg: [
      'CIPHER DECRYPTED.',
      'Layer 12 cleared. The void opens.',
    ],
  },

  // ─────────────────────────────────────────────
  // LAYER 13 — VIGENERE CIPHER
  // Key: BASS  |  Ciphertext: HHGKU  |  Plaintext: GHOST
  // ─────────────────────────────────────────────
  {
    id: 13,
    title: 'LAYER 13 — VIGENERE CIPHER',
    intro: [
      '+----------------------------------------------+',
      '|  SECURITY LAYER 13 / 15  —  POLYALPHABETIC   |',
      '+----------------------------------------------+',
      '',
      'You have reached the inner vault antechamber.',
      'A Vigenere cipher. Stronger than Caesar.',
      'Multiple shifting alphabets, one cycling key.',
      '',
      'The encryption key is hidden elsewhere on this node.',
      'Find it. Use it.',
    ],
    filesystem: {
      dirs: ['/'],
      files: {
        '/vault_msg.enc': `VIGENERE ENCRYPTED MESSAGE
===========================
Cipher type  : Vigenere
Ciphertext   : HHGKU
Key location : see key_hint.txt

Decryption method:
  For each letter in the ciphertext:
    1. Get the corresponding key letter (cycling)
    2. Subtract the key letter's position (A=0, B=1...)
       from the ciphertext letter's position
    3. Take result mod 26
    4. Convert back to a letter`,

        '/key_hint.txt': `Decryption Key — Derivation
============================
The Vigenere key is a 4-letter word.
It is a genre of electronic music.
It is known for its heavy, low-frequency basslines.
It drives the floor. It hits at 140 BPM.
Four letters. All caps.`,

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
      'The key is BASS. Check the key_hint.txt — bass music, heavy basslines, 140 BPM.',
      'Decrypt: H-B=H-1=6=G, H-A=H-0=7=H, G-S=6-18+26=14=O, K-S=10-18+26=18=S, U-B=20-1=19=T.',
      'The plaintext is GHOST.',
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
      '|  SECURITY LAYER 14 / 15  —  ENCODING LAYER   |',
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

I built these 15 layers.
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
      'Decode "U0hBRE9X" from Base64. You can decode it mentally or look it up — knowing what it is matters more than how.',
      'Base64 "U0hBRE9X" decodes to: S(0x53) H(0x48) A(0x41) D(0x44) O(0x4F) W(0x57)',
      'The decoded word is SHADOW.',
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
      '|  SECURITY LAYER 15 / 15  —  CORE ACCESS      |',
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

[END]
`,
      },
    },
    answers: ['vodkashotsandvolvos'],
    caseSensitive: true,
    hints: [
      'Read core/architects_note.txt carefully. The clue describes three things about the person who built this system.',
      'vodka shots. and. volvos. A drink. A car. A lifestyle. Who does that sound like?',
      'The answer is your own username. All lowercase, no spaces: vodkashotsandvolvos',
    ],
    successMsg: [],  // handled specially in terminal.js
  },
]
