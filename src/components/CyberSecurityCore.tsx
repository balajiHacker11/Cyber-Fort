import React, { useState } from 'react';
import { 
  Shield, Lock, AlertTriangle, Key, Cpu, Terminal, CheckCircle2, 
  ChevronRight, Eye, ShieldAlert, ArrowRight, Server, Globe, Users, 
  Search, ShieldCheck, Binary, RefreshCw
} from 'lucide-react';
import { FOUNDATIONAL_CYBER_PILLARS, THREAT_VECTORS } from '../data/cyberSecurityData';
import { ThreatVector } from '../types';

export const CyberSecurityCore: React.FC = () => {
  const [selectedThreat, setSelectedThreat] = useState<ThreatVector>(THREAT_VECTORS[0]);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Web Security', 'Blue Team & Network', 'Cryptography', 'Social Eng & OSINT'];

  const filteredThreats = filterCategory === 'All' 
    ? THREAT_VECTORS 
    : THREAT_VECTORS.filter(t => t.category === filterCategory);

  return (
    <div className="space-y-10 font-sans">
      {/* Hero Explainer Section */}
      <section className="bg-[#090e1f] border border-cyan-900/40 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Shield className="w-4 h-4" />
              <span>THE FOUNDATIONAL DEFENSIVE SCIENCE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne',sans-serif] tracking-tight leading-tight">
              What is Cybersecurity?
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong className="text-cyan-300 font-semibold">Cybersecurity</strong> is the systematic engineering practice of defending computers, servers, mobile devices, electronic systems, networks, and data from malicious digital attacks, unauthorized access, and algorithmic destruction.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cyber threats are designed to access, alter, or destroy sensitive information, extort money from users via ransomware, or disrupt normal business operations. Implementing effective cybersecurity measures is particularly challenging today because there are more devices than people, and attackers are constantly automating sophisticated exploit chains.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 bg-[#060913] rounded-lg border border-cyan-950">
                <span className="text-cyan-400 font-bold block mb-1">Offensive Security (Red Team)</span>
                <span className="text-slate-400">Authorized ethical hacking, vulnerability scanning, penetration testing, and risk discovery.</span>
              </div>
              <div className="p-3 bg-[#060913] rounded-lg border border-cyan-950">
                <span className="text-emerald-400 font-bold block mb-1">Defensive Security (Blue Team)</span>
                <span className="text-slate-400">SOC telemetry, SIEM monitoring, firewall rules, incident response, and cryptographic hardening.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] group">
              <img
                src="/src/assets/images/cyber_threat_matrix_1790849531336.jpg"
                alt="Cyber Fort Security Threat Matrix Visualization"
                className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-[#060913]/90 backdrop-blur-md border border-cyan-900/80 rounded-lg text-xs font-mono text-slate-300">
                <span className="text-cyan-400 font-bold">Cyber Defense Architecture:</span> Layered network perimeter, cryptographic authorization, and continuous anomaly telemetry.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Foundational Pillars (CIA Triad + Zero Trust) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white tracking-tight">
            The Core Pillars: CIA Triad & Zero-Trust Architecture
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Every cybersecurity standard (ISO 27001, NIST CSF, SOC 2) is grounded in these four fundamental mathematical and operational pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FOUNDATIONAL_CYBER_PILLARS.map((pillar) => (
            <div
              key={pillar.code}
              className="p-5 bg-[#090e1f] border border-cyan-900/30 rounded-xl hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-cyan-950/80">
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {pillar.title}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
                    {pillar.code}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {pillar.description}
                </p>
                <div className="mt-3 p-3 bg-[#060913] rounded-lg border border-cyan-950 text-xs text-slate-400 leading-relaxed font-mono">
                  <span className="text-emerald-400 font-semibold block mb-1">Real-World Operational Context:</span>
                  {pillar.realContext}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-cyan-950/80 text-[11px] font-mono text-cyan-400/90 flex items-center justify-between">
                <span>Core Mechanism:</span>
                <span className="text-slate-400">{pillar.coreMechanism}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cyber Defense Disciplines Breakdown */}
      <section className="bg-[#090e1f] border border-cyan-900/40 rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white tracking-tight">
            Key Disciplines of Modern Cybersecurity
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Cybersecurity spans distinct technical domains working together to maintain an impenetrable defense posture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 bg-[#060913] border border-cyan-950 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Globe className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">1. Web Application Security</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Defending web browsers, HTTP APIs, and microservices against OWASP Top 10 exploits (SQLi, XSS, CSRF, SSRF, Broken Access Control).
            </p>
          </div>

          <div className="p-4 bg-[#060913] border border-cyan-950 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Server className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">2. Blue Team & SOC Ops</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Continuous real-time threat detection, SIEM log correlation, firewall ruleset enforcement, and active incident response containment.
            </p>
          </div>

          <div className="p-4 bg-[#060913] border border-cyan-950 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Search className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">3. OSINT Reconnaissance</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Auditing an organization’s digital footprint via passive DNS, Certificate Transparency logs, WHOIS metadata, and code leak discovery.
            </p>
          </div>

          <div className="p-4 bg-[#060913] border border-cyan-950 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">4. Applied Cryptography</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Leveraging SHA-256 one-way hashing, asymmetric public-key cryptography (RSA, ECC), TLS 1.3 encryption, and salted credential vaults.
            </p>
          </div>
        </div>
      </section>

      {/* Threat Taxonomy Explorer */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-mono text-white tracking-tight">
              Major Attack Vectors & Anatomy of Exploits
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Analyze how cybercriminals execute attacks and the definitive countermeasures to defend your infrastructure.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center bg-[#090e1f] p-1 rounded-lg border border-slate-800 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Threat List Column */}
          <div className="lg:col-span-5 space-y-2 font-mono">
            {filteredThreats.map((threat) => {
              const isSelected = threat.id === selectedThreat.id;
              return (
                <button
                  key={threat.id}
                  type="button"
                  onClick={() => setSelectedThreat(threat)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-[#090e1f] border-slate-800/80 hover:border-slate-700 hover:bg-[#0c1328]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {threat.category}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      threat.severity === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {threat.severity} Severity
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-2">
                    {threat.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {threat.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Threat Deep-Dive Diagnostic Panel */}
          <div className="lg:col-span-7 bg-[#090e1f] border border-cyan-900/50 rounded-xl p-6 shadow-xl space-y-5 font-mono">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-cyan-950">
              <div>
                <span className="text-xs text-cyan-400 uppercase tracking-wider block mb-1">
                  TACTICAL DECONSTRUCTION
                </span>
                <h3 className="text-xl font-bold text-white">
                  {selectedThreat.title}
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                {selectedThreat.severity}
              </span>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Attack Mechanism & Execution Flow
              </h5>
              <div className="p-3.5 bg-[#060913] border border-cyan-950 rounded-lg text-xs text-slate-300 leading-relaxed">
                {selectedThreat.attackMechanism}
              </div>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Real-World Financial & System Impact
              </h5>
              <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-lg text-xs text-rose-300 leading-relaxed">
                {selectedThreat.realWorldImpact}
              </div>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Cyber Fort Defense Shield Protocol
              </h5>
              <ul className="space-y-2">
                {selectedThreat.defensiveShield.map((shield, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                    <span>{shield}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-cyan-950 text-xs text-cyan-300 bg-cyan-950/30 p-3 rounded-lg border border-cyan-900/40">
              <span className="font-bold">Standard Operating Procedure: </span>
              {selectedThreat.actionProtocol}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
