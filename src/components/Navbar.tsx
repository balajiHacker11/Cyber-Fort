import React from 'react';
import { Shield, RotateCcw } from 'lucide-react';
import { UserClearance } from '../types';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  clearance: UserClearance;
  onReverify: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, clearance, onReverify }) => {
  const navItems = [
    { id: 'core', label: 'What is Cyber Security?' },
    { id: 'labs', label: 'Interactive Labs & Simulators' },
    { id: 'tutorials', label: 'Defense Masterclasses' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#060913]/90 backdrop-blur-md border-b border-cyan-950/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark in single element */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Shield className="w-4 h-4" />
          </div>
          <button
            type="button"
            onClick={() => onTabChange('core')}
            className="text-lg font-bold tracking-tight text-white font-['Syne',sans-serif] hover:text-cyan-300 transition-colors cursor-pointer text-left"
          >
            Cyber Fort
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer rounded-md font-mono ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Clearance status & switch action */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#090e1f] border border-cyan-900/60 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">ID:</span>
            <span className="text-cyan-300 font-medium truncate max-w-[120px]">{clearance.registerNumber}</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold">{clearance.safetyScore}% Verified</span>
          </div>

          <button
            type="button"
            onClick={onReverify}
            title="Re-run register number audit"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-300 hover:text-white bg-[#0f172a] hover:bg-[#1e293b] border border-slate-800 hover:border-cyan-800/60 rounded-md transition-all cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Switch ID</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center gap-1 mt-2.5 pt-2 border-t border-cyan-950/40 overflow-x-auto pb-1 scrollbar-none font-mono">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`px-2.5 py-1 text-xs whitespace-nowrap rounded shrink-0 transition-colors ${
                isActive
                  ? 'text-cyan-300 bg-cyan-950/70 border border-cyan-800 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
