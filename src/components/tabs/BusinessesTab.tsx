import React, { useState, useEffect } from 'react';
import {
  Coffee,
  Droplets,
  Car,
  HardHat,
  Ship,
  Cpu,
  UtensilsCrossed,
  Flame,
  Landmark,
  Rocket,
  UserCheck,
  Zap,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronUp,
  Briefcase
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BusinessItem } from '../../types/game';
import { formatCurrency, formatPercent } from '../../utils/formatters';

const iconMap: Record<string, React.ReactNode> = {
  Coffee: <Coffee className="w-5 h-5 text-amber-400" />,
  Droplets: <Droplets className="w-5 h-5 text-blue-400" />,
  Car: <Car className="w-5 h-5 text-yellow-400" />,
  HardHat: <HardHat className="w-5 h-5 text-orange-400" />,
  Ship: <Ship className="w-5 h-5 text-cyan-400" />,
  Cpu: <Cpu className="w-5 h-5 text-indigo-400" />,
  UtensilsCrossed: <UtensilsCrossed className="w-5 h-5 text-rose-400" />,
  Flame: <Flame className="w-5 h-5 text-red-500" />,
  Landmark: <Landmark className="w-5 h-5 text-emerald-400" />,
  Rocket: <Rocket className="w-5 h-5 text-violet-400" />
};

export const BusinessesTab: React.FC = () => {
  const {
    cash,
    businesses,
    buyBusiness,
    upgradeBusinessLevel,
    buyBusinessUpgrade,
    hireBusinessManager,
    triggerSpecialAction,
    hourlyBusinessIncome,
    multiplier
  } = useGame();

  const [filter, setFilter] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  // Update cooldown timer every second
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = ['All', 'Retail', 'Services', 'Industrial', 'Tech', 'Finance', 'Mega-Corp'];

  const filteredBusinesses = businesses.filter(b => {
    if (filter === 'All') return true;
    return b.category === filter;
  });

  const getBusinessHourlyYield = (b: BusinessItem) => {
    if (!b.owned || b.level === 0) return b.baseIncomePerHour;
    let val = b.baseIncomePerHour * Math.pow(1.15, b.level - 1);
    b.upgrades.forEach(u => {
      if (u.purchased) val *= u.multiplier;
    });
    if (b.managerHired) {
      val *= (1 + b.managerBonusPercent / 100);
    }
    return val * multiplier;
  };

  const getNextLevelCost = (b: BusinessItem) => {
    return Math.round(b.baseCost * 0.45 * Math.pow(1.22, b.level));
  };

  const getSpecialActionCooldownRemaining = (b: BusinessItem) => {
    if (!b.lastSpecialActionTime) return 0;
    const cooldownMs = (b.specialActionCooldown || 60) * 1000;
    const elapsed = now - b.lastSpecialActionTime;
    return Math.max(0, Math.ceil((cooldownMs - elapsed) / 1000));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>Industrial & Corporate Holdings</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-neutral-100">
            Enterprise Management
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Expand production capacity, hire corporate officers, and sign high-stakes commercial tenders.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 shrink-0">
          <span className="text-xs text-neutral-400 block mb-0.5">Total Corporate Yield</span>
          <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            +{formatCurrency(hourlyBusinessIncome)}/hr
          </span>
        </div>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filter === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-neutral-200 hover:bg-neutral-850'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBusinesses.map(bus => {
          const isOwned = bus.owned;
          const currentYield = getBusinessHourlyYield(bus);
          const nextUpgradeCost = getNextLevelCost(bus);
          const canUpgrade = isOwned && bus.level < bus.maxLevel && cash >= nextUpgradeCost;
          const canHireManager = isOwned && !bus.managerHired && cash >= bus.managerCost;
          const canBuy = !isOwned && cash >= bus.baseCost;
          const isExpanded = expandedId === bus.id;
          const cooldownRemaining = getSpecialActionCooldownRemaining(bus);
          const specialReward = Math.round((bus.specialActionReward || 0) * multiplier);

          return (
            <div
              key={bus.id}
              className={`rounded-2xl border transition-all ${
                isOwned
                  ? 'bg-neutral-900/90 border-neutral-800'
                  : 'bg-neutral-950/60 border-neutral-850 opacity-90'
              }`}
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 shrink-0">
                      {iconMap[bus.icon] || <Briefcase className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-neutral-100">
                          {bus.name}
                        </h3>
                        {isOwned ? (
                          <span className="text-xs font-mono font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            Lvl {bus.level}
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-500">Unacquired</span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                        {bus.tagline}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-neutral-400 bg-neutral-950 px-2 py-1 rounded border border-neutral-800 shrink-0">
                    {bus.category}
                  </span>
                </div>

                {/* Earnings & Stats Strip */}
                <div className="mt-4 p-3 rounded-xl bg-neutral-950/80 border border-neutral-850 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-neutral-500 block">Hourly Revenue</span>
                    <span className="font-mono font-bold text-sm text-emerald-400 tabular-nums">
                      {isOwned ? `+${formatCurrency(currentYield)}/hr` : `~+${formatCurrency(bus.baseIncomePerHour)}/hr`}
                    </span>
                  </div>

                  {isOwned && (
                    <div className="text-right">
                      <span className="text-neutral-500 block">Operations Status</span>
                      <span className="font-medium text-neutral-300">
                        {bus.managerHired ? 'Automated (CEO Active)' : 'Manual Supervision'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Controls */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {!isOwned ? (
                    <button
                      onClick={() => buyBusiness(bus.id)}
                      disabled={!canBuy}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                        canBuy
                          ? 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950'
                          : 'bg-neutral-850 text-neutral-500 cursor-not-allowed border border-neutral-800'
                      }`}
                    >
                      <span>Acquire Enterprise</span>
                      <span className="font-mono font-bold">({formatCurrency(bus.baseCost)})</span>
                    </button>
                  ) : (
                    <>
                      {/* Level Upgrade Button */}
                      <button
                        onClick={() => upgradeBusinessLevel(bus.id)}
                        disabled={!canUpgrade}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          canUpgrade
                            ? 'bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-750 text-neutral-100 border border-neutral-700'
                            : 'bg-neutral-900/60 text-neutral-500 cursor-not-allowed border border-neutral-850'
                        }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Upgrade Lvl {bus.level + 1}</span>
                        <span className="font-mono text-neutral-400">({formatCurrency(nextUpgradeCost)})</span>
                      </button>

                      {/* Special Action Button */}
                      {bus.specialActionTitle && (
                        <button
                          onClick={() => triggerSpecialAction(bus.id)}
                          disabled={cooldownRemaining > 0}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                            cooldownRemaining === 0
                              ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                              : 'bg-neutral-950 text-neutral-500 border border-neutral-850 cursor-not-allowed'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>{bus.specialActionTitle}</span>
                          {cooldownRemaining > 0 ? (
                            <span className="font-mono tabular-nums text-neutral-400">({cooldownRemaining}s)</span>
                          ) : (
                            <span className="font-mono text-emerald-400 font-bold">(+{formatCurrency(specialReward)})</span>
                          )}
                        </button>
                      )}

                      {/* Expand Details Toggle */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : bus.id)}
                        className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
                        title={isExpanded ? 'Collapse' : 'Manage Officers & Technology'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Collapsible Management Panel */}
              {isOwned && isExpanded && (
                <div className="border-t border-neutral-800/80 p-5 bg-neutral-950/60 space-y-4 animate-in fade-in duration-150">
                  {/* Executive Officer Hiring */}
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-semibold text-neutral-200">Corporate Manager</span>
                      </div>
                      <span className="text-xs text-amber-400 font-mono font-medium">
                        +{bus.managerBonusPercent}% Production Multiplier
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 mb-3">
                      {bus.managerName}
                    </p>

                    {bus.managerHired ? (
                      <div className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Executive officer active and managing operations
                      </div>
                    ) : (
                      <button
                        onClick={() => hireBusinessManager(bus.id)}
                        disabled={!canHireManager}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                          canHireManager
                            ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                            : 'bg-neutral-850 text-neutral-500 cursor-not-allowed border border-neutral-800'
                        }`}
                      >
                        <span>Retain Executive Officer</span>
                        <span className="font-mono">({formatCurrency(bus.managerCost)})</span>
                      </button>
                    )}
                  </div>

                  {/* Corporate Upgrades */}
                  <div>
                    <span className="text-xs font-semibold text-neutral-300 block mb-2">
                      Technological & Operational Upgrades
                    </span>

                    <div className="space-y-2">
                      {bus.upgrades.map(upg => {
                        const canBuyUpg = !upg.purchased && cash >= upg.cost;
                        return (
                          <div
                            key={upg.id}
                            className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-neutral-200">{upg.name}</span>
                                <span className="text-amber-400 font-mono font-bold">
                                  {upg.multiplier}x Yield
                                </span>
                              </div>
                              <p className="text-neutral-500 text-xs mt-0.5">
                                {upg.description}
                              </p>
                            </div>

                            {upg.purchased ? (
                              <span className="text-xs font-semibold text-emerald-400 shrink-0">
                                Installed
                              </span>
                            ) : (
                              <button
                                onClick={() => buyBusinessUpgrade(bus.id, upg.id)}
                                disabled={!canBuyUpg}
                                className={`py-1.5 px-3 rounded-lg font-semibold shrink-0 transition-colors ${
                                  canBuyUpg
                                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                                }`}
                              >
                                {formatCurrency(upg.cost)}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
