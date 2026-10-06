import React, { useState } from 'react';
import { 
  X, Shield, Flag, Award, Terminal, FileCode, CheckCircle2, 
  AlertTriangle, Copy, Check, ExternalLink, HelpCircle, ArrowRight,
  Database, Lock, Eye, KeyRound, Cpu
} from 'lucide-react';
import { CtfChallenge } from '../../types/ctf';

interface ChallengeModalProps {
  challenge: CtfChallenge | null;
  isOpen: boolean;
  onClose: () => void;
  isSolved: boolean;
  onFlagSubmit: (challengeId: string, flag: string) => Promise<{ success: boolean; message: string }>;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  challenge,
  isOpen,
  onClose,
  isSolved,
  onFlagSubmit
}) => {
  const [flagInput, setFlagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [activeArtifactTab, setActiveArtifactTab] = useState<number>(0);
  const [copiedArtifact, setCopiedArtifact] = useState<boolean>(false);
  const [unlockedHints, setUnlockedHints] = useState<Record<string, boolean>>({});
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'CyberFort Sandbox Terminal [v4.2.0-secure]',
    'Type "help" for commands, "base64 -d <str>", or "hash <str>".'
  ]);

  if (!isOpen || !challenge) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInput.trim()) return;

    setIsSubmitting(true);
    setResultMessage(null);

    const res = await onFlagSubmit(challenge.id, flagInput.trim());
    setIsSubmitting(false);
    setResultMessage({
      success: res.success,
      text: res.message
    });

    if (res.success) {
      setFlagInput('');
    }
  };

  const copyArtifactContent = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedArtifact(true);
    setTimeout(() => setCopiedArtifact(false), 2000);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    const newOutputs = [...terminalOutput, `$ ${cmd}`];

    if (cmd === 'help') {
      newOutputs.push('Available tools: base64 -d <str>, hex <str>, sha256 <str>, clear');
    } else if (cmd === 'clear') {
      setTerminalOutput(['Terminal cleared.']);
      setTerminalInput('');
      return;
    } else if (cmd.startsWith('base64 -d ')) {
      const targetStr = cmd.replace('base64 -d ', '').trim();
      try {
        const decoded = atob(targetStr);
        newOutputs.push(`Decoded: ${decoded}`);
      } catch {
        newOutputs.push('Error: Invalid Base64 payload encoding.');
      }
    } else if (cmd.startsWith('sha256 ')) {
      const targetStr = cmd.replace('sha256 ', '').trim();
      newOutputs.push(`Computing SHA-256 for: "${targetStr}"...`);
    } else {
      newOutputs.push(`Command not recognized: ${cmd}. Type "help" for assistance.`);
    }

    setTerminalOutput(newOutputs);
    setTerminalInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#090d1f] border-2 border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] my-6 overflow-hidden font-sans">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-950 bg-[#050813]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                  {challenge.domain}
                </span>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                  challenge.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  challenge.difficulty === 'Medium' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                  challenge.difficulty === 'Hard' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  {challenge.difficulty}
                </span>
                {isSolved && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
                {challenge.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right font-mono hidden sm:block">
              <span className="text-[11px] text-slate-500 block uppercase">BOUNTY</span>
              <span className="text-lg font-bold text-cyan-300 tabular-nums">+{challenge.points} PTS</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Mission Description & Scenario */}
          <div className="space-y-3 font-mono">
            <div className="p-4 bg-[#060913] border border-cyan-950 rounded-xl space-y-2">
              <span className="text-xs text-cyan-400 uppercase tracking-wider block font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                MISSION BRIEFING & OBJECTIVE
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {challenge.description}
              </p>
              <div className="pt-2 border-t border-cyan-950/80 text-xs text-slate-400">
                <span className="text-slate-500 font-mono">Scenario: </span>
                {challenge.scenario}
              </div>
            </div>

            {challenge.targetEnvironment && (
              <div className="flex items-center justify-between p-3 bg-cyan-950/20 border border-cyan-900/50 rounded-lg text-xs font-mono">
                <span className="text-slate-400">Target Environment:</span>
                <span className="text-cyan-300 font-semibold">{challenge.targetEnvironment}</span>
              </div>
            )}
          </div>

          {/* Artifacts Viewer */}
          {challenge.artifacts && challenge.artifacts.length > 0 && (
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  CHALLENGE ARTIFACTS & EVIDENCE ({challenge.artifacts.length})
                </span>
                <button
                  type="button"
                  onClick={() => copyArtifactContent(challenge.artifacts[activeArtifactTab].content)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedArtifact ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedArtifact ? 'Copied to Clipboard' : 'Copy Artifact'}</span>
                </button>
              </div>

              {/* Artifact Tabs */}
              <div className="flex items-center gap-2 border-b border-cyan-950 pb-1">
                {challenge.artifacts.map((art, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveArtifactTab(idx)}
                    className={`px-3 py-1.5 rounded-t text-xs font-mono transition-colors cursor-pointer ${
                      activeArtifactTab === idx
                        ? 'bg-[#060913] text-cyan-300 border-t border-x border-cyan-800 font-bold'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {art.name}
                  </button>
                ))}
              </div>

              {/* Code/Hex Content Box */}
              <div className="p-4 bg-[#03060c] border border-cyan-950 rounded-xl overflow-x-auto">
                <div className="text-[11px] text-slate-500 pb-2 border-b border-slate-900 mb-2">
                  {challenge.artifacts[activeArtifactTab].description}
                </div>
                <pre className="text-xs text-cyan-300 font-mono leading-relaxed whitespace-pre select-all">
                  {challenge.artifacts[activeArtifactTab].content}
                </pre>
              </div>
            </div>
          )}

          {/* Quick Sandbox Terminal Tool */}
          <div className="p-4 bg-[#050811] border border-cyan-950 rounded-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                SANDBOX RECON TERMINAL
              </span>
              <span className="text-[10px] text-slate-600">CLIENT UTILITY</span>
            </div>
            <div className="p-3 bg-[#020409] border border-cyan-950 rounded-lg max-h-28 overflow-y-auto space-y-1 text-slate-400 font-mono text-[11px]">
              {terminalOutput.map((line, i) => (
                <div key={i} className={line.startsWith('$') ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
                  {line}
                </div>
              ))}
            </div>
            <form onSubmit={handleTerminalSubmit} className="flex gap-2">
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder='Try: base64 -d Q1lCRVJGT1JUR3czbGMwbTNfdDBfdGgzX2YwcnRyM3NzXzIwMjZ9'
                className="flex-1 px-3 py-1.5 bg-[#020409] border border-cyan-950 rounded text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded text-xs font-mono cursor-pointer"
              >
                Exec
              </button>
            </form>
          </div>

          {/* Tactical Hints */}
          {challenge.hints && challenge.hints.length > 0 && (
            <div className="space-y-2 font-mono text-xs">
              <span className="text-slate-400 uppercase tracking-wider font-semibold block">
                Tactical Hints:
              </span>
              {challenge.hints.map((hint) => {
                const isUnlocked = unlockedHints[hint.id] || hint.cost === 0;
                return (
                  <div key={hint.id} className="p-3 bg-[#060913] border border-cyan-950 rounded-lg">
                    {isUnlocked ? (
                      <div className="text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{hint.text}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Encrypted Hint ({hint.cost} PTS penalty)</span>
                        <button
                          type="button"
                          onClick={() => setUnlockedHints(prev => ({ ...prev, [hint.id]: true }))}
                          className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer"
                        >
                          Unlock Hint
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Flag Submission Form */}
          <div className="pt-4 border-t border-cyan-950 space-y-3 font-mono">
            {challenge.id === 'sanity-check' && (
              <div className="p-3.5 bg-gradient-to-r from-cyan-950/60 to-emerald-950/60 border border-cyan-500/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
                <div>
                  <span className="text-cyan-300 font-bold block mb-0.5">
                    🎉 Welcome Cadet! Here is your free starter flag:
                  </span>
                  <code className="text-emerald-400 font-bold text-xs sm:text-sm select-all">
                    CYBERFORT&#123;w3lc0m3_t0_th3_f0rtr3ss_2026&#125;
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => setFlagInput('CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026}')}
                  className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                >
                  <span>Auto-Fill Flag</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider block">
                Flag Submission Input
              </span>
              <span className="text-[11px] text-slate-500">
                Format: <code className="text-cyan-400">{challenge.flagFormat}</code>
              </span>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder={challenge.flagFormat}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-[#060913] border border-cyan-900 rounded-xl text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="submit"
                disabled={isSubmitting || !flagInput.trim()}
                className="py-3 px-6 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Flag className="w-4 h-4" />
                    <span>Submit Flag</span>
                  </>
                )}
              </button>
            </form>

            {/* Submission Result Feedback */}
            {resultMessage && (
              <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed flex items-start gap-2.5 ${
                resultMessage.success
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/60 text-rose-300'
              }`}>
                {resultMessage.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                )}
                <span>{resultMessage.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
