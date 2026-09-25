import React, { useState } from 'react';
import {
  Gem,
  Car,
  Plane,
  Anchor,
  Gauge,
  Sparkles,
  ShieldAlert,
  Check
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { LuxuryItem } from '../../types/game';
import { formatCurrency } from '../../utils/formatters';

const categoryIcons: Record<string, React.ReactNode> = {
  Supercar: <Car className="w-5 h-5 text-amber-400" />,
  Aircraft: <Plane className="w-5 h-5 text-sky-400" />,
  Superyacht: <Anchor className="w-5 h-5 text-emerald-400" />,
  Estate: <Gem className="w-5 h-5 text-purple-400" />
};

export const LuxuryTab: React.FC = () => {
  const {
    cash,
    luxuryItems,
    buyLuxuryItem,
    sellLuxuryItem,
    prestigePoints,
    hourlyLuxuryExpenses
  } = useGame();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', 'Supercar', 'Aircraft', 'Superyacht'];

  const filteredItems = luxuryItems.filter(l => {
    if (categoryFilter === 'All') return true;
    return l.category === categoryFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Gem className="w-4 h-4 text-amber-400" />
            <span>High Society Prestige Collection</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-neutral-100">
            Luxury Fleets & Lifestyle
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Acquire bespoke hypercars, transcontinental private jets, and mega-yachts to amplify your executive prestige.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-xs text-neutral-400 block mb-0.5">Prestige Rating</span>
            <span className="text-lg font-bold font-mono text-amber-400 tabular-nums">
              {prestigePoints.toLocaleString()} PTS
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-xs text-neutral-400 block mb-0.5">Fleet Maintenance</span>
            <span className="text-lg font-bold font-mono text-rose-400 tabular-nums">
              -{formatCurrency(hourlyLuxuryExpenses)}/hr
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              categoryFilter === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Luxury Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const isOwned = item.owned;
          const canBuy = !isOwned && cash >= item.cost;
          const resellPrice = Math.round(item.cost * 0.75);

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between ${
                isOwned
                  ? 'bg-neutral-900/90 border-amber-500/40 shadow-lg'
                  : 'bg-neutral-950/60 border-neutral-850 opacity-90'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                      {categoryIcons[item.category] || <Gem className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 font-medium">{item.brand}</span>
                      <h3 className="text-base font-semibold text-neutral-100">{item.name}</h3>
                    </div>
                  </div>

                  {isOwned && (
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                      In Garage
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                  {item.description}
                </p>

                {/* Specs Pill */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-950/80 border border-neutral-850 text-xs text-neutral-300 font-mono mb-4">
                  <Gauge className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{item.topSpeedOrSpecs}</span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-neutral-950 border border-neutral-850 mb-4">
                  <div>
                    <span className="text-neutral-500 block">Prestige</span>
                    <span className="font-mono font-bold text-sm text-amber-400">
                      +{item.prestigePoints} PTS
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Upkeep</span>
                    <span className="font-mono font-bold text-sm text-rose-400">
                      -{formatCurrency(item.hourlyMaintenance)}/hr
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                {!isOwned ? (
                  <button
                    onClick={() => buyLuxuryItem(item.id)}
                    disabled={!canBuy}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                      canBuy
                        ? 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950'
                        : 'bg-neutral-850 text-neutral-500 cursor-not-allowed border border-neutral-800'
                    }`}
                  >
                    <span>Acquire Asset</span>
                    <span className="font-mono font-bold">({formatCurrency(item.cost)})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => sellLuxuryItem(item.id)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-neutral-950 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-colors"
                  >
                    Sell to Collector ({formatCurrency(resellPrice)})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
