import React, { useState, useEffect } from 'react';
import { 
  BookOpen, CheckCircle2, Award, RotateCcw, AlertTriangle, ShieldCheck, 
  ArrowRight, Filter, Sparkles, Download, Check
} from 'lucide-react';
import { SECURITY_MODULES } from '../data/cyberSecurityData';
import { UserClearance } from '../types';
import { CompletionCertificateModal } from './CompletionCertificateModal';

interface DefenseTutorialsProps {
  clearance: UserClearance;
}

export const DefenseTutorials: React.FC<DefenseTutorialsProps> = ({ clearance }) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('course-1');
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [submittedQuizzes, setSubmittedQuizzes] = useState<Record<string, boolean>>({});
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);

  const categories = ['All', 'Web Security', 'Blue Team Defense', 'OSINT & Recon', 'Cryptography', 'Network Security', 'Ethical Hacking'];

  const filteredModules = selectedCategory === 'All'
    ? SECURITY_MODULES
    : SECURITY_MODULES.filter(m => m.category === selectedCategory);

  const currentModule = SECURITY_MODULES.find((m) => m.id === selectedModuleId) || SECURITY_MODULES[0];

  const handleSelectAnswer = (moduleId: string, optionIndex: number) => {
    if (submittedQuizzes[moduleId]) return;
    setQuizAnswers((prev) => ({ ...prev, [moduleId]: optionIndex }));
  };

  const handleSubmitQuiz = (moduleId: string) => {
    if (quizAnswers[moduleId] === undefined) return;
    setSubmittedQuizzes((prev) => {
      const updated = { ...prev, [moduleId]: true };
      // Check if all 6 are now completed
      const allPassed = SECURITY_MODULES.every(
        (m) => (m.id === moduleId ? quizAnswers[moduleId] === m.quiz.correctIndex : updated[m.id] && quizAnswers[m.id] === m.quiz.correctIndex)
      );
      if (allPassed) {
        setIsCertificateModalOpen(true);
      }
      return updated;
    });
  };

  const handleResetQuiz = (moduleId: string) => {
    setQuizAnswers((prev) => {
      const copy = { ...prev };
      delete copy[moduleId];
      return copy;
    });
    setSubmittedQuizzes((prev) => {
      const copy = { ...prev };
      delete copy[moduleId];
      return copy;
    });
  };

  // Demo helper: auto-complete all 6 courses with correct answers
  const handleAutoCompleteAll = () => {
    const allAnswers: Record<string, number> = {};
    const allSubmitted: Record<string, boolean> = {};
    SECURITY_MODULES.forEach((m) => {
      allAnswers[m.id] = m.quiz.correctIndex;
      allSubmitted[m.id] = true;
    });
    setQuizAnswers(allAnswers);
    setSubmittedQuizzes(allSubmitted);
    setIsCertificateModalOpen(true);
  };

  const completedCount = Object.keys(submittedQuizzes).filter((id) => {
    const mod = SECURITY_MODULES.find((m) => m.id === id);
    return mod && quizAnswers[id] === mod.quiz.correctIndex;
  }).length;

  const isAllCompleted = completedCount === SECURITY_MODULES.length;

  return (
    <div className="space-y-8 font-sans">
      {/* Academy Header */}
      <div className="bg-[#090e1f] border border-cyan-900/40 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        {/* Glow backdrop if all completed */}
        {isAllCompleted && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent pointer-events-none" />
        )}

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <BookOpen className="w-4 h-4" />
            <span>EXPANDED CYBER DEFENSE SIMULATION CURRICULUM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Syne',sans-serif] tracking-tight">
            Cyber Fort Defense Academy & Masterclasses
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            In-depth simulation courses covering Web Security, Blue Team SOC defense, OSINT reconnaissance, Applied Cryptography, Network Hardening, and Ethical Hacking.
          </p>

          <div className="flex items-center gap-3 pt-2 font-mono text-xs">
            <span className="text-slate-500">Operator ID: <strong className="text-cyan-300">{clearance.registerNumber}</strong></span>
            <span className="text-slate-600">·</span>
            <button
              type="button"
              onClick={handleAutoCompleteAll}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
              title="Instantly pass all 6 quizzes for demonstration"
            >
              Demo: Quick Complete All Courses
            </button>
          </div>
        </div>

        {/* Progress & Badge Box */}
        <div className="relative z-10 p-4 bg-[#060913] border border-cyan-950 rounded-xl min-w-[260px] text-right font-mono shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>COURSE CERTIFICATION</span>
            <span className="text-cyan-400 font-bold">{completedCount}/{SECURITY_MODULES.length} Completed</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / SECURITY_MODULES.length) * 100}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">Status:</span>
            <span className={`font-semibold ${isAllCompleted ? 'text-emerald-400 flex items-center gap-1' : 'text-slate-300'}`}>
              {isAllCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
              {isAllCompleted ? 'Master Shield Earned' : `${completedCount} of 6 Passed`}
            </span>
          </div>

          {isAllCompleted && (
            <button
              type="button"
              onClick={() => setIsCertificateModalOpen(true)}
              className="w-full mt-3 py-2 px-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>View Completion Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Completion Banner When All 6 Modules are Finished */}
      {isAllCompleted && (
        <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/80 via-[#081329] to-emerald-950/80 border-2 border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-900/40 border border-cyan-400/80 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  ALL 6 DEFENSE COURSES COMPLETED!
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                  VERIFIED ACCREDITATION
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Your personalized certificate and digital master defender badge for Register ID <strong className="text-cyan-300">{clearance.registerNumber}</strong> are ready.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCertificateModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>Open Certificate & Badge Modal</span>
          </button>
        </div>
      )}

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
        <span className="text-slate-500 shrink-0">Filter Domain:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                : 'bg-[#090e1f] text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Module Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredModules.map((module) => {
          const isSelected = module.id === selectedModuleId;
          const isPassed = submittedQuizzes[module.id] && quizAnswers[module.id] === module.quiz.correctIndex;
          return (
            <button
              key={module.id}
              type="button"
              onClick={() => {
                setSelectedModuleId(module.id);
                setActiveStageIndex(0);
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-[#090e1f] border-slate-800/80 hover:border-slate-700 hover:bg-[#0c1328]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  COURSE {module.number}
                </span>
                {isPassed && (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white font-mono leading-snug line-clamp-2">
                {module.title}
              </h3>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <span>{module.category}</span>
                <span aria-hidden="true">·</span>
                <span>{module.readTime}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Course Classroom */}
      <div className="bg-[#090e1f] border border-cyan-900/40 rounded-xl p-6 sm:p-8 shadow-xl space-y-8">
        {/* Course Header */}
        <div className="pb-6 border-b border-cyan-950">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mb-2">
            <span className="text-cyan-400 font-bold">COURSE {currentModule.number}</span>
            <span aria-hidden="true">·</span>
            <span>{currentModule.category}</span>
            <span aria-hidden="true">·</span>
            <span>{currentModule.level} Level</span>
            <span aria-hidden="true">·</span>
            <span>{currentModule.readTime}</span>
          </div>
          <h2 className="text-2xl font-bold font-mono text-white">
            {currentModule.title}
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            {currentModule.summary}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-cyan-950/60 text-xs font-mono">
            <span className="text-slate-500">Core Defenses:</span>
            {currentModule.keyConcepts.map((concept, i) => (
              <span key={i} className="text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900/40">
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Multi-Stage Walkthrough */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-mono text-white">
              Course Guided Simulation Stages
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              Stage {activeStageIndex + 1} of {currentModule.stages.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentModule.stages.map((stage, idx) => {
              const isActive = activeStageIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveStageIndex(idx)}
                  className={`p-3 rounded-lg border text-left font-mono transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 font-bold shadow-md'
                      : 'bg-[#060913] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[11px] text-slate-500 mb-0.5">Stage 0{idx + 1}</div>
                  <div className="text-xs text-white truncate">{stage.stageTitle}</div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Card */}
          <div className="p-6 bg-[#060913] border border-cyan-950 rounded-xl space-y-5">
            <div>
              <h4 className="text-lg font-bold font-mono text-white">
                {currentModule.stages[activeStageIndex].stageTitle}
              </h4>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {currentModule.stages[activeStageIndex].description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
              <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-lg space-y-1.5">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Threat Scenario & Attack Vector
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentModule.stages[activeStageIndex].threatIllustration}
                </p>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-lg space-y-1.5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Cyber Fort Hardening Protocol
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentModule.stages[activeStageIndex].protectionRule}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={activeStageIndex === 0}
                onClick={() => setActiveStageIndex((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                ← Previous Stage
              </button>
              <button
                type="button"
                disabled={activeStageIndex === currentModule.stages.length - 1}
                onClick={() => setActiveStageIndex((prev) => Math.min(currentModule.stages.length - 1, prev + 1))}
                className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-mono rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
              >
                Next Stage →
              </button>
            </div>
          </div>
        </div>

        {/* Course Quiz Checkpoint */}
        <div className="p-6 bg-[#060913] border border-cyan-900/40 rounded-xl space-y-5 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-950">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Course Mastery Checkpoint
              </h4>
            </div>
            {submittedQuizzes[currentModule.id] && (
              <button
                type="button"
                onClick={() => handleResetQuiz(currentModule.id)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Retry Checkpoint
              </button>
            )}
          </div>

          <p className="text-sm text-slate-200 font-semibold">
            {currentModule.quiz.question}
          </p>

          <div className="space-y-2.5">
            {currentModule.quiz.options.map((option, optIdx) => {
              const isSelected = quizAnswers[currentModule.id] === optIdx;
              const isSubmitted = submittedQuizzes[currentModule.id];
              const isCorrect = optIdx === currentModule.quiz.correctIndex;

              let buttonStyle = 'bg-[#090e1f] border-slate-800 text-slate-300 hover:border-slate-700';
              if (isSelected) {
                buttonStyle = 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold';
              }
              if (isSubmitted) {
                if (isCorrect) {
                  buttonStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected && !isCorrect) {
                  buttonStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectAnswer(currentModule.id, optIdx)}
                  disabled={isSubmitted}
                  className={`w-full p-3.5 rounded-lg border text-left text-xs font-mono transition-colors flex items-start gap-3 cursor-pointer ${buttonStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px]">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {!submittedQuizzes[currentModule.id] ? (
            <button
              type="button"
              onClick={() => handleSubmitQuiz(currentModule.id)}
              disabled={quizAnswers[currentModule.id] === undefined}
              className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
            >
              Verify Defensive Answer & Claim Course Proof
            </button>
          ) : (
            <div className={`p-4 rounded-lg border text-xs leading-relaxed ${
              quizAnswers[currentModule.id] === currentModule.quiz.correctIndex
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            }`}>
              <span className="font-bold block mb-1">
                {quizAnswers[currentModule.id] === currentModule.quiz.correctIndex
                  ? 'CHECKPOINT PASSED: Verified Defensive Understanding'
                  : 'SECURITY FLAW: Answer Incorrect'}
              </span>
              {currentModule.quiz.explanation}
            </div>
          )}
        </div>
      </div>

      {/* Completion Certificate Modal */}
      <CompletionCertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        clearance={clearance}
      />
    </div>
  );
};
