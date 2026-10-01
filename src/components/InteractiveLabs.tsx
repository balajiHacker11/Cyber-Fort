import React, { useState, useEffect } from 'react';
import { 
  Terminal, Shield, Globe, Search, Lock, AlertTriangle, CheckCircle2, 
  RefreshCw, Cpu, Zap, ArrowRight, Eye, AlertOctagon, Radio, Filter, 
  Database, Server, Bug, FileCode, Check, X
} from 'lucide-react';
import { PortScanResult, SiemLogEvent } from '../types';

export const InteractiveLabs: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'websec' | 'blueteam' | 'osint' | 'ethack' | 'crypto'>('websec');

  // ==========================================
  // LAB 1: WEB SECURITY (SQLi & XSS DEFENSE SIMULATOR)
  // ==========================================
  const [webInput, setWebInput] = useState<string>("admin' OR '1'='1");
  const [defenseMode, setDefenseMode] = useState<'vulnerable' | 'fortified'>('fortified');
  const [attackType, setAttackType] = useState<'sqli' | 'xss'>('sqli');
  const [webSimulationOutput, setWebSimulationOutput] = useState<{
    status: 'BLOCKED' | 'EXPLOITED';
    executedQuery: string;
    serverMessage: string;
    defensiveCode: string;
  } | null>(null);

  const runWebSecurityTest = () => {
    if (attackType === 'sqli') {
      const isSqlInjection = webInput.includes("'") || webInput.toLowerCase().includes('or 1=1') || webInput.includes('--');
      if (defenseMode === 'vulnerable') {
        if (isSqlInjection) {
          setWebSimulationOutput({
            status: 'EXPLOITED',
            executedQuery: `SELECT * FROM users WHERE email = '${webInput}' AND password = 'hash'`,
            serverMessage: 'AUTHENTICATION BYPASSED: Query evaluated to TRUE. Administrative session session_id=0x9841 granted without password verification.',
            defensiveCode: '// VULNERABLE: Direct string concatenation allows input to alter query syntax\nString query = "SELECT * FROM users WHERE email = \'" + userInput + "\'";'
          });
        } else {
          setWebSimulationOutput({
            status: 'BLOCKED',
            executedQuery: `SELECT * FROM users WHERE email = '${webInput}' AND password = 'hash'`,
            serverMessage: 'AUTHENTICATION FAILED: Invalid credentials provided.',
            defensiveCode: '// No SQL syntax triggered, but code remains vulnerable to future injection'
          });
        }
      } else {
        // Fortified Prepared Statements
        setWebSimulationOutput({
          status: 'BLOCKED',
          executedQuery: `SELECT * FROM users WHERE email = ? AND password = ? [Param 1: "${webInput}"]`,
          serverMessage: 'INJECTION NEUTRALIZED: Input bound strictly as string literal parameter. Database engine did not interpret quotation marks as syntax delimiters.',
          defensiveCode: '// FORTIFIED: Prepared Statement treats input strictly as data\nPreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE email = ?");\nstmt.setString(1, userInput);'
        });
      }
    } else {
      // XSS
      const isXss = webInput.includes('<script') || webInput.includes('onload=') || webInput.includes('onerror=');
      if (defenseMode === 'vulnerable') {
        if (isXss) {
          setWebSimulationOutput({
            status: 'EXPLOITED',
            executedQuery: `<div id="user-comment">${webInput}</div>`,
            serverMessage: 'SCRIPT EXECUTED IN BROWSER: Malicious payload executed in DOM context. Stolen cookie: session_token=jwt_sec_9941a8',
            defensiveCode: '// VULNERABLE: InnerHTML reflection without HTML entity encoding\nelement.innerHTML = userComment;'
          });
        } else {
          setWebSimulationOutput({
            status: 'BLOCKED',
            executedQuery: `<div id="user-comment">${webInput}</div>`,
            serverMessage: 'Normal text rendered safely.',
            defensiveCode: '// No script detected'
          });
        }
      } else {
        // Fortified with HTML Entity Encoding & CSP
        const encoded = webInput.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        setWebSimulationOutput({
          status: 'BLOCKED',
          executedQuery: `<div id="user-comment">${encoded}</div>`,
          serverMessage: 'XSS DEFENDED: HTML entity encoding neutralized executable script tags. Content-Security-Policy: default-src \'self\' enforced.',
          defensiveCode: '// FORTIFIED: TextContent or context-aware encoding avoids DOM execution\nelement.textContent = userComment;'
        });
      }
    }
  };

  useEffect(() => {
    runWebSecurityTest();
  }, [webInput, defenseMode, attackType]);

  // ==========================================
  // LAB 2: BLUE TEAM SOC & SIEM TELEMETRY SIMULATOR
  // ==========================================
  const [siemLogs, setSiemLogs] = useState<SiemLogEvent[]>([
    {
      id: 'log-1',
      timestamp: '03:28:11',
      sourceIp: '185.220.101.5',
      destIp: '10.0.0.15 (Web Server)',
      protocol: 'HTTPS',
      action: 'FLAGGED',
      severity: 'High',
      description: 'SQL injection signature pattern detected in HTTP GET parameters',
      ruleTriggered: 'WAF-RULE-4011 (SQLi Detection)'
    },
    {
      id: 'log-2',
      timestamp: '03:28:14',
      sourceIp: '45.141.87.12',
      destIp: '10.0.0.22 (SSH Bastion)',
      protocol: 'SSH',
      action: 'BLOCKED',
      severity: 'Critical',
      description: 'SSH Brute Force: 45 failed login attempts in 10s',
      ruleTriggered: 'FAIL2BAN-RULE-02 (Threshold Rate Limit)'
    },
    {
      id: 'log-3',
      timestamp: '03:28:20',
      sourceIp: '192.168.1.45',
      destIp: '10.0.0.50 (Internal DB)',
      protocol: 'TCP',
      action: 'ALLOWED',
      severity: 'Low',
      description: 'Authorized query execution from internal app service account',
      ruleTriggered: 'ALLOW-INTERNAL-APP-TRAFFIC'
    }
  ]);
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Critical' | 'High' | 'Low'>('All');
  const [quarantinedIps, setQuarantinedIps] = useState<string[]>([]);
  const [defenseSocScore, setDefenseSocScore] = useState<number>(94);

  const handleQuarantineIp = (ip: string) => {
    if (quarantinedIps.includes(ip)) return;
    setQuarantinedIps(prev => [...prev, ip]);
    setSiemLogs(prev => prev.map(log => {
      if (log.sourceIp === ip) {
        return { ...log, action: 'BLOCKED', description: `${log.description} [IP QUARANTINED BY DEFENDER]` };
      }
      return log;
    }));
    setDefenseSocScore(prev => Math.min(100, prev + 3));
  };

  // ==========================================
  // LAB 3: OSINT RECONNAISSANCE & FOOTPRINT ANALYZER
  // ==========================================
  const [osintDomain, setOsintDomain] = useState<string>('cyberfort-defense.org');
  const [isScanningOsint, setIsScanningOsint] = useState<boolean>(false);
  const [osintReport, setOsintReport] = useState<{
    registrar: string;
    whoisPrivacy: boolean;
    dnsRecords: { type: string; value: string; securityNote: string }[];
    discoveredSubdomains: string[];
    emailSecurityDmarc: string;
    exposureScore: number;
  } | null>(null);

  const runOsintAnalysis = (targetDomain?: string) => {
    const domain = targetDomain || osintDomain;
    setIsScanningOsint(true);
    setOsintReport(null);

    setTimeout(() => {
      const isProtected = domain.includes('cyberfort') || domain.includes('secure');
      setOsintReport({
        registrar: 'Cloudflare / Security Shield Registrar LLC',
        whoisPrivacy: isProtected,
        dnsRecords: [
          { type: 'A', value: '104.21.48.91 (Cloudflare Anycast Proxy)', securityNote: 'Origin server IP concealed behind CDN proxy' },
          { type: 'MX', value: 'mail.protection.outlook.com', securityNote: 'Enterprise mail routing with TLS enforcement' },
          { type: 'TXT', value: 'v=spf1 include:_spf.cyberfort-defense.org -all', securityNote: 'Strict SPF enforcement prevents email domain spoofing' },
          { type: 'DMARC', value: 'v=DMARC1; p=reject; rua=mailto:dmarc-reports@cyberfort.org', securityNote: 'Strict reject policy blocks unauthorized phishing impersonation' }
        ],
        discoveredSubdomains: [
          'api.cyberfort-defense.org (TLS 1.3 Active)',
          'vault.cyberfort-defense.org (MFA & Hardware Key Enforced)',
          'staging.cyberfort-defense.org (Access Restricted to VPN)'
        ],
        emailSecurityDmarc: 'REJECT (Maximum Anti-Spoofing Rating)',
        exposureScore: isProtected ? 92 : 68
      });
      setIsScanningOsint(false);
    }, 600);
  };

  useEffect(() => {
    if (!osintReport) runOsintAnalysis();
  }, []);

  // ==========================================
  // LAB 4: ETHICAL HACKING & PORT SCANNER RECON
  // ==========================================
  const [targetHost, setTargetHost] = useState<'web' | 'database' | 'legacy'>('web');
  const [isScanningPorts, setIsScanningPorts] = useState<boolean>(false);
  const [portResults, setPortResults] = useState<PortScanResult[]>([]);

  const runPortScan = () => {
    setIsScanningPorts(true);
    setPortResults([]);

    setTimeout(() => {
      if (targetHost === 'web') {
        setPortResults([
          { port: 22, service: 'SSH', state: 'Open', banner: 'OpenSSH 8.9p1 Ubuntu', hardeningRecommendation: 'Disable password authentication; enforce SSH keypairs on non-standard port' },
          { port: 80, service: 'HTTP', state: 'Open', banner: 'nginx 1.24.0', hardeningRecommendation: 'Configure 301 Permanent Redirect to HTTPS port 443 with HSTS header' },
          { port: 443, service: 'HTTPS', state: 'Open', banner: 'TLS 1.3 / OpenSSL', hardeningRecommendation: 'Optimal: TLS 1.3 enforced with strict cipher suites' },
          { port: 8080, service: 'HTTP-Proxy', state: 'Filtered', banner: 'WAF Filtered', hardeningRecommendation: 'Protected by external firewall rule' }
        ]);
      } else if (targetHost === 'database') {
        setPortResults([
          { port: 22, service: 'SSH', state: 'Filtered', banner: 'Filtered by IP Whitelist', hardeningRecommendation: 'Optimal: SSH restricted strictly to management bastion IPs' },
          { port: 3306, service: 'MySQL', state: 'Open', banner: 'MySQL Community Server 8.0.35', cveWarning: 'CRITICAL: Port 3306 exposed to public interface 0.0.0.0', hardeningRecommendation: 'Bind MySQL strictly to 127.0.0.1 or VPC private subnet; prohibit public access' },
          { port: 6379, service: 'Redis', state: 'Open', banner: 'Redis 7.0.12 (No Auth Required)', cveWarning: 'HIGH: Unauthenticated in-memory cache exposed', hardeningRecommendation: 'Enable requirepass authentication and TLS encryption' }
        ]);
      } else {
        setPortResults([
          { port: 21, service: 'FTP', state: 'Open', banner: 'vsftpd 2.3.4 (Anonymous Login Allowed)', cveWarning: 'CRITICAL: Unencrypted FTP allows plaintext credential sniffing', hardeningRecommendation: 'Disable legacy FTP; migrate to SFTP/SCP over SSH' },
          { port: 23, service: 'Telnet', state: 'Open', banner: 'Linux Telnetd', cveWarning: 'CRITICAL: Plaintext Telnet protocol actively transmits passwords over the wire', hardeningRecommendation: 'Terminate Telnet service immediately; deploy OpenSSH' },
          { port: 3389, service: 'MS-RDP', state: 'Open', banner: 'Microsoft Terminal Services', cveWarning: 'HIGH: RDP brute force target', hardeningRecommendation: 'Place RDP behind VPN gateway and enforce Multi-Factor Authentication' }
        ]);
      }
      setIsScanningPorts(false);
    }, 700);
  };

  useEffect(() => {
    runPortScan();
  }, [targetHost]);

  // ==========================================
  // LAB 5: APPLIED CRYPTOGRAPHY & HASH ENGINE
  // ==========================================
  const [cryptoInput, setCryptoInput] = useState('Confidential Defense Memo #2026');
  const [shaHash, setShaHash] = useState('');
  const [previousCryptoHash, setPreviousCryptoHash] = useState('');
  const [avalanchePercent, setAvalanchePercent] = useState(0);
  const [miningNonce, setMiningNonce] = useState(0);
  const [isMiningNonce, setIsMiningNonce] = useState(false);
  const [proofFound, setProofFound] = useState(false);

  useEffect(() => {
    const computeHash = async () => {
      try {
        const full = `${cryptoInput}${miningNonce > 0 ? `#nonce=${miningNonce}` : ''}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(full);
        const buffer = await crypto.subtle.digest('SHA-256', data);
        const hex = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        if (shaHash) {
          setPreviousCryptoHash(shaHash);
          let diffs = 0;
          for (let i = 0; i < hex.length; i++) {
            if (shaHash[i] !== hex[i]) diffs++;
          }
          setAvalanchePercent(Math.round((diffs / hex.length) * 100));
        }

        setShaHash(hex);
        setProofFound(hex.startsWith('000'));
      } catch {
        setShaHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
      }
    };
    computeHash();
  }, [cryptoInput, miningNonce]);

  const handleMine = () => {
    setIsMiningNonce(true);
    let n = miningNonce;
    const interval = setInterval(async () => {
      n += Math.floor(Math.random() * 8) + 1;
      setMiningNonce(n);
      const encoder = new TextEncoder();
      const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(`${cryptoInput}#nonce=${n}`));
      const hex = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      if (hex.startsWith('000') || n > miningNonce + 100) {
        clearInterval(interval);
        setIsMiningNonce(false);
      }
    }, 40);
  };

  return (
    <div className="space-y-6">
      {/* Labs Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-950">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Terminal className="w-4 h-4" />
            <span>INTERACTIVE DEFENSIVE SIMULATION LABS</span>
          </div>
          <h2 className="text-2xl font-bold font-mono text-white tracking-tight">
            Cyber Fort Interactive Hands-On Labs
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Hands-on sandboxes across Web Security, Blue Team SOC Telemetry, OSINT Reconnaissance, Ethical Hacking Network Scanners, and Cryptographic Hash Proofs.
          </p>
        </div>

        {/* Lab Navigation Switcher */}
        <div className="flex items-center bg-[#090e1f] p-1 rounded-lg border border-slate-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveLab('websec')}
            className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-colors cursor-pointer ${
              activeLab === 'websec'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Web Security (SQLi & XSS)
          </button>
          <button
            type="button"
            onClick={() => setActiveLab('blueteam')}
            className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-colors cursor-pointer ${
              activeLab === 'blueteam'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Blue Team SOC SIEM
          </button>
          <button
            type="button"
            onClick={() => setActiveLab('osint')}
            className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-colors cursor-pointer ${
              activeLab === 'osint'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. OSINT Reconnaissance
          </button>
          <button
            type="button"
            onClick={() => setActiveLab('ethack')}
            className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-colors cursor-pointer ${
              activeLab === 'ethack'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Port Scanner Recon
          </button>
          <button
            type="button"
            onClick={() => setActiveLab('crypto')}
            className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-colors cursor-pointer ${
              activeLab === 'crypto'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5. Cryptography & Avalanche
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* LAB 1: WEB SECURITY (SQL INJECTION & XSS DEFENSE SANDBOX) */}
      {/* ============================================================ */}
      {activeLab === 'websec' && (
        <div className="bg-[#090e1f] border border-cyan-900/40 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cyan-950 gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                WEB APPLICATION PENETRATION & DEFENSE LAB
              </span>
              <h3 className="text-xl font-bold font-mono text-white">
                SQL Injection (SQLi) & Cross-Site Scripting (XSS) Sandbox
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Test injection payloads against vulnerable dynamic string evaluation vs hardened Prepared Statements and HTML encoding.
              </p>
            </div>

            {/* Attack Category Toggle */}
            <div className="flex items-center bg-[#060913] p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setAttackType('sqli');
                  setWebInput("admin' OR '1'='1");
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                  attackType === 'sqli' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400'
                }`}
              >
                SQL Injection (SQLi)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAttackType('xss');
                  setWebInput("<script>alert('Session Stolen: ' + document.cookie)</script>");
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                  attackType === 'xss' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400'
                }`}
              >
                Cross-Site Scripting (XSS)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input & Defense Controls */}
            <div className="lg:col-span-5 space-y-4 font-mono">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Test User Input Payload
                </label>
                <textarea
                  value={webInput}
                  onChange={(e) => setWebInput(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-[#060913] border border-cyan-950 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              {/* Sample Presets */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Sample Payloads:</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {attackType === 'sqli' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setWebInput("admin' OR '1'='1")}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300"
                      >
                        admin' OR '1'='1
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebInput("' UNION SELECT username, password_hash FROM admin_users--")}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300"
                      >
                        UNION SELECT dump
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebInput("alice@company.com")}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 hover:text-emerald-300"
                      >
                        Benign Email
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setWebInput("<script>alert('Cookie: '+document.cookie)</script>")}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300"
                      >
                        Script Tag
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebInput("<img src=x onerror=alert('XSS_Executed')>")}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300"
                      >
                        Img Error Handler
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebInput("Welcome back, Security Officer!")}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 hover:text-emerald-300"
                      >
                        Benign Comment
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Server Defense Architecture Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Server Defense Architecture
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDefenseMode('vulnerable')}
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      defenseMode === 'vulnerable'
                        ? 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold'
                        : 'bg-[#060913] border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs text-white">Vulnerable Direct Eval</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Raw string concatenation</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDefenseMode('fortified')}
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      defenseMode === 'fortified'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-[#060913] border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs text-white">Fortified Defense</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Prepared Statements / CSP</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Execution Output & Inspection */}
            <div className="lg:col-span-7 bg-[#060913] border border-cyan-950 rounded-xl p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-950">
                <span className="text-slate-400 uppercase tracking-wider font-semibold">
                  SERVER-SIDE EXECUTION INSPECTION
                </span>
                {webSimulationOutput && (
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    webSimulationOutput.status === 'EXPLOITED'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {webSimulationOutput.status}
                  </span>
                )}
              </div>

              {webSimulationOutput && (
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-500 block uppercase mb-1">Interpreted Query / DOM Element:</span>
                    <div className="p-3 bg-[#03060c] border border-cyan-950 rounded-lg text-cyan-300 break-all leading-relaxed">
                      {webSimulationOutput.executedQuery}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block uppercase mb-1">Server Response / Outcome:</span>
                    <div className={`p-3 rounded-lg border leading-relaxed ${
                      webSimulationOutput.status === 'EXPLOITED'
                        ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                        : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                    }`}>
                      {webSimulationOutput.serverMessage}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block uppercase mb-1">Defensive Implementation Blueprint:</span>
                    <pre className="p-3 bg-[#03060c] border border-cyan-950 rounded-lg text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
                      {webSimulationOutput.defensiveCode}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* LAB 2: BLUE TEAM SOC SIEM & LOG INCIDENT TRIAGE */}
      {/* ============================================================ */}
      {activeLab === 'blueteam' && (
        <div className="bg-[#090e1f] border border-cyan-900/40 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cyan-950 gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                SECURITY OPERATIONS CENTER (SOC) DEFENSE LAB
              </span>
              <h3 className="text-xl font-bold font-mono text-white">
                SIEM Log Telemetry & Active Incident Containment
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Analyze real-time syslog and firewall events, triage security alerts, and execute IP quarantine containment rules.
              </p>
            </div>

            <div className="flex items-center gap-4 font-mono">
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block uppercase">PERIMETER HEALTH SCORE</span>
                <span className="text-xl font-bold text-emerald-400 tabular-nums">{defenseSocScore}/100</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block uppercase">QUARANTINED IPS</span>
                <span className="text-xl font-bold text-cyan-400 tabular-nums">{quarantinedIps.length} Active</span>
              </div>
            </div>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center justify-between flex-wrap gap-2 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Filter Severity:</span>
              {(['All', 'Critical', 'High', 'Low'] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    severityFilter === sev ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
            <span className="text-slate-500">Simulated SIEM Ingestion Engine: ONLINE</span>
          </div>

          {/* SIEM Log Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#060913] text-slate-400 border-b border-cyan-950">
                <tr>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Source IP</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Protocol</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Alert Trigger & Description</th>
                  <th className="py-2.5 px-3 text-right">Blue Team Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-950/60">
                {siemLogs
                  .filter(l => severityFilter === 'All' || l.severity === severityFilter)
                  .map((log) => {
                    const isQuarantined = quarantinedIps.includes(log.sourceIp);
                    return (
                      <tr key={log.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-3 px-3 text-slate-500">{log.timestamp}</td>
                        <td className="py-3 px-3 font-semibold text-cyan-300">{log.sourceIp}</td>
                        <td className="py-3 px-3 text-slate-300">{log.destIp}</td>
                        <td className="py-3 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {log.protocol}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            log.severity === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                            log.severity === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            'bg-slate-900 text-slate-400'
                          }`}>
                            {log.severity}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-xs text-slate-300">
                          <div className="font-semibold text-white">{log.ruleTriggered}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{log.description}</div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {isQuarantined ? (
                            <span className="text-[11px] text-emerald-400 flex items-center justify-end gap-1 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Blocked
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleQuarantineIp(log.sourceIp)}
                              className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded text-[11px] transition-colors cursor-pointer"
                            >
                              Quarantine IP
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* LAB 3: OSINT RECONNAISSANCE & ATTACK SURFACE PROFILER */}
      {/* ============================================================ */}
      {activeLab === 'osint' && (
        <div className="bg-[#090e1f] border border-cyan-900/40 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cyan-950 gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                PASSIVE RECONNAISSANCE & OSINT PROFILER
              </span>
              <h3 className="text-xl font-bold font-mono text-white">
                Domain Footprint, DNS Exposure & Subdomain Discovery
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Examine an organization’s public digital attack surface, WHOIS privacy status, and email anti-spoofing enforcement.
              </p>
            </div>
          </div>

          <div className="space-y-4 font-mono">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Target Domain Name to Inspect
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={osintDomain}
                  onChange={(e) => setOsintDomain(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-[#060913] border border-cyan-950 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  placeholder="e.g. corp-finance-network.com"
                />
                <button
                  type="button"
                  onClick={() => runOsintAnalysis()}
                  disabled={isScanningOsint}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Search className={`w-3.5 h-3.5 ${isScanningOsint ? 'animate-spin' : ''}`} />
                  <span>Execute OSINT Recon</span>
                </button>
              </div>

              {/* Sample targets */}
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-slate-500">Sample Targets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setOsintDomain('cyberfort-defense.org');
                    runOsintAnalysis('cyberfort-defense.org');
                  }}
                  className="text-cyan-400 hover:underline"
                >
                  cyberfort-defense.org (Hardened)
                </button>
                <span className="text-slate-600">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setOsintDomain('legacy-financial-unprotected.com');
                    runOsintAnalysis('legacy-financial-unprotected.com');
                  }}
                  className="text-amber-400 hover:underline"
                >
                  legacy-financial-unprotected.com (Exposed)
                </button>
              </div>
            </div>

            {osintReport && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* DNS & Registrar Box */}
                <div className="p-4 bg-[#060913] border border-cyan-950 rounded-xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-cyan-950 text-xs">
                    <span className="text-slate-400 font-semibold uppercase">REGISTRAR & WHOIS HYGIENE</span>
                    <span className={`font-bold ${osintReport.whoisPrivacy ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {osintReport.whoisPrivacy ? 'WHOIS PRIVACY ENABLED' : 'EXPOSED PUBLIC WHOIS'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="text-slate-400">
                      Registrar: <span className="text-slate-200">{osintReport.registrar}</span>
                    </div>
                    <div className="text-slate-400">
                      DMARC Policy: <span className="text-emerald-400 font-bold">{osintReport.emailSecurityDmarc}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-cyan-950">
                    <span className="text-slate-500 text-[11px] block uppercase">DNS Telemetry Records:</span>
                    {osintReport.dnsRecords.map((dns, i) => (
                      <div key={i} className="p-2.5 bg-[#03060c] border border-cyan-950 rounded text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-cyan-300 font-bold">{dns.type}</span>
                          <span className="text-slate-400 truncate max-w-xs">{dns.value}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">{dns.securityNote}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Discovered Subdomains & Exposure Rating */}
                <div className="p-4 bg-[#060913] border border-cyan-950 rounded-xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-cyan-950 text-xs">
                    <span className="text-slate-400 font-semibold uppercase">CERTIFICATE TRANSPARENCY SUBDOMAINS</span>
                    <span className="text-cyan-400 font-bold">{osintReport.exposureScore}/100 HYGIENE</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Attackers scrape Certificate Transparency (CT) logs to discover internal or staging services before they are announced.
                  </p>

                  <div className="space-y-2">
                    {osintReport.discoveredSubdomains.map((sub, i) => (
                      <div key={i} className="p-2.5 bg-[#03060c] border border-cyan-950 rounded text-xs flex items-center justify-between">
                        <span className="text-slate-300">{sub}</span>
                        <span className="text-emerald-400 font-semibold text-[10px]">VERIFIED</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-cyan-950/30 border border-cyan-900/40 rounded-lg text-xs text-cyan-300 leading-relaxed">
                    <span className="font-bold">DEFENSIVE REMEDIATION: </span>
                    Regularly audit your organization’s exposed subdomains and revoke wildcard DNS records pointing to deprecated cloud instances.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* LAB 4: ETHICAL HACKING & PORT SCANNER SIMULATOR */}
      {/* ============================================================ */}
      {activeLab === 'ethack' && (
        <div className="bg-[#090e1f] border border-cyan-900/40 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cyan-950 gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                ETHICAL HACKING & NETWORK ENUMERATION
              </span>
              <h3 className="text-xl font-bold font-mono text-white">
                SYN Stealth Port Scanner & Service Banner Enumerator
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Simulate TCP port enumeration, identify legacy service vulnerabilities, and apply network boundary hardening.
              </p>
            </div>

            {/* Target Selector */}
            <div className="flex items-center bg-[#060913] p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setTargetHost('web')}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                  targetHost === 'web' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400'
                }`}
              >
                10.0.0.10 (Web DMZ)
              </button>
              <button
                type="button"
                onClick={() => setTargetHost('database')}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                  targetHost === 'database' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400'
                }`}
              >
                10.0.0.50 (Database)
              </button>
              <button
                type="button"
                onClick={() => setTargetHost('legacy')}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                  targetHost === 'legacy' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400'
                }`}
              >
                192.168.1.99 (Legacy Host)
              </button>
            </div>
          </div>

          <div className="space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                PROBING TARGET: <strong className="text-white">{targetHost === 'web' ? '10.0.0.10' : targetHost === 'database' ? '10.0.0.50' : '192.168.1.99'}</strong> via TCP SYN
              </span>
              <button
                type="button"
                onClick={runPortScan}
                disabled={isScanningPorts}
                className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isScanningPorts ? 'animate-spin' : ''}`} />
                <span>Re-Scan Host</span>
              </button>
            </div>

            {/* Port Grid Results */}
            <div className="space-y-3">
              {portResults.map((portInfo) => (
                <div
                  key={portInfo.port}
                  className={`p-4 rounded-xl border ${
                    portInfo.cveWarning
                      ? 'bg-rose-950/20 border-rose-900/50'
                      : 'bg-[#060913] border-cyan-950'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-cyan-950/60">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-white">PORT {portInfo.port} / TCP</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                        {portInfo.service}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                        portInfo.state === 'Open' ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-400 bg-slate-900'
                      }`}>
                        {portInfo.state}
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-mono">
                      Banner: <span className="text-slate-200">{portInfo.banner}</span>
                    </span>
                  </div>

                  {portInfo.cveWarning && (
                    <div className="mt-2 text-xs text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{portInfo.cveWarning}</span>
                    </div>
                  )}

                  <div className="mt-2.5 text-xs text-slate-400">
                    <strong className="text-cyan-400">Hardening Protocol: </strong>
                    {portInfo.hardeningRecommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* LAB 5: APPLIED CRYPTOGRAPHY, SHA-256 AVALANCHE & PROOF-OF-WORK */}
      {/* ============================================================ */}
      {activeLab === 'crypto' && (
        <div className="bg-[#090e1f] border border-cyan-900/40 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cyan-950 gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                CRYPTOGRAPHIC INTEGRITY & IMMUTABILITY LAB
              </span>
              <h3 className="text-xl font-bold font-mono text-white">
                SHA-256 Avalanche Visualizer & Nonce Mining Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Explore preimage resistance, the cryptographic avalanche effect, and proof-of-work block mining.
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-slate-400 block">AVALANCHE EFFECT</span>
              <span className="text-lg font-bold text-cyan-400 tabular-nums">~{avalanchePercent}% bits flipped</span>
            </div>
          </div>

          <div className="space-y-4 font-mono">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Input Plaintext / Memo
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cryptoInput}
                  onChange={(e) => {
                    setCryptoInput(e.target.value);
                    setMiningNonce(0);
                  }}
                  className="flex-1 px-4 py-2.5 bg-[#060913] border border-cyan-950 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setCryptoInput(cryptoInput.endsWith('.') ? cryptoInput.slice(0, -1) : cryptoInput + '.')}
                  className="px-4 py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Toggle 1 Bit
                </button>
              </div>
            </div>

            {/* Computed Hash Box */}
            <div className="p-4 bg-[#060913] border border-cyan-950 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>COMPUTED SHA-256 DIGEST</span>
                <span className="text-cyan-400">256 BITS / 64 HEXADECIMAL DIGITS</span>
              </div>
              <div className="p-3 bg-[#03060c] border border-cyan-950 rounded-lg text-sm text-cyan-300 break-all select-all shadow-inner">
                {shaHash}
              </div>
            </div>

            {/* Nonce Miner */}
            <div className="p-4 bg-cyan-950/20 border border-cyan-900/40 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Cryptographic Proof-of-Work: Mine a "000" Prefix
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Demonstrates how hashing protects blockchain and digital signature ledgers from retroactive tampering.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">NONCE</span>
                    <span className="text-base font-bold text-white tabular-nums">{miningNonce}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleMine}
                    disabled={isMiningNonce}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isMiningNonce ? 'Computing...' : 'Mine Proof (POW)'}
                  </button>
                </div>
              </div>

              {proofFound && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Valid cryptographic target prefix discovered! Tamper-proof block sealed.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
