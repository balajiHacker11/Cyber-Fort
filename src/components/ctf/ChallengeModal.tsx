import React, { useState } from 'react';
import { 
  X, Shield, Flag, Award, FileCode, CheckCircle2, 
  AlertTriangle, Copy, Check, ExternalLink, HelpCircle, ArrowRight,
  Database, Lock, Eye, KeyRound, Cpu, Download, Sparkles, Terminal, FileText,
  Play, Monitor
} from 'lucide-react';
import { CtfChallenge } from '../../types/ctf';

interface ChallengeModalProps {
  challenge: CtfChallenge | null;
  isOpen: boolean;
  onClose: () => void;
  isSolved: boolean;
  onFlagSubmit: (challengeId: string, flag: string) => Promise<{ success: boolean; message: string }>;
  onQuizCorrect?: (challengeId: string, points: number) => void;
  solvedQuizIds?: string[];
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  challenge,
  isOpen,
  onClose,
  isSolved,
  onFlagSubmit,
  onQuizCorrect,
  solvedQuizIds = []
}) => {
  const [flagInput, setFlagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [activeArtifactTab, setActiveArtifactTab] = useState<number>(0);
  const [copiedArtifact, setCopiedArtifact] = useState<boolean>(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [unlockedHints, setUnlockedHints] = useState<Record<string, boolean>>({});

  // Quiz State
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Terminal Flag Extraction State (Microsoft Windows & Linux)
  const [terminalPlatform, setTerminalPlatform] = useState<'powershell' | 'cmd' | 'linux'>('powershell');
  const [copiedTerminalCmd, setCopiedTerminalCmd] = useState<boolean>(false);
  const [isSimulatingTerminal, setIsSimulatingTerminal] = useState<boolean>(false);
  const [simulatedTerminalOutput, setSimulatedTerminalOutput] = useState<{ command: string; output: string } | null>(null);

  if (!isOpen || !challenge) return null;

  const currentQuiz = challenge.quiz;
  const isQuizAlreadySolved = currentQuiz ? solvedQuizIds.includes(currentQuiz.id) : false;

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

  // Real file download for terminal Windows/PowerShell/CMD usage
  const downloadArtifactFile = (artName: string, content: string) => {
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = artName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadNotice(`Downloaded "${artName}". Ready for Windows Terminal / CMD / PowerShell analysis!`);
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch {
      setDownloadNotice('Download failed. You can copy the artifact text directly.');
      setTimeout(() => setDownloadNotice(null), 3000);
    }
  };

  // Quiz submission evaluation
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuiz || selectedQuizOption === null) return;

    setQuizSubmitted(true);
    if (selectedQuizOption === currentQuiz.correctOptionIndex) {
      const isFirstSolve = !isQuizAlreadySolved;
      setQuizFeedback({
        isCorrect: true,
        message: isFirstSolve
          ? `Correct answer! +${currentQuiz.points} points awarded directly to your tournament score!`
          : `Correct answer verified! (Points previously recorded).`
      });
      if (isFirstSolve && onQuizCorrect) {
        onQuizCorrect(currentQuiz.id, currentQuiz.points);
      }
    } else {
      setQuizFeedback({
        isCorrect: false,
        message: 'Incorrect answer. Review the mission brief, scenario, and technical takeaway, then try again!'
      });
    }
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
              <span className="text-[11px] text-slate-500 block uppercase">FLAG BOUNTY</span>
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

          {/* Artifacts Viewer with Real File Download for Windows Terminal */}
          {challenge.artifacts && challenge.artifacts.length > 0 && (
            <div className="space-y-3 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  CHALLENGE ARTIFACTS & EVIDENCE ({challenge.artifacts.length})
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => downloadArtifactFile(
                      challenge.artifacts[activeArtifactTab].name,
                      challenge.artifacts[activeArtifactTab].content
                    )}
                    className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-300 text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    title="Download file to inspect or run in Windows Terminal / CMD / PowerShell"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download File ({challenge.artifacts[activeArtifactTab].name})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyArtifactContent(challenge.artifacts[activeArtifactTab].content)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedArtifact ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedArtifact ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Download notification banner */}
              {downloadNotice && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{downloadNotice}</span>
                </div>
              )}

              {/* Artifact Tabs */}
              <div className="flex items-center gap-2 border-b border-cyan-950 pb-1 overflow-x-auto">
                {challenge.artifacts.map((art, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveArtifactTab(idx)}
                    className={`px-3 py-1.5 rounded-t text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      activeArtifactTab === idx
                        ? 'bg-[#060913] text-cyan-300 border-t border-x border-cyan-800 font-bold'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    <span>{art.name}</span>
                  </button>
                ))}
              </div>

              {/* Code/Hex Content Box */}
              <div className="p-4 bg-[#03060c] border border-cyan-950 rounded-xl overflow-x-auto relative group">
                <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-900 mb-2">
                  <span>{challenge.artifacts[activeArtifactTab].description}</span>
                  <span className="text-[10px] text-cyan-500 font-mono">
                    Windows Terminal Ready
                  </span>
                </div>
                <pre className="text-xs text-cyan-300 font-mono leading-relaxed whitespace-pre select-all max-h-56 overflow-y-auto">
                  {challenge.artifacts[activeArtifactTab].content}
                </pre>
              </div>

              {/* Terminal Flag Findings Lab (Microsoft & Linux Terminal) */}
              <div className="p-4 bg-[#050814] border border-cyan-800/60 rounded-xl space-y-3 font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-cyan-950">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400">
                      <Terminal className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                        TERMINAL FLAG EXTRACTION LAB
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Execute on Microsoft Windows or Linux Terminal against the downloaded artifact
                      </span>
                    </div>
                  </div>

                  {/* Terminal Platform Selector */}
                  <div className="flex items-center gap-1 bg-[#02050f] p-1 rounded-lg border border-cyan-950 text-xs">
                    <button
                      type="button"
                      onClick={() => setTerminalPlatform('powershell')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        terminalPlatform === 'powershell'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <span>🪟 PowerShell</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTerminalPlatform('cmd')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        terminalPlatform === 'cmd'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <span>🪟 Windows CMD</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTerminalPlatform('linux')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        terminalPlatform === 'linux'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <span>🐧 Linux / Kali / WSL</span>
                    </button>
                  </div>
                </div>

                {/* Command display and copy bar */}
                {(() => {
                  const currentArtifact = challenge.artifacts[activeArtifactTab];
                  const currentCmd = terminalPlatform === 'powershell'
                    ? (challenge.terminalGuidance?.windowsPowershell || `Get-Content .\\${currentArtifact.name} | Select-String -Pattern "CYBERFORT{.*}"`)
                    : terminalPlatform === 'cmd'
                    ? (challenge.terminalGuidance?.windowsCmd || `findstr "CYBERFORT" ${currentArtifact.name}`)
                    : (challenge.terminalGuidance?.linuxBash || `grep -oE "CYBERFORT\\{[^\\}]+\\}" ${currentArtifact.name}`);

                  const promptLabel = terminalPlatform === 'powershell'
                    ? 'PS C:\\Downloads>'
                    : terminalPlatform === 'cmd'
                    ? 'C:\\Downloads>'
                    : 'cadet@fortress:~/Downloads$';

                  const expectedOutput = challenge.terminalGuidance?.expectedOutput || 'CYBERFORT{...}';

                  const handleCopyCommand = () => {
                    navigator.clipboard.writeText(currentCmd);
                    setCopiedTerminalCmd(true);
                    setTimeout(() => setCopiedTerminalCmd(false), 2000);
                  };

                  const handleRunSimulated = () => {
                    setIsSimulatingTerminal(true);
                    setTimeout(() => {
                      setIsSimulatingTerminal(false);
                      setSimulatedTerminalOutput({
                        command: currentCmd,
                        output: expectedOutput
                      });
                    }, 500);
                  };

                  return (
                    <div className="space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-[#02050f] border border-cyan-950 rounded-lg">
                        <div className="flex items-center gap-2 overflow-x-auto text-xs flex-1">
                          <span className="text-cyan-500 font-bold shrink-0">{promptLabel}</span>
                          <code className="text-slate-200 select-all font-mono whitespace-nowrap">
                            {currentCmd}
                          </code>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={handleCopyCommand}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] rounded flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copy command to clipboard"
                          >
                            {copiedTerminalCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedTerminalCmd ? 'Copied' : 'Copy Command'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleRunSimulated}
                            disabled={isSimulatingTerminal}
                            className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 text-[11px] rounded flex items-center gap-1 transition-colors cursor-pointer"
                            title="Simulate command output in in-browser terminal"
                          >
                            {isSimulatingTerminal ? (
                              <Cpu className="w-3 h-3 animate-spin text-emerald-400" />
                            ) : (
                              <Play className="w-3 h-3 text-emerald-400" />
                            )}
                            <span>{isSimulatingTerminal ? 'Running...' : 'Run Terminal Test'}</span>
                          </button>
                        </div>
                      </div>

                      {challenge.terminalGuidance?.explanation && (
                        <div className="text-[11px] text-slate-400 leading-relaxed font-sans">
                          <strong>Command Insight: </strong>
                          {challenge.terminalGuidance.explanation}
                        </div>
                      )}

                      {/* Live Terminal Output Console */}
                      {simulatedTerminalOutput && (
                        <div className="p-3 bg-[#010309] border border-emerald-900/60 rounded-xl space-y-2 animate-in fade-in duration-200 shadow-inner">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1.5 border-b border-slate-900">
                            <span className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
                              <Monitor className="w-3.5 h-3.5" />
                              TERMINAL EXECUTION STDOUT
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Exit Code: 0 (SUCCESS)
                            </span>
                          </div>

                          <div className="text-xs font-mono space-y-1">
                            <div className="text-slate-400">
                              {promptLabel} <span className="text-cyan-300">{simulatedTerminalOutput.command}</span>
                            </div>
                            <div className="text-emerald-400 font-bold pl-2 select-all flex items-center gap-2">
                              <span>{simulatedTerminalOutput.output}</span>
                            </div>
                          </div>

                          <div className="pt-1 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setFlagInput(simulatedTerminalOutput.output);
                                const inputElem = document.querySelector('input[placeholder="CYBERFORT{...}"]') as HTMLInputElement;
                                if (inputElem) inputElem.focus();
                              }}
                              className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-[11px] rounded flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <ArrowRight className="w-3 h-3 text-cyan-400" />
                              <span>Paste Discovered Flag into Submission Box</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Relevant Quiz Section (Replaced Sandbox Terminal) */}
          {currentQuiz && (
            <div className="p-5 bg-[#050918] border border-cyan-500/40 rounded-xl space-y-4 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-cyan-950">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-300 font-bold text-xs">
                    ?
                  </div>
                  <div>
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wide">
                      RELEVANT TECHNICAL QUIZ
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Answer correctly to earn <strong>+{currentQuiz.points} points</strong>
                    </span>
                  </div>
                </div>

                {isQuizAlreadySolved ? (
                  <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    QUIZ SOLVED (+50 PTS)
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded bg-amber-950/80 text-amber-400 border border-amber-700 text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    +50 PTS AVAILABLE
                  </span>
                )}
              </div>

              {/* Question Text */}
              <div className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed font-semibold">
                {currentQuiz.question}
              </div>

              {/* Multiple Choice Options */}
              <form onSubmit={handleQuizSubmit} className="space-y-2.5">
                <div className="space-y-2">
                  {currentQuiz.options.map((option, optIdx) => {
                    const isSelected = selectedQuizOption === optIdx;
                    return (
                      <label
                        key={optIdx}
                        onClick={() => setSelectedQuizOption(optIdx)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                            : 'bg-[#02050f] border-cyan-950/80 text-slate-300 hover:border-cyan-800 hover:text-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${currentQuiz.id}`}
                          checked={isSelected}
                          onChange={() => setSelectedQuizOption(optIdx)}
                          className="mt-0.5 text-cyan-400 focus:ring-cyan-400"
                        />
                        <span className="leading-relaxed font-sans">{option}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500">
                    {selectedQuizOption !== null ? 'Option selected. Submit to lock in score.' : 'Select an answer above.'}
                  </span>

                  <button
                    type="submit"
                    disabled={selectedQuizOption === null}
                    className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-40 cursor-pointer"
                  >
                    Submit Quiz Answer (+50 PTS)
                  </button>
                </div>
              </form>

              {/* Quiz Result Feedback */}
              {quizFeedback && (
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                  quizFeedback.isCorrect
                    ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
                    : 'bg-rose-950/50 border-rose-500/60 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2 font-bold font-mono">
                    {quizFeedback.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{quizFeedback.message}</span>
                  </div>
                  {quizFeedback.isCorrect && currentQuiz.explanation && (
                    <div className="text-slate-300 text-[11px] font-sans pt-1 border-t border-emerald-900/50">
                      <strong>Deconstruction: </strong>{currentQuiz.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
