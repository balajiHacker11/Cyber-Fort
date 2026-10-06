import React, { useState } from 'react';
import { 
  BookOpen, Code, ShieldCheck, Copy, Check, Terminal, 
  ExternalLink, ArrowRight, Lock, Globe, Eye, FileSearch,
  Cpu, Wrench
} from 'lucide-react';
import { CtfWriteup, CtfDomain } from '../../types/ctf';
import { CTF_WRITEUPS } from '../../data/ctfData';

export const WriteupsSection: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const domains = ['All', 'Web Exploitation', 'OSINT', 'Cryptography', 'Binary Exploitation (Pwn)'];

  const filteredWriteups = selectedDomain === 'All'
    ? CTF_WRITEUPS
    : CTF_WRITEUPS.filter(w => w.domain === selectedDomain);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const ctfToolkit = [
    { name: 'CyberChef', purpose: 'Multi-layer encoding, crypto, and data transformation Swiss Army knife', url: 'https://gchq.github.io/CyberChef/' },
    { name: 'Ghidra SRE', purpose: 'NSA open-source software reverse engineering suite for de-virtualization & ELF disassembly', url: 'https://ghidra-sre.org/' },
    { name: 'Pwntools', purpose: 'Python CTF framework for ROP gadget chaining, socket exploitation, and format strings', url: 'https://github.com/Gallopsled/pwntools' },
    { name: 'Volatility 3', purpose: 'Advanced memory forensics framework for carving injected DLLs and C2 beacons', url: 'https://www.volatilityfoundation.org/' },
    { name: 'SymPy & SageMath', purpose: 'Computer algebra systems for solving RSA modular congruences and Coppersmith attacks', url: 'https://www.sympy.org/' }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-[#090e1f] border border-cyan-900/40 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <BookOpen className="w-4 h-4" />
            <span>POST-EVENT ACADEMY & VULNERABILITY ARCHIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Syne',sans-serif] tracking-tight">
            Technical Write-ups & Exploit Proof-of-Concepts
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Deconstruct real-world exploit mechanics. Study the step-by-step methodologies used by top competitors and review defensive hardening architectures.
          </p>
        </div>

        {/* Domain Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {domains.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                  : 'bg-[#060913] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Write-ups Cards */}
      <div className="space-y-6">
        {filteredWriteups.map((writeup) => (
          <div
            key={writeup.id}
            className="p-6 sm:p-8 rounded-2xl bg-[#090e1f] border border-cyan-950 hover:border-cyan-900/60 transition-all space-y-6 shadow-lg"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-950">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono mb-1">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                    {writeup.domain}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{writeup.difficulty} Level</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">Author: {writeup.author}</span>
                </div>
                <h3 className="text-xl font-bold font-mono text-white">
                  {writeup.title}
                </h3>
              </div>
            </div>

            {/* Overview & Vulnerability Mechanics */}
            <div className="space-y-4 font-mono text-xs">
              <div>
                <span className="text-slate-400 uppercase tracking-wider block font-semibold mb-1">
                  EXECUTIVE SUMMARY
                </span>
                <p className="text-slate-300 leading-relaxed font-sans text-sm">
                  {writeup.overview}
                </p>
              </div>

              <div className="p-4 bg-[#060913] border border-cyan-950 rounded-xl space-y-2">
                <span className="text-cyan-400 uppercase tracking-wider block font-bold">
                  VULNERABILITY ROOT-CAUSE DECONSTRUCTION
                </span>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                  {writeup.vulnerabilityDeconstruction}
                </p>
              </div>
            </div>

            {/* Step-by-Step Chain */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-slate-400 uppercase tracking-wider block font-semibold mb-2">
                ATTACK EXECUTION CHAIN:
              </span>
              <div className="space-y-1.5">
                {writeup.stepByStepSolution.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-[#060913] rounded-lg border border-cyan-950 text-slate-300">
                    <span className="text-cyan-400 font-bold shrink-0">[{idx + 1}]</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proof of Concept Code Block */}
            {writeup.proofOfConceptCode && (
              <div className="space-y-2 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-semibold uppercase">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    REPRODUCIBLE EXPLOIT PROOF-OF-CONCEPT
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(writeup.id, writeup.proofOfConceptCode)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCodeId === writeup.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeId === writeup.id ? 'Copied PoC' : 'Copy PoC Code'}</span>
                  </button>
                </div>
                <div className="p-4 bg-[#03060c] border border-cyan-950 rounded-xl overflow-x-auto">
                  <pre className="text-xs text-cyan-300 font-mono leading-relaxed select-all">
                    {writeup.proofOfConceptCode}
                  </pre>
                </div>
              </div>
            )}

            {/* Defensive Hardening Takeaway */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-1 font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>CYBER FORT DEFENSIVE HARDENING RULE</span>
              </div>
              <p className="text-slate-300 font-sans text-xs leading-relaxed pt-1">
                {writeup.defenseTakeaway}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Curated Toolkit Section */}
      <div className="bg-[#090e1f] border border-cyan-900/40 rounded-2xl p-6 sm:p-8 space-y-4 font-mono">
        <div className="flex items-center gap-2 text-white font-bold">
          <Wrench className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base uppercase tracking-wider">
            Standard CTF Engineering Arsenal & Tooling
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {ctfToolkit.map((tool, i) => (
            <a
              key={i}
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 bg-[#060913] border border-cyan-950 rounded-xl hover:border-cyan-800 transition-colors block group"
            >
              <div className="flex items-center justify-between text-cyan-300 font-bold mb-1">
                <span>{tool.name}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                {tool.purpose}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
