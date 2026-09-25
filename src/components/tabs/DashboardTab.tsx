import React, { useState } from 'react';
import {
  TrendingUp,
  Briefcase,
  Building,
  Landmark,
  ShieldCheck,
  ChevronRight,
  HandCoins,
  Gem,
  LineChart,
  Crown,
  Sparkles,
  Gift,
  Flame,
  Brain,
  Heart,
  Shield,
  Clock,
  UserCheck
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, formatPercent, formatCompactNumber } from '../../utils/formatters';

interface DashboardTabProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ setActiveTab }) => {
  const {
    cash,
    netWorth,
    incomePerHour,
    hourlyBusinessIncome,
    hourlyRealEstateIncome,
    hourlyDividendsIncome,
    hourlyBankIncome,
    hourlyLuxuryExpenses,
    prestigePoints,
    currentTitle,
    nextTitle,
    multiplier,
    manualTapDeal,
    tapEarningsAmount,
    businesses,
    properties,
    luxuryItems,
    bank,
    persona,
    dailyObjectives,
    timeUntilNextDailyRefresh
  } = useGame();

  const [lastTapEarned, setLastTapEarned] = useState<number | null>(null);
  const [tapEffectActive, setTapEffectActive] = useState(false);

  const handleTap = (e: React.MouseEvent) => {
    const earned = manualTapDeal(e);
    setLastTapEarned(earned);
    setTapEffectActive(true);
    setTimeout(() => setTapEffectActive(false), 300);
  };

  // Progress towards next executive title
  const titleProgress = nextTitle
    ? Math.min(100, Math.max(0, ((netWorth - currentTitle.minNetWorth) / (nextTitle.minNetWorth - currentTitle.minNetWorth)) * 100))
    : 100;

  const ownedBusinessesCount = businesses.filter(b => b.owned).length;
  const ownedPropsCount = properties.filter(p => p.owned).length;
  const ownedLuxCount = luxuryItems.filter(l => l.owned).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <Crown className="w-4 h-4" />
              <span>Executive Penthouse Office</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-400">{currentTitle.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold font-['Cinzel',serif] text-neutral-100 tracking-tight">
              {currentTitle.title}
            </h1>

            <p className="text-sm text-neutral-400 mt-2 max-w-xl">
              Commanding assets worldwide. Reinvest cash flows into high-yield commercial enterprises, real estate, and capital markets.
            </p>

            {/* Next Title Progress Bar */}
            {nextTitle && (
              <div className="mt-5 max-w-md">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-neutral-400">Target: {nextTitle.title}</span>
                  <span className="font-mono text-neutral-300 tabular-nums">
                    {formatCurrency(netWorth)} / {formatCurrency(nextTitle.minNetWorth)} ({titleProgress.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 rounded-full"
                    style={{ width: `${titleProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80 min-w-[200px]">
              <span className="text-xs text-neutral-400">Empire Multiplier</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  {multiplier.toFixed(2)}x
                </span>
                <span className="text-xs text-neutral-500">
                  (+{formatPercent((multiplier - 1) * 100)})
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80 min-w-[200px]">
              <span className="text-xs text-neutral-400">Lifestyle Prestige</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  {prestigePoints.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-500">PTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Persona RPG & Daily Objectives Quick Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Executive RPG Dossier Card */}
        <div
          onClick={() => setActiveTab('dossier')}
          className="md:col-span-6 group p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-900 flex items-center justify-center text-2xl border border-amber-500/30">
                👔
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-neutral-100 group-hover:text-amber-400 transition-colors font-['Cinzel',serif]">
                    {persona.name}
                  </h3>
                  <span className="text-[11px] text-neutral-400">· Age {persona.age}</span>
                </div>
                <p className="text-xs text-neutral-400">
                  {persona.bioTitle}
                </p>
              </div>
            </div>

            {persona.unallocatedStatusPoints > 0 ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                +{persona.unallocatedStatusPoints} PTS Available
              </span>
            ) : (
              <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-amber-400 transition-colors" />
            )}
          </div>

          {/* 5 RPG Attributes Mini Badges */}
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-neutral-800/80 text-center">
            <div className="p-1.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">CHR</span>
              <span className="text-xs font-mono font-bold text-amber-400">{persona.charisma}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">INT</span>
              <span className="text-xs font-mono font-bold text-blue-400">{persona.intellect}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">ELG</span>
              <span className="text-xs font-mono font-bold text-purple-400">{persona.elegance}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">HP</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{persona.health}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">INF</span>
              <span className="text-xs font-mono font-bold text-amber-400">{persona.influence}</span>
            </div>
          </div>
        </div>

        {/* Daily Objectives Quick Card */}
        <div
          onClick={() => setActiveTab('dossier')}
          className="md:col-span-6 group p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-100 group-hover:text-amber-400 transition-colors font-['Cinzel',serif]">
                  Daily Objectives
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span>{dailyObjectives.filter(o => o.completed).length} of {dailyObjectives.length} Completed</span>
                  <span>·</span>
                  <span className="font-mono text-amber-300">
                    Cycle: {Math.floor(timeUntilNextDailyRefresh / 3600)}h {Math.floor((timeUntilNextDailyRefresh % 3600) / 60)}m
                  </span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-amber-400 transition-colors" />
          </div>

          {/* Quick Objective Highlights */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-800/80 text-xs">
            {dailyObjectives.slice(0, 2).map((obj) => (
              <div key={obj.id} className="flex items-center justify-between text-neutral-300">
                <span className="truncate max-w-[220px] text-neutral-400">
                  {obj.completed ? '✓ ' : '○ '}{obj.title}
                </span>
                <span className="font-mono font-semibold text-xs text-amber-400 shrink-0">
                  +{obj.rewardStatusPoints} PTS
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Action Zone: Executive Dealmaking Tap Card + Income Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dealmaker Tap Card */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <HandCoins className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-neutral-100">Dealmaker Desk</h3>
                    <p className="text-xs text-neutral-400">Active executive deal negotiation</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  +{formatCurrency(tapEarningsAmount)} / tap
                </span>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                Directly negotiate commercial contracts, angel syndications, and consulting retainers. Manual yield scales dynamically with your net worth and holdings.
              </p>
            </div>

            {/* Interactive Tap Button */}
            <div className="my-auto py-6 flex flex-col items-center justify-center">
              <button
                onClick={handleTap}
                className={`group relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-950 border-2 border-amber-500/40 p-3 shadow-2xl transition-all duration-150 active:scale-95 cursor-pointer flex flex-col items-center justify-center select-none ${
                  tapEffectActive ? 'ring-4 ring-amber-400/50 scale-98 border-amber-400' : 'hover:border-amber-400/80 hover:shadow-amber-500/10'
                }`}
              >
                <div className="w-full h-full rounded-full bg-neutral-950/70 border border-neutral-700/60 flex flex-col items-center justify-center p-4">
                  <HandCoins className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400 group-hover:scale-110 transition-transform mb-2" />
                  <span className="text-sm font-bold tracking-wide text-neutral-200">
                    SIGN CONTRACT
                  </span>
                  <span className="font-mono text-xs text-emerald-400 mt-1">
                    +{formatCurrency(tapEarningsAmount)}
                  </span>
                </div>

                {/* Floating Click Floater Indicator */}
                {lastTapEarned && tapEffectActive && (
                  <div className="absolute top-2 animate-out fade-out slide-out-to-top duration-300 font-mono font-bold text-emerald-300 text-lg pointer-events-none">
                    +{formatCurrency(lastTapEarned)}
                  </div>
                )}
              </button>
            </div>

            <div className="text-center text-xs text-neutral-500">
              Tip: Acquire enterprises & real estate to automate hourly compounding passive income.
            </div>
          </div>
        </div>

        {/* Income Streams & Portfolio Summary */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-neutral-100 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Hourly Cash Flow Structure
              </span>
              <span className="font-mono text-sm text-emerald-400 font-bold tabular-nums">
                +{formatCurrency(incomePerHour)} / hr
              </span>
            </h3>

            <div className="space-y-3">
              {/* Enterprises */}
              <div
                onClick={() => setActiveTab('businesses')}
                className="group flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-200 group-hover:text-amber-400 transition-colors">
                      Commercial Enterprises
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {ownedBusinessesCount} of {businesses.length} companies operational
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-sm text-neutral-200 tabular-nums">
                    +{formatCurrency(hourlyBusinessIncome)}/hr
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300" />
                </div>
              </div>

              {/* Real Estate */}
              <div
                onClick={() => setActiveTab('realestate')}
                className="group flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-200 group-hover:text-amber-400 transition-colors">
                      Real Estate Rentals
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {ownedPropsCount} properties generating tenant lease yields
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-sm text-neutral-200 tabular-nums">
                    +{formatCurrency(hourlyRealEstateIncome)}/hr
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300" />
                </div>
              </div>

              {/* Stock Dividends */}
              <div
                onClick={() => setActiveTab('stocks')}
                className="group flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-200 group-hover:text-amber-400 transition-colors">
                      Equities & Staking Dividends
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Corporate quarterly yields distributed hourly
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-sm text-neutral-200 tabular-nums">
                    +{formatCurrency(hourlyDividendsIncome)}/hr
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300" />
                </div>
              </div>

              {/* Private Commercial Bank */}
              <div
                onClick={() => setActiveTab('bank')}
                className="group flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-200 group-hover:text-amber-400 transition-colors">
                      Commercial Private Bank
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {bank.unlocked ? 'Net loan margin spreads' : 'Charter license available'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-sm text-neutral-200 tabular-nums">
                    {bank.unlocked ? `+${formatCurrency(hourlyBankIncome)}/hr` : 'Locked'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300" />
                </div>
              </div>

              {/* Luxury Upkeep Expense */}
              {hourlyLuxuryExpenses > 0 && (
                <div
                  onClick={() => setActiveTab('luxury')}
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <Gem className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-200 group-hover:text-rose-400 transition-colors">
                        Fleet & Lifestyle Upkeep
                      </h4>
                      <p className="text-xs text-neutral-500">
                        {ownedLuxCount} supercars, jets & yachts maintained
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold text-sm text-rose-400 tabular-nums">
                      -{formatCurrency(hourlyLuxuryExpenses)}/hr
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Asset Allocation Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs text-neutral-400 block mb-1">Liquid Cash</span>
              <span className="font-mono font-bold text-sm text-neutral-100">
                {formatCurrency(cash)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs text-neutral-400 block mb-1">Enterprises</span>
              <span className="font-mono font-bold text-sm text-neutral-100">
                {ownedBusinessesCount} Owned
              </span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs text-neutral-400 block mb-1">Properties</span>
              <span className="font-mono font-bold text-sm text-neutral-100">
                {ownedPropsCount} Titles
              </span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs text-neutral-400 block mb-1">Luxury Assets</span>
              <span className="font-mono font-bold text-sm text-neutral-100">
                {ownedLuxCount} Garages
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
