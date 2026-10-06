import React from 'react';
import { 
  Trophy, Medal, Award, CheckCircle2, TrendingUp, Shield, 
  Users, Zap, Clock, Terminal
} from 'lucide-react';
import { LeaderboardUser, CtfChallenge } from '../../types/ctf';

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserId: string;
  challenges: CtfChallenge[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  users,
  currentUserId,
  challenges
}) => {
  // Sort users by points descending
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const currentUserRank = sortedUsers.findIndex(u => u.id === currentUserId) + 1;
  const topScore = sortedUsers[0]?.points ?? 0;

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/60 text-amber-400 flex items-center justify-center font-bold text-xs shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            🥇
          </span>
        );
      case 2:
        return (
          <span className="w-7 h-7 rounded-lg bg-slate-400/20 border border-slate-400/60 text-slate-300 flex items-center justify-center font-bold text-xs">
            🥈
          </span>
        );
      case 3:
        return (
          <span className="w-7 h-7 rounded-lg bg-amber-700/20 border border-amber-700/60 text-amber-600 flex items-center justify-center font-bold text-xs">
            🥉
          </span>
        );
      default:
        return (
          <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Telemetry Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-4 bg-[#090e1f] border border-cyan-950 rounded-xl">
          <span className="text-[11px] text-slate-500 block uppercase">YOUR LIVE RANK</span>
          <div className="text-2xl font-bold text-cyan-400 tabular-nums mt-1">
            #{currentUserRank > 0 ? currentUserRank : '-'}
            <span className="text-xs text-slate-500 ml-1.5 font-normal">of {users.length}</span>
          </div>
        </div>
        <div className="p-4 bg-[#090e1f] border border-cyan-950 rounded-xl">
          <span className="text-[11px] text-slate-500 block uppercase">LEADER SCORE</span>
          <div className="text-2xl font-bold text-amber-400 tabular-nums mt-1">
            {topScore} PTS
          </div>
        </div>
        <div className="p-4 bg-[#090e1f] border border-cyan-950 rounded-xl">
          <span className="text-[11px] text-slate-500 block uppercase">TOTAL OPERATORS</span>
          <div className="text-2xl font-bold text-white tabular-nums mt-1">
            {users.length} Active
          </div>
        </div>
        <div className="p-4 bg-[#090e1f] border border-cyan-950 rounded-xl">
          <span className="text-[11px] text-slate-500 block uppercase">SYSTEM STATUS</span>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE TELEMETRY
          </div>
        </div>
      </div>

      {/* Main Scoreboard Table */}
      <div className="bg-[#090e1f] border border-cyan-900/40 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-cyan-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold font-mono text-white">
              Official CTF Scoreboard & Standings
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Real-time score reconciliation active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#060913] text-slate-400 border-b border-cyan-950">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Operator / Team Handle</th>
                <th className="py-3 px-4">Affiliation / Battlegroup</th>
                <th className="py-3 px-4 text-right">Points</th>
                <th className="py-3 px-4">Solved Flags</th>
                <th className="py-3 px-4 text-right">Last Capture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/60">
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-slate-500 font-mono">
                    No operators registered yet. Complete security verification to join the leaderboard!
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user, idx) => {
                const rank = idx + 1;
                const isCurrent = user.id === currentUserId;

                return (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-cyan-950/40 border-l-4 border-l-cyan-400'
                        : 'hover:bg-slate-900/30'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center">
                        {getRankBadge(rank)}
                      </div>
                    </td>

                    {/* Handle */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isCurrent
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {user.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className={isCurrent ? 'text-cyan-300' : 'text-white'}>
                              {user.fullName || user.username}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                                YOU
                              </span>
                            )}
                          </div>
                          {user.registerNumber && (
                            <span className="text-[10px] text-slate-400 block font-mono">
                              ID: {user.registerNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Affiliation */}
                    <td className="py-3 px-4 text-slate-400">
                      {user.affiliation}
                    </td>

                    {/* Points */}
                    <td className="py-3 px-4 text-right font-bold text-cyan-300 text-sm tabular-nums">
                      {user.points}
                    </td>

                    {/* Solved Count & Bar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-emerald-400 tabular-nums">
                          {user.solvedIds.length} / {challenges.length}
                        </span>
                        <div className="w-24 bg-slate-900 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="bg-emerald-400 h-full rounded-full"
                            style={{ width: `${(user.solvedIds.length / challenges.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Last Solve */}
                    <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                      {user.lastSolveAt}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
