import React, { useState } from 'react';
import { SecurityGate } from './components/SecurityGate';
import { Navbar } from './components/Navbar';
import { CyberSecurityCore } from './components/CyberSecurityCore';
import { InteractiveLabs } from './components/InteractiveLabs';
import { DefenseTutorials } from './components/DefenseTutorials';
import { CtfArena } from './components/ctf/CtfArena';
import { Footer } from './components/Footer';
import { UserClearance } from './types';
import { Shield, BookOpen, Terminal, CheckCircle2, Flag } from 'lucide-react';

export default function App() {
  const [clearance, setClearance] = useState<UserClearance | null>(() => {
    try {
      const saved = localStorage.getItem('cyber_fort_clearance');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Default landing view is explicitly "What is Cyber Security?"
  const [currentTab, setCurrentTab] = useState<string>('core');
  const [showGateOverlay, setShowGateOverlay] = useState<boolean>(false);

  const handleClearanceGranted = (newClearance: UserClearance) => {
    setClearance(newClearance);
    setShowGateOverlay(false);
    try {
      localStorage.setItem('cyber_fort_clearance', JSON.stringify(newClearance));
    } catch {
      // ignore
    }
  };

  const handleReverify = () => {
    setShowGateOverlay(true);
  };

  // If user has not verified register number yet, prompt security gate first
  if (!clearance || showGateOverlay) {
    return (
      <SecurityGate
        onClearanceGranted={handleClearanceGranted}
        initialRegisterNumber={clearance?.registerNumber || ''}
        initialFullName={clearance?.fullName || ''}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Cyber Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        clearance={clearance}
        onReverify={handleReverify}
      />

      {/* Main Content Viewport */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Dynamic Welcome & Security Clearance HUD */}
        <section className="bg-[#090e1f] border border-cyan-900/40 rounded-xl overflow-hidden relative shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8 p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AUTHENTICATED CLEARANCE
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">Operator:</span>
                <span className="text-white font-bold">{clearance.fullName || 'Operator'}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">Register ID:</span>
                <span className="text-cyan-300 font-bold">{clearance.registerNumber}</span>
                <span className="text-slate-500">·</span>
                <span className="text-emerald-400 font-bold">{clearance.safetyScore}/100 Verified Safe</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Syne',sans-serif] tracking-tight leading-tight">
                Cyber Fort: Cyber Security Defense Academy & Interactive Labs
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Master defensive cybersecurity engineering. Explore the foundational CIA Triad, inspect real-world threat vectors, and execute hands-on simulations across Web Security, Blue Team SOC, OSINT, and Ethical Hacking.
              </p>

              {/* Navigation Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentTab('core')}
                  className={`px-3.5 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                    currentTab === 'core'
                      ? 'bg-cyan-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-[#060913] text-slate-300 hover:text-white border border-cyan-950 hover:border-cyan-800'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>What is Cyber Security?</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('labs')}
                  className={`px-3.5 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                    currentTab === 'labs'
                      ? 'bg-cyan-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-[#060913] text-slate-300 hover:text-white border border-cyan-950 hover:border-cyan-800'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Interactive Labs (5 Simulators)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('tutorials')}
                  className={`px-3.5 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                    currentTab === 'tutorials'
                      ? 'bg-cyan-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-[#060913] text-slate-300 hover:text-white border border-cyan-950 hover:border-cyan-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Defense Masterclasses (6 Courses)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('ctf')}
                  className={`px-3.5 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                    currentTab === 'ctf'
                      ? 'bg-cyan-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-[#060913] text-slate-300 hover:text-white border border-cyan-950 hover:border-cyan-800'
                  }`}
                >
                  <Flag className="w-4 h-4 text-cyan-400" />
                  <span>CTF Arena (8 Domains)</span>
                </button>
              </div>
            </div>

            {/* Hero Image Asset */}
            <div className="lg:col-span-4 h-full relative min-h-[220px]">
              <img
                src="/src/assets/images/hero_cyber_fort_1790849512817.jpg"
                alt="Cyber Fort Defense Command Center"
                className="w-full h-full object-cover min-h-[220px]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#090e1f] via-[#090e1f]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090e1f] via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        </section>

        {/* Tab 1: Primary "What is Cyber Security?" Explainer Hub */}
        {currentTab === 'core' && <CyberSecurityCore />}

        {/* Tab 2: Interactive Defensive Simulations Labs (WebSec, Blue Team, OSINT, Port Recon, Cryptography) */}
        {currentTab === 'labs' && <InteractiveLabs />}

        {/* Tab 3: Defense Masterclasses & Quizzes */}
        {currentTab === 'tutorials' && <DefenseTutorials clearance={clearance} />}

        {/* Tab 4: Capture The Flag (CTF) Arena */}
        {currentTab === 'ctf' && <CtfArena clearance={clearance} />}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentTab} />
    </div>
  );
}
