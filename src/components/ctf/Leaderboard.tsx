import React, { useState } from 'react';
import { 
  Trophy, Medal, Award, CheckCircle2, TrendingUp, Shield, 
  Users, Zap, Clock, Terminal, UserPlus, X, Check, ArrowRight
} from 'lucide-react';
import { LeaderboardUser, CtfChallenge } from '../../types/ctf';
import { UserClearance } from '../../types';

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserId: string;
  challenges: CtfChallenge[];
  onAddAttendee?: (name: string, regId: string) => void;
  currentUserClearance?: UserClearance;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  users,
  currentUserId,
  challenges,
  onAddAttendee,
  currentUserClearance
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRegId, setNewRegId] = useState('');
  const [formError, setFormError] = useState('');

  // Sort users by points descending, then by solvedIds length descending
  const sortedUsers = [...users].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.solvedIds.length - a.solvedIds.length;
  });

  const currentUserRank = sortedUsers.findIndex(
    u => u.id === currentUserId || u.registerNumber === currentUserClearance?.registerNumber
  ) + 1;
  const topScore = sortedUsers[0]?.points ?? 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName.trim().length < 2) {
      setFormError('Please enter operator full name (min 2 characters)');
      return;
    }
    if (!newRegId.trim() || newRegId.trim().length < 3) {
      setFormError('Please enter operator registration ID (min 3 characters)');
      return;
    }
    setFormError('');
    if (onAddAttendee) {
      onAddAttendee(newName.trim(), newRegId.trim().toUpperCase());
    }
    setNewName('');
    setNewRegId('');
    setShowAddModal(false);
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            🥇
          </span>
        );
      case 2:
        return (
          <span className="w-8 h-8 rounded-lg bg-slate-300/20 border border-slate-300 text-slate-100 flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            🥈
          </span>
        );
      case 3:
        return (
          <span className="w-8 h-8 rounded-lg bg-amber-700/25 border border-amber-600 text-amber-500 flex items-center justify-center font-bold text-sm">
            🥉
          </span>
        );
      default:
        return (
          <span className="w-8 h-8 rounded-lg bg-[#070b16] border border-cyan-950 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Telemetry Stats Cards in Realtime Cyber Fonts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-[#090e1f] border border-cyan-900/60 rounded-xl relative overflow-hidden shadow-lg">
          <div className="text-[11px] text-cyan-400/80 uppercase font-tech tracking-wider">YOUR LIVE RANK</div>
          <div className="text-3xl font-extrabold text-cyan-300 font-mono tabular-nums mt-1.5 flex items-baseline gap-1.5">
            #{currentUserRank > 0 ? currentUserRank : '1'}
            <span className="text-xs text-slate-400 font-normal font-tech">of {users.length} enrolled</span>
          </div>
        </div>

        <div className="p-4 bg-[#090e1f] border border-amber-900/40 rounded-xl relative overflow-hidden shadow-lg">
          <div className="text-[11px] text-amber-400 uppercase font-tech tracking-wider">LEADER SCORE</div>
          <div className="text-3xl font-extrabold text-amber-300 font-mono tabular-nums mt-1.5">
            {topScore} <span className="text-sm font-tech font-semibold text-amber-400/80">PTS</span>
          </div>
        </div>

        <div className="p-4 bg-[#090e1f] border border-cyan-900/60 rounded-xl relative overflow-hidden shadow-lg">
          <div className="text-[11px] text-slate-400 uppercase font-tech tracking-wider">ATTENDING OPERATORS</div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums mt-1.5 flex items-baseline gap-1.5">
            {users.length}
            <span className="text-xs text-emerald-400 font-tech font-semibold">Active in Event</span>
          </div>
        </div>

        <div className="p-4 bg-[#090e1f] border border-emerald-950 rounded-xl relative overflow-hidden shadow-lg">
          <div className="text-[11px] text-emerald-400 uppercase font-tech tracking-wider">CTF EVENT STATUS</div>
          <div className="text-base sm:text-lg font-bold text-emerald-400 font-tech mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>LIVE & ATTENDING</span>
          </div>
        </div>
      </div>

      {/* Attendance Confirmation Banner & Action */}
      <div className="p-4 bg-[#060913] border border-cyan-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-tech font-bold text-white flex items-center gap-2">
              <span>CTF EVENT ATTENDANCE CONFIRMED</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono">
                ENROLLED
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Logged in operators are automatically added with their <strong className="text-white">Full Name</strong> and <strong className="text-cyan-300">Registration ID</strong>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.35)] shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Operator to Event</span>
        </button>
      </div>

      {/* Main Scoreboard Table */}
      <div className="bg-[#090e1f] border border-cyan-900/50 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-cyan-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold font-cyber text-white tracking-wider">
              OFFICIAL CTF EVENT LEADERBOARD
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-400/90 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/40">
            Real-time Roster: {users.length} Attending
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-[#060913] text-slate-300 border-b border-cyan-950 font-tech text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4 min-w-[200px]">Operator Name & ID</th>
                <th className="py-3.5 px-4 min-w-[150px]">Event Attendance</th>
                <th className="py-3.5 px-4 text-right min-w-[90px]">Total Score</th>
                <th className="py-3.5 px-4 min-w-[160px]">Solved Flags & Rate</th>
                <th className="py-3.5 px-4 text-right min-w-[120px]">Check-in / Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/60 font-mono">
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center text-slate-400 font-sans">
                    <p className="text-base text-slate-300 font-tech font-bold">No operators registered yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Log in at the security gate to attend the CTF event and claim your spot!</p>
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user, idx) => {
                  const rank = idx + 1;
                  const isCurrent = user.id === currentUserId || 
                                    user.registerNumber === currentUserClearance?.registerNumber ||
                                    user.isCurrentUser;
                  const displayName = user.fullName || user.username || 'Operator';
                  const regId = user.registerNumber || user.id;

                  return (
                    <tr
                      key={user.id || regId}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-cyan-950/45 border-l-4 border-l-cyan-400'
                          : 'hover:bg-slate-900/40'
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center">
                          {getRankBadge(rank)}
                        </div>
                      </td>

                      {/* Operator Name & Registration ID Column */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs font-tech shrink-0 ${
                            isCurrent
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                              : 'bg-slate-800 text-slate-200 border border-slate-700'
                          }`}>
                            {user.avatar || 'OP'}
                          </div>
                          <div>
                            {/* Full Name in high visibility text */}
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold font-tech tracking-wide ${
                                isCurrent ? 'text-cyan-300' : 'text-white'
                              }`}>
                                {displayName}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-900 text-cyan-200 border border-cyan-500 font-bold">
                                  YOU
                                </span>
                              )}
                            </div>
                            {/* Registration ID in clear cyber monospace */}
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                                ID: {regId}
                              </span>
                              {user.affiliation && (
                                <span className="text-[10px] text-slate-400 hidden sm:inline">
                                  · {user.affiliation}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Event Attendance Column */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 text-xs font-tech font-bold tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                            <span>{user.eventStatus || 'ATTENDING LIVE'}</span>
                          </div>
                          {user.attendedAt && (
                            <span className="text-[10px] text-slate-400 block font-mono">
                              Attended: {user.attendedAt}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Points Column */}
                      <td className="py-4 px-4 text-right">
                        <span className="text-base font-extrabold text-cyan-300 font-mono tabular-nums">
                          {user.points}
                        </span>
                        <span className="text-[10px] text-cyan-400/80 block font-tech uppercase">PTS</span>
                      </td>

                      {/* Solved Flags & Rate Column */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-400 tabular-nums font-mono text-xs">
                              {user.solvedIds.length} / {challenges.length}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold font-mono">
                              {Math.round((user.solvedIds.length / challenges.length) * 100)}%
                            </span>
                          </div>
                          <div className="w-28 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-cyan-950">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all"
                              style={{ width: `${Math.max(4, (user.solvedIds.length / challenges.length) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Last Activity Column */}
                      <td className="py-4 px-4 text-right text-slate-400 text-xs font-mono">
                        {user.lastSolveAt || 'Active Session'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register New Operator to Event */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1021] border border-cyan-500/40 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-950">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold font-cyber text-white">
                  ENROLL OPERATOR TO CTF EVENT
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4 font-sans">
              <div>
                <label className="block text-xs font-tech font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Operator Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Elena Rostova or Cadet Balaji"
                  className="w-full px-3.5 py-2.5 bg-[#060913] border border-cyan-900 rounded-lg text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-tech font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Registration Number / Cadet ID
                </label>
                <input
                  type="text"
                  value={newRegId}
                  onChange={(e) => setNewRegId(e.target.value.toUpperCase())}
                  placeholder="e.g. REG-CYBER-9912 or CADET-042"
                  className="w-full px-3.5 py-2.5 bg-[#060913] border border-cyan-900 rounded-lg text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {formError && (
                <p className="text-xs text-rose-400 font-mono bg-rose-950/40 border border-rose-900/60 p-2 rounded">
                  {formError}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-tech font-bold text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-tech font-bold uppercase tracking-wider text-slate-950 bg-cyan-500 hover:bg-cyan-400 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Enroll Operator</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
