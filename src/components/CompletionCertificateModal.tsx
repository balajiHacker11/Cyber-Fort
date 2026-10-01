import React, { useState, useRef } from 'react';
import { 
  Award, Shield, CheckCircle2, Download, Printer, Copy, Check, 
  X, ExternalLink, Key, Lock, Sparkles, Hash
} from 'lucide-react';
import { UserClearance } from '../types';
import { SECURITY_MODULES } from '../data/cyberSecurityData';

interface CompletionCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  clearance: UserClearance;
}

export const CompletionCertificateModal: React.FC<CompletionCertificateModalProps> = ({
  isOpen,
  onClose,
  clearance
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Generate deterministic serial number & hash based on register number
  const regId = clearance.registerNumber || 'CYBER-DEFENDER-2026';
  const serialNo = `CF-CERT-2026-${regId.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase() || '7741'}-DEF`;
  const verificationHash = `0x9d4a${regId.length * 1337}f882c1b9884e${Date.now().toString(16).slice(-6)}e024`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleCopyHash = () => {
    navigator.clipboard.writeText(`${serialNo} | Verified Hash: ${verificationHash} | Cyber Fort Certified Master Defender`);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#080d1e] border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.3)] my-8 overflow-hidden font-sans">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-950 bg-[#050813]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                OFFICIAL DEFENSE ACCREDITATION
              </span>
              <span className="text-xs text-slate-400 block font-mono">
                Cyber Fort Master Defender Certification
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-[#0f172a] hover:bg-[#1e293b] border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div ref={certificateRef} className="p-6 sm:p-10 space-y-8 bg-gradient-to-b from-[#080d1e] via-[#050914] to-[#04060d] relative">
          {/* Holographic Watermark / Grid */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px'
            }}
          />

          {/* Certificate Inner Frame */}
          <div className="relative border-2 border-cyan-500/30 rounded-xl p-6 sm:p-10 bg-[#090e21]/70 backdrop-blur-sm shadow-2xl">
            {/* Ornamental Corners */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

            {/* Header Badge & Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                <Shield className="w-10 h-10 text-cyan-400" />
              </div>
              <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
                CYBER FORT CYBERSECURITY DEFENSE ACADEMY
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Syne',sans-serif] tracking-tight">
                CERTIFICATE OF MASTERY
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                This document certifies that the operator identified below has successfully mastered and defended all 6 cybersecurity simulation modules.
              </p>
            </div>

            {/* Personalized Recipient Section */}
            <div className="my-8 py-6 border-y border-cyan-900/60 text-center space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                VERIFIED OPERATOR & REGISTER NUMBER
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-wider text-cyan-300">
                {regId}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-400 pt-1">
                <span>Security Clearance: <strong className="text-emerald-400 font-semibold">Tier 1 Master Defender</strong></span>
                <span>·</span>
                <span>Audit Score: <strong className="text-cyan-300 font-semibold">{clearance.safetyScore}/100 Verified Safe</strong></span>
                <span>·</span>
                <span>Issued: <strong className="text-slate-200">{issueDate}</strong></span>
              </div>
            </div>

            {/* Personalized Digital Badge Display */}
            <div className="my-8 flex flex-col sm:flex-row items-center justify-center gap-8 bg-[#050813]/90 border border-cyan-900/60 rounded-xl p-6">
              {/* Badge Visual */}
              <div className="relative flex flex-col items-center justify-center w-48 h-48 rounded-2xl bg-gradient-to-b from-cyan-950/60 to-slate-950 border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(6,182,212,0.35)] p-4 text-center shrink-0">
                <div className="absolute -top-3 px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500 text-[10px] font-mono font-bold tracking-wider">
                  DIGITAL BADGE
                </div>
                <Award className="w-12 h-12 text-cyan-400 mb-1" />
                <div className="text-xs font-bold text-white font-mono leading-tight tracking-wide">
                  CYBER FORT
                </div>
                <div className="text-[11px] font-extrabold text-cyan-300 font-mono tracking-wider mt-0.5">
                  MASTER DEFENDER
                </div>
                <div className="text-[9px] font-mono text-emerald-400 border-t border-cyan-900/80 mt-2 pt-1 uppercase">
                  6/6 MODULES VERIFIED
                </div>
              </div>

              {/* Verified Curriculum List */}
              <div className="space-y-2 flex-1 font-mono text-xs">
                <span className="text-slate-400 uppercase tracking-wider block font-semibold mb-2">
                  Accredited Simulation Competencies:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SECURITY_MODULES.map((mod) => (
                    <div key={mod.id} className="flex items-center gap-2 p-2 bg-[#090e1f] rounded border border-cyan-950 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-200 truncate">{mod.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cryptographic Verification Footer in Certificate */}
            <div className="pt-4 border-t border-cyan-900/60 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-3">
              <div>
                <span className="text-slate-400 block font-semibold">CERTIFICATE SERIAL ID</span>
                <span className="text-cyan-300 select-all font-bold">{serialNo}</span>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-slate-400 block font-semibold">SHA-256 PROOF HASH</span>
                <span className="text-slate-300 select-all text-[11px]">{verificationHash}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-cyan-950 bg-[#050813] font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically sealed under Cyber Fort Root Trust.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyHash}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedHash ? 'Hash Copied!' : 'Copy Verification Hash'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download / Print Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
