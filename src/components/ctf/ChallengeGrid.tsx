import React, { useState } from 'react';
import { 
  Flag, CheckCircle2, Search, Filter, Shield, Cpu, Lock, 
  Terminal, Globe, KeyRound, Server, Eye, FileSearch, ArrowRight,
  Database
} from 'lucide-react';
import { CtfChallenge, CtfDomain, CtfDifficulty } from '../../types/ctf';

interface ChallengeGridProps {
  challenges: CtfChallenge[];
  solvedIds: string[];
  onSelectChallenge: (challenge: CtfChallenge) => void;
}

export const ChallengeGrid: React.FC<ChallengeGridProps> = ({
  challenges,
  solvedIds,
  onSelectChallenge
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const domains: (string | CtfDomain)[] = [
    'All',
    'OSINT',
    'Web Exploitation',
    'Cryptography',
    'Digital Forensics',
    'Reverse Engineering',
    'Binary Exploitation (Pwn)',
    'Cloud Security',
    'Network Security'
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Insane'];

  const filteredChallenges = challenges.filter((c) => {
    const matchesDomain = selectedDomain === 'All' || c.domain === selectedDomain;
    const matchesDiff = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDomain && matchesDiff && matchesSearch;
  });

  const getDomainIcon = (domain: CtfDomain) => {
    switch (domain) {
      case 'OSINT': return <Eye className="w-3.5 h-3.5" />;
      case 'Web Exploitation': return <Globe className="w-3.5 h-3.5" />;
      case 'Cryptography': return <Lock className="w-3.5 h-3.5" />;
      case 'Digital Forensics': return <FileSearch className="w-3.5 h-3.5" />;
      case 'Reverse Engineering': return <Cpu className="w-3.5 h-3.5" />;
      case 'Binary Exploitation (Pwn)': return <Terminal className="w-3.5 h-3.5" />;
      case 'Cloud Security': return <Server className="w-3.5 h-3.5" />;
      case 'Network Security': return <Database className="w-3.5 h-3.5" />;
      default: return <Shield className="w-3.5 h-3.5" />;
    }
  };

  const getDomainColor = (domain: CtfDomain) => {
    switch (domain) {
      case 'OSINT': return 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60';
      case 'Web Exploitation': return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
      case 'Cryptography': return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'Digital Forensics': return 'text-blue-400 bg-blue-950/60 border-blue-800/60';
      case 'Reverse Engineering': return 'text-purple-400 bg-purple-950/60 border-purple-800/60';
      case 'Binary Exploitation (Pwn)': return 'text-rose-400 bg-rose-950/60 border-rose-800/60';
      case 'Cloud Security': return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'Network Security': return 'text-sky-400 bg-sky-950/60 border-sky-800/60';
      default: return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Controls Bar: Search & Difficulty Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search challenges by keyword, tag, or CVE..."
            className="w-full pl-10 pr-4 py-2 bg-[#090e1f] border border-cyan-950 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 bg-[#090e1f] p-1 rounded-xl border border-cyan-950 overflow-x-auto text-xs">
          <span className="text-slate-500 px-2 text-[11px] uppercase">Diff:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/80'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        {domains.map((dom) => {
          const isActive = selectedDomain === dom;
          const count = dom === 'All' 
            ? challenges.length 
            : challenges.filter(c => c.domain === dom).length;

          return (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-[#090e1f] text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <span>{dom}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                isActive ? 'bg-cyan-900 text-cyan-200' : 'bg-slate-900 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChallenges.map((challenge) => {
          const isSolved = solvedIds.includes(challenge.id);
          const domainBadgeStyle = getDomainColor(challenge.domain);

          return (
            <div
              key={challenge.id}
              onClick={() => onSelectChallenge(challenge)}
              className={`group p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSolved
                  ? 'bg-[#091522] border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'bg-[#090e1f] border-cyan-950 hover:border-cyan-500/60 hover:bg-[#0c142b] shadow-lg'
              }`}
            >
              {/* Solved Watermark Glow */}
              {isSolved && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              )}

              <div>
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-cyan-950/80 font-mono text-xs">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold text-[11px] ${domainBadgeStyle}`}>
                    {getDomainIcon(challenge.domain)}
                    <span>{challenge.domain}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      challenge.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      challenge.difficulty === 'Medium' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                      challenge.difficulty === 'Hard' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {challenge.difficulty}
                    </span>
                    <span className="font-bold text-cyan-300 font-mono tabular-nums">
                      {challenge.points} PTS
                    </span>
                  </div>
                </div>

                {/* Challenge Title */}
                <div className="flex items-center gap-2 mt-3.5">
                  <h3 className="text-base font-bold text-white font-mono group-hover:text-cyan-300 transition-colors leading-snug">
                    {challenge.title}
                  </h3>
                  {challenge.id === 'sanity-check' && !isSolved && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/50 text-[10px] font-mono font-bold animate-pulse whitespace-nowrap">
                      FREE FLAG
                    </span>
                  )}
                </div>

                {/* Brief Excerpt */}
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-cyan-950/60 font-mono">
                  {challenge.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-cyan-950/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">
                  {challenge.initialSolves + (isSolved ? 1 : 0)} solves
                </span>

                {isSolved ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>FLAG CAPTURED</span>
                  </span>
                ) : (
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px] font-semibold">
                    <span>Inspect Target</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
