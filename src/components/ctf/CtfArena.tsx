import React, { useState, useEffect } from 'react';
import { 
  Flag, Trophy, BookOpen, Shield, Clock, Award, Terminal, 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Zap, RefreshCw
} from 'lucide-react';
import { UserClearance } from '../../types';
import { CtfChallenge, LeaderboardUser } from '../../types/ctf';
import { CTF_CHALLENGES, INITIAL_LEADERBOARD } from '../../data/ctfData';
import { ChallengeGrid } from './ChallengeGrid';
import { ChallengeModal } from './ChallengeModal';
import { Leaderboard } from './Leaderboard';
import { WriteupsSection } from './WriteupsSection';

interface CtfArenaProps {
  clearance: UserClearance;
}

export const CtfArena: React.FC<CtfArenaProps> = ({ clearance }) => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'writeups'>('challenges');
  const [selectedChallenge, setSelectedChallenge] = useState<CtfChallenge | null>(null);
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cyberfort_ctf_solved');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Helper to extract initials for user avatar badge
  const getAvatarInitials = (name?: string, regId?: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.trim().slice(0, 2).toUpperCase();
    }
    return (regId?.slice(-2) || 'YOU').toUpperCase();
  };

  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(() => {
    const regId = clearance.registerNumber || 'CADET-DEFENDER';
    const displayName = clearance.fullName?.trim() || `Operator_${regId.replace(/[^a-zA-Z0-9]/g, '').slice(-4) || 'Cadet'}`;
    const currentUser: LeaderboardUser = {
      id: 'current-user',
      username: displayName,
      fullName: clearance.fullName?.trim() || displayName,
      registerNumber: regId,
      avatar: getAvatarInitials(clearance.fullName, regId),
      points: 0,
      solvedIds: [],
      lastSolveAt: 'Awaiting first capture',
      affiliation: `Fortress Defense Unit (${regId})`,
      isCurrentUser: true
    };
    // Only genuine registered participant, no example members
    return [currentUser];
  });

  // Calculate current user's earned points
  const userPoints = solvedIds.reduce((sum, id) => {
    const ch = CTF_CHALLENGES.find(c => c.id === id);
    return sum + (ch ? ch.points : 0);
  }, 0);

  // Sync current user points, name, and profile into leaderboard state
  useEffect(() => {
    const regId = clearance.registerNumber || 'CADET-DEFENDER';
    const displayName = clearance.fullName?.trim() || `Operator_${regId.replace(/[^a-zA-Z0-9]/g, '').slice(-4) || 'Cadet'}`;
    const initials = getAvatarInitials(clearance.fullName, regId);

    setLeaderboardUsers(prev => {
      const exists = prev.some(u => u.id === 'current-user');
      if (!exists) {
        return [{
          id: 'current-user',
          username: displayName,
          fullName: clearance.fullName?.trim() || displayName,
          registerNumber: regId,
          avatar: initials,
          points: userPoints,
          solvedIds: solvedIds,
          lastSolveAt: solvedIds.length > 0 ? 'Just now' : 'Awaiting first capture',
          affiliation: `Fortress Defense Unit (${regId})`,
          isCurrentUser: true
        }];
      }
      return prev.map(u => {
        if (u.id === 'current-user') {
          return {
            ...u,
            username: displayName,
            fullName: clearance.fullName?.trim() || displayName,
            registerNumber: regId,
            avatar: initials,
            points: userPoints,
            solvedIds: solvedIds,
            lastSolveAt: solvedIds.length > 0 ? (u.points !== userPoints ? 'Just now' : u.lastSolveAt) : 'Awaiting first capture'
          };
        }
        return u;
      });
    });
  }, [solvedIds, userPoints, clearance.fullName, clearance.registerNumber]);

  // Client-side SHA-256 fallback helper
  const computeClientSha256 = async (str: string): Promise<string> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(str.trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return '';
    }
  };

  // Flag verification handler (Primary: Vercel serverless /api/verify-flag, Fallback: Client SHA-256)
  const handleFlagSubmit = async (challengeId: string, submittedFlag: string) => {
    const targetChallenge = CTF_CHALLENGES.find(c => c.id === challengeId);
    if (!targetChallenge) {
      return { success: false, message: 'Challenge not found.' };
    }

    if (solvedIds.includes(challengeId)) {
      return { success: true, message: 'You have already captured this flag!' };
    }

    // Attempt Serverless API verification
    try {
      const response = await fetch('/api/verify-flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          flag: submittedFlag.trim(),
          registerNumber: clearance.registerNumber
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const newSolved = [...solvedIds, challengeId];
          setSolvedIds(newSolved);
          try {
            localStorage.setItem('cyberfort_ctf_solved', JSON.stringify(newSolved));
          } catch {}
          return { success: true, message: data.message || `Flag Captured! +${targetChallenge.points} PTS awarded.` };
        } else {
          return { success: false, message: data.message || 'Incorrect flag. Check formatting.' };
        }
      }
    } catch {
      // Fallback to local client SHA-256 hash match
    }

    // Client fallback check
    const clientHash = await computeClientSha256(submittedFlag);
    if (clientHash === targetChallenge.flagHash) {
      const newSolved = [...solvedIds, challengeId];
      setSolvedIds(newSolved);
      try {
        localStorage.setItem('cyberfort_ctf_solved', JSON.stringify(newSolved));
      } catch {}
      return {
        success: true,
        message: `Flag Captured! +${targetChallenge.points} PTS awarded. Verified under cryptographic hash.`
      };
    } else {
      return {
        success: false,
        message: 'Incorrect flag. Double-check decoded payloads, whitespace, and capitalization.'
      };
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* CTF Arena Hero HUD */}
      <section className="bg-[#090e1f] border border-cyan-900/40 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-cyan-400" />
                CYBER FORT CTF // SEASON 2026
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                COMPETITION ACTIVE
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 font-mono">Operator: <strong className="text-white">{clearance.fullName || 'Cadet Defender'}</strong></span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 font-mono">ID: <strong className="text-cyan-300">{clearance.registerNumber}</strong></span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Syne',sans-serif] tracking-tight">
              Capture The Flag (CTF) Arena
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Solve multi-domain offensive security challenges across OSINT, Web Exploitation, Cryptography, Forensics, Reverse Engineering, Pwn, Cloud, and Network Security.
            </p>
          </div>

          {/* User Score Stats Pill */}
          <div className="lg:col-span-4 p-5 bg-[#060913] border border-cyan-950 rounded-2xl space-y-3 font-mono shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-cyan-950">
              <span>YOUR TOURNAMENT SCORE</span>
              <span className="text-cyan-400 font-bold">{solvedIds.length}/{CTF_CHALLENGES.length} SOLVES</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-cyan-300 tabular-nums">
                {userPoints}
                <span className="text-sm text-slate-500 font-normal ml-1">PTS</span>
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                {solvedIds.length === CTF_CHALLENGES.length ? 'ALL FLAGS CAPTURED' : 'Rank Updating'}
              </span>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(solvedIds.length / CTF_CHALLENGES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* CTF Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-cyan-950/80 font-mono text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'challenges'
                ? 'bg-cyan-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-[#060913] text-slate-300 hover:text-white border border-cyan-950 hover:border-cyan-800'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Target Challenges ({CTF_CHALLENGES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-cyan-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-[#060913] text-slate-300 hover:text-white border border-cyan-950 hover:border-cyan-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Live Leaderboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('writeups')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'writeups'
                ? 'bg-cyan-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-[#060913] text-slate-300 hover:text-white border border-cyan-950 hover:border-cyan-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Write-ups & Resources</span>
          </button>
        </div>
      </section>

      {/* Main View Mode */}
      {activeTab === 'challenges' && (
        <ChallengeGrid
          challenges={CTF_CHALLENGES}
          solvedIds={solvedIds}
          onSelectChallenge={(ch) => setSelectedChallenge(ch)}
        />
      )}

      {activeTab === 'leaderboard' && (
        <Leaderboard
          users={leaderboardUsers}
          currentUserId="current-user"
          challenges={CTF_CHALLENGES}
        />
      )}

      {activeTab === 'writeups' && (
        <WriteupsSection />
      )}

      {/* Challenge Inspector Modal */}
      <ChallengeModal
        challenge={selectedChallenge}
        isOpen={selectedChallenge !== null}
        onClose={() => setSelectedChallenge(null)}
        isSolved={selectedChallenge ? solvedIds.includes(selectedChallenge.id) : false}
        onFlagSubmit={handleFlagSubmit}
      />
    </div>
  );
};
