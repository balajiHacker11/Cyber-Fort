import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-cyan-950/80 bg-[#04060d] text-slate-400 py-12 px-4 sm:px-8 mt-16 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Overview */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-white font-['Syne',sans-serif]">Cyber Fort</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            Dedicated to advancing cybersecurity education, ethical hacking methodologies, Blue Team SOC defense techniques, and hands-on protective simulation labs.
          </p>
          <div className="text-[11px] font-mono text-slate-500 pt-2">
            Zero-Trust Architecture · Ethical Hacking Standards · OWASP Top 10 Aligned
          </div>
        </div>

        {/* Learning & Labs Links */}
        <div className="space-y-2.5 text-xs font-mono">
          <span className="text-white font-semibold uppercase tracking-wider block mb-1">
            Core Curriculum
          </span>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('core')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              What is Cybersecurity?
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('core')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              The CIA Triad & Zero-Trust
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('tutorials')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Defense Simulation Courses
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('tutorials')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Course Mastery Checkpoints
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('ctf')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer font-bold"
            >
              CTF Arena & Challenges
            </button>
          </div>
        </div>

        {/* Labs Quick Links */}
        <div className="space-y-2.5 text-xs font-mono">
          <span className="text-white font-semibold uppercase tracking-wider block mb-1">
            Interactive Labs
          </span>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('labs')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Web Security (SQLi & XSS)
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('labs')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Blue Team SOC SIEM Telemetry
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('labs')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              OSINT Domain Reconnaissance
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('labs')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Port Scanner Enumerator
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-cyan-950/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
        <div>© 2026 Cyber Fort Defense Academy. Strictly educational & defensive purposes.</div>
        <div className="flex items-center gap-4">
          <span>Defense in Depth · Continuous Verification</span>
        </div>
      </div>
    </footer>
  );
};
