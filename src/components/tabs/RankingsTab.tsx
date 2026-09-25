import React, { useState } from 'react';
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Globe,
  Clock,
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { globalBillionaires, titleRanks } from '../../data/billionairesData';
import { formatCurrency, formatPercent, formatDuration } from '../../utils/formatters';

export const RankingsTab: React.FC = () => {
  const {
    netWorth,
    currentTitle,
    stats,
    businesses,
    properties,
    luxuryItems,
    prestigePoints,
    milestones
  } = useGame();

  const [activeSubTab, setActiveSubTab] = useState<'FORBES' | 'TITLES' | 'STATS'>('FORBES');

  // Compute player's dynamic global rank among simulated world billionaires
  const calculatePlayerRank = () => {
    let rank = 1;
    for (const b of globalBillionaires) {
      if (netWorth >= b.netWorth) {
        return b.rank;
      }
      rank = b.rank + 1;
    }
    // If below all listed, calculate realistic percentile rank
    if (netWorth >= 1000000000) return 2600;
    if (netWorth >= 100000000) return 28400;
    if (netWorth >= 10000000) return 180000;
    if (netWorth >= 1000000) return 1250000;
    if (netWorth >= 100000) return 8400000;
    return 42000000;
  };

  const playerRank = calculatePlayerRank();

  // Combine player with billionaires list and sort
  const combinedList = [
    ...globalBillionaires.map(b => ({ ...b, isPlayer: false })),
    {
      rank: playerRank,
      name: 'YOU (Chief Executive)',
      netWorth: netWorth,
      company: 'Your Global Conglomerate',
      country: 'Global Empire',
      industry: currentTitle.title,
      isPlayer: true
    }
  ].sort((a, b) => b.netWorth - a.netWorth);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Forbes World Wealth Registry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-neutral-100">
            Global Wealth Rankings
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Track your financial ascendancy against the world's most formidable industrial dynasties.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-950 border border-amber-500/30 shrink-0 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-neutral-400 block mb-0.5">Your World Rank</span>
            <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
              #{playerRank.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
        <button
          onClick={() => setActiveSubTab('FORBES')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeSubTab === 'FORBES'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Forbes Leaderboard
        </button>
        <button
          onClick={() => setActiveSubTab('TITLES')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeSubTab === 'TITLES'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Executive Titles
        </button>
        <button
          onClick={() => setActiveSubTab('STATS')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeSubTab === 'STATS'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Empire Dossier
        </button>
      </div>

      {/* Forbes Leaderboard View */}
      {activeSubTab === 'FORBES' && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider pb-3">
                  <th className="pb-3 font-semibold w-16">Rank</th>
                  <th className="pb-3 font-semibold">Magnate / Entity</th>
                  <th className="pb-3 font-semibold">Primary Enterprise</th>
                  <th className="pb-3 font-semibold">Jurisdiction</th>
                  <th className="pb-3 font-semibold text-right">Net Worth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {combinedList.map((entry, index) => {
                  const isPlayer = entry.isPlayer;
                  return (
                    <tr
                      key={index}
                      className={`transition-colors ${
                        isPlayer
                          ? 'bg-amber-500/10 font-bold border-l-2 border-amber-400'
                          : 'hover:bg-neutral-850/50'
                      }`}
                    >
                      <td className="py-3 font-mono tabular-nums text-neutral-300">
                        {isPlayer ? (
                          <div className="flex items-center gap-1 text-amber-400">
                            <Crown className="w-3.5 h-3.5" />
                            <span>#{playerRank.toLocaleString()}</span>
                          </div>
                        ) : (
                          `#${entry.rank}`
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`font-semibold ${isPlayer ? 'text-amber-300' : 'text-neutral-200'}`}>
                          {entry.name}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-400">
                        {entry.company}
                      </td>
                      <td className="py-3 text-neutral-400">
                        {entry.country}
                      </td>
                      <td className="py-3 text-right font-mono font-bold tabular-nums text-neutral-100">
                        {formatCurrency(entry.netWorth)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Executive Titles Roadmap */}
      {activeSubTab === 'TITLES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {titleRanks.map(rank => {
            const isUnlocked = netWorth >= rank.minNetWorth;
            const isCurrent = currentTitle.title === rank.title;

            return (
              <div
                key={rank.title}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-lg ring-1 ring-amber-400/20'
                    : isUnlocked
                    ? 'bg-neutral-900 border-neutral-800'
                    : 'bg-neutral-950/60 border-neutral-850 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${
                      isUnlocked ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-neutral-900 text-neutral-600'
                    }`}>
                      {isUnlocked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-neutral-100">
                        {rank.title}
                      </h4>
                      <span className="text-xs text-neutral-400">{rank.badge}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-400 bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800 shrink-0">
                    +{formatPercent((rank.bonusMultiplier - 1) * 100)} Boost
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-850 flex justify-between items-center text-xs">
                  <span className="text-neutral-500">Threshold:</span>
                  <span className="font-mono font-bold text-neutral-300">
                    {formatCurrency(rank.minNetWorth)} Net Worth
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empire Statistics Dossier */}
      {activeSubTab === 'STATS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              Operational Milestones
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-neutral-400">Total Playtime</span>
                <span className="font-mono text-neutral-200">{formatDuration(stats.timePlayedSeconds)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-neutral-400">Manual Deal Contracts Signed</span>
                <span className="font-mono text-neutral-200">{stats.totalClicks.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-neutral-400">Manual Hustle Proceeds</span>
                <span className="font-mono text-emerald-400">{formatCurrency(stats.manualCashEarned)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-neutral-400">Historical Peak Net Worth</span>
                <span className="font-mono text-amber-400">{formatCurrency(stats.highestNetWorth)}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
              <Medal className="w-4 h-4 text-amber-400" />
              Holdings Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-neutral-400">Operational Enterprises</span>
                <span className="font-mono text-neutral-200">{businesses.filter(b => b.owned).length} / {businesses.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-neutral-400">Real Estate Titles Held</span>
                <span className="font-mono text-neutral-200">{properties.filter(p => p.owned).length} / {properties.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-neutral-400">Luxury Fleets in Garage</span>
                <span className="font-mono text-neutral-200">{luxuryItems.filter(l => l.owned).length} / {luxuryItems.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-neutral-400">Prestige Multiplier Yield</span>
                <span className="font-mono text-amber-400">+{prestigePoints} PTS</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
