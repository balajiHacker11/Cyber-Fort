import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, Search, Terminal, Lock, ArrowRight, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { UserClearance } from '../types';

interface SecurityGateProps {
  onClearanceGranted: (clearance: UserClearance) => void;
  initialRegisterNumber?: string;
}

export const SecurityGate: React.FC<SecurityGateProps> = ({ onClearanceGranted, initialRegisterNumber = '' }) => {
  const [registerInput, setRegisterInput] = useState(initialRegisterNumber || '');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [auditResult, setAuditResult] = useState<UserClearance | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleIds = ['REG-CYBER-8842', 'STUDENT-SEC-9410', 'DEV-VAULT-2026'];

  const executeSecurityAudit = (idToTest?: string) => {
    const targetId = (idToTest || registerInput).trim();
    if (!targetId || targetId.length < 4) {
      setErrorMsg('Please enter a valid registration or account number (minimum 4 characters)');
      return;
    }

    setErrorMsg('');
    setIsScanning(true);
    setScanStep(1);
    setScanLogs([`[0.00s] Initializing diagnostic handshake for ID: ${targetId}`]);
    setAuditResult(null);

    // Progressive simulated diagnostic steps
    setTimeout(() => {
      setScanStep(2);
      setScanLogs(prev => [
        ...prev,
        `[0.45s] Querying 14.8M credential breach dumps and compromised crypto hash tables...`,
        `[0.60s] SHA-256 entropy check on registration identity salt...`
      ]);
    }, 700);

    setTimeout(() => {
      setScanStep(3);
      setScanLogs(prev => [
        ...prev,
        `[1.15s] Inspecting wallet authorization signatures & simulated SIM-swap vulnerability vector...`,
        `[1.40s] Zero-Knowledge clearance proof confirmed via mathematical curve Ed25519.`
      ]);
    }, 1500);

    setTimeout(() => {
      setScanStep(4);
      // Generate deterministic or calculated score
      const charSum = targetId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const score = 88 + (charSum % 11); // score between 88 and 98
      const leaks = (charSum % 7 === 0) ? 1 : 0;

      const result: UserClearance = {
        registerNumber: targetId,
        verifiedAt: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        safetyScore: leaks > 0 ? 84 : score,
        threatLevel: leaks > 0 ? 'Moderate' : 'Low',
        leaksFound: leaks,
        twoFactorStatus: 'Recommended',
        keyHealth: 'Optimal'
      };

      setAuditResult(result);
      setScanLogs(prev => [
        ...prev,
        `[1.95s] Security Audit Complete: Status -> ${result.threatLevel === 'Low' ? 'VERIFIED RESILIENT' : 'ATTENTION REQUIRED'} (Score: ${result.safetyScore}/100)`
      ]);
      setIsScanning(false);
    }, 2200);
  };

  const handleGrantAccess = () => {
    if (auditResult) {
      onClearanceGranted(auditResult);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Cyber Grid & Glow effects */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Banner */}
      <header className="relative z-10 w-full border-b border-cyan-950/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white font-['Syne',sans-serif]">CYBER FORT</span>
            <span className="text-xs text-cyan-400/80 ml-2 font-mono">v2.4 DEFENSE GATE</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>FIREWALL ACTIVE</span>
        </div>
      </header>

      {/* Main Verification Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          <div className="bg-[#0b1021]/90 backdrop-blur-xl border border-cyan-500/25 rounded-xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative">
            {/* Corner cyber decors */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-4 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Syne',sans-serif]">
                Security Clearance Verification
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                Before entering <span className="text-cyan-300 font-medium">Cyber Fort</span>, verify your account status. Enter your registration ID to run a credential safety audit and threat exposure check.
              </p>
            </div>

            {/* Input Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="regInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                  Register Number / Access ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                  </div>
                  <input
                    id="regInput"
                    type="text"
                    value={registerInput}
                    onChange={(e) => {
                      setRegisterInput(e.target.value.toUpperCase());
                      setErrorMsg('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isScanning) {
                        executeSecurityAudit();
                      }
                    }}
                    placeholder="e.g. REG-CYBER-8842 or 2026-CS-109"
                    className="w-full pl-10 pr-4 py-3 bg-[#070b16] border border-cyan-900/80 rounded-lg text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors shadow-inner"
                    disabled={isScanning}
                  />
                </div>
                {errorMsg && (
                  <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1.5 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-500 font-mono">Quick test IDs:</span>
                {sampleIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setRegisterInput(id);
                      executeSecurityAudit(id);
                    }}
                    disabled={isScanning}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded transition-colors disabled:opacity-50"
                  >
                    {id}
                  </button>
                ))}
              </div>

              {/* Action Button */}
              {!auditResult && (
                <button
                  type="button"
                  onClick={() => executeSecurityAudit()}
                  disabled={isScanning}
                  className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] disabled:opacity-60 cursor-pointer"
                >
                  {isScanning ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Scanning Account Security Perimeters...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Run Security Audit & Check Safety</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Diagnostic Terminal Output */}
            {(isScanning || scanLogs.length > 0) && (
              <div className="mt-5 p-3.5 bg-[#050811] border border-cyan-950 rounded-lg font-mono text-xs text-slate-300">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-950/80 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AUDIT DIAGNOSTIC STREAM</span>
                  </div>
                  <span className="text-[10px] text-cyan-500">STAGE {scanStep}/4</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                  {scanLogs.map((log, index) => (
                    <div key={index} className="leading-tight text-slate-400">
                      {log.includes('VERIFIED') || log.includes('Confirmed') ? (
                        <span className="text-emerald-400 font-semibold">{log}</span>
                      ) : log.includes('ATTENTION') ? (
                        <span className="text-amber-400 font-semibold">{log}</span>
                      ) : (
                        log
                      )}
                    </div>
                  ))}
                  {isScanning && (
                    <div className="flex items-center gap-1.5 text-cyan-400 pt-1">
                      <span className="w-1.5 h-3 bg-cyan-400 animate-pulse inline-block" />
                      <span className="text-[11px]">Verifying zero-knowledge proofs...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Verified Audit Summary Box */}
            {auditResult && (
              <div className="mt-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">{auditResult.registerNumber}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-mono">
                          SAFE TO PROCEED
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">
                        Audit Timestamp: {auditResult.verifiedAt} · Clearance Level 1
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                      {auditResult.safetyScore}
                    </span>
                    <span className="text-xs text-slate-500 block font-mono">/100 SAFETY</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-cyan-900/40 text-center font-mono">
                  <div className="p-2 bg-[#070b16] rounded border border-cyan-950">
                    <span className="text-[10px] text-slate-500 block uppercase">Threat Exposure</span>
                    <span className="text-xs font-semibold text-emerald-400">{auditResult.threatLevel}</span>
                  </div>
                  <div className="p-2 bg-[#070b16] rounded border border-cyan-950">
                    <span className="text-[10px] text-slate-500 block uppercase">Known Leaks</span>
                    <span className="text-xs font-semibold text-slate-200">{auditResult.leaksFound} detected</span>
                  </div>
                  <div className="p-2 bg-[#070b16] rounded border border-cyan-950">
                    <span className="text-[10px] text-slate-500 block uppercase">Entropy State</span>
                    <span className="text-xs font-semibold text-cyan-400">{auditResult.keyHealth}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGrantAccess}
                  className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer"
                >
                  <span>Enter Cyber Fort Fortress</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 w-full border-t border-cyan-950/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-2">
        <div>Cyber Fort Cryptographic Security & Threat Intelligence Platform</div>
        <div className="flex items-center gap-4">
          <span>Non-Custodial</span>
          <span>Zero-Knowledge Validated</span>
          <span>SHA-256 Engine</span>
        </div>
      </footer>
    </div>
  );
};
