import React, { useState } from 'react';
import {
  Building,
  Home,
  Star,
  MapPin,
  TrendingUp,
  DollarSign,
  Hammer,
  Key,
  Check
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { RealEstateItem } from '../../types/game';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export const RealEstateTab: React.FC = () => {
  const {
    cash,
    properties,
    buyProperty,
    renovateProperty,
    sellProperty,
    hourlyRealEstateIncome,
    multiplier
  } = useGame();

  const [tierFilter, setTierFilter] = useState<string>('All');

  const tiers = ['All', 'Residential', 'Luxury', 'Commercial', 'Exclusive'];

  const filteredProps = properties.filter(p => {
    if (tierFilter === 'All') return true;
    return p.tier === tierFilter;
  });

  const getEffectiveRent = (p: RealEstateItem) => {
    const starBoost = 1 + p.renovationStars * 0.3;
    return p.baseRentPerHour * starBoost * multiplier;
  };

  const getRenovationCost = (p: RealEstateItem) => {
    return Math.round(p.renovationCost * Math.pow(1.3, p.renovationStars));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Global Property Portfolio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-neutral-100">
            Prime Real Estate
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Acquire high-yield architectural landmarks, perform luxury renovations, and collect steady lease dividends.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 shrink-0">
          <span className="text-xs text-neutral-400 block mb-0.5">Total Property Lease Yield</span>
          <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            +{formatCurrency(hourlyRealEstateIncome)}/hr
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {tiers.map(tier => (
          <button
            key={tier}
            onClick={() => setTierFilter(tier)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              tierFilter === tier
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {tier}
          </button>
        ))}
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProps.map(prop => {
          const isOwned = prop.owned;
          const currentRent = getEffectiveRent(prop);
          const renoCost = getRenovationCost(prop);
          const canReno = isOwned && prop.renovationStars < 5 && cash >= renoCost;
          const canBuy = !isOwned && cash >= prop.purchasePrice;
          const saleValue = Math.round(prop.currentMarketValue * (1 + prop.renovationStars * 0.25));

          return (
            <div
              key={prop.id}
              className={`rounded-2xl border transition-all ${
                isOwned
                  ? 'bg-neutral-900/90 border-neutral-800'
                  : 'bg-neutral-950/60 border-neutral-850 opacity-90'
              }`}
            >
              <div className="p-5">
                {/* Title & Tier */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-neutral-100">
                        {prop.name}
                      </h3>
                      {isOwned && (
                        <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Deed Acquired
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{prop.location}</span>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800 shrink-0">
                    {prop.tier}
                  </span>
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2 my-3">
                  {prop.description}
                </p>

                {/* Features List */}
                <div className="flex flex-wrap gap-1.5 my-3">
                  {prop.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-neutral-400 bg-neutral-950/80 border border-neutral-850 px-2 py-0.5 rounded"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                {/* Stars Rating / Renovation Status */}
                {isOwned && (
                  <div className="p-2.5 rounded-xl bg-neutral-950/90 border border-neutral-850 flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400">Renovations:</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(starIndex => (
                          <Star
                            key={starIndex}
                            className={`w-3.5 h-3.5 ${
                              starIndex <= prop.renovationStars
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-neutral-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-neutral-400 font-mono">
                      {prop.renovationStars === 5 ? 'Masterpiece Grade' : `${prop.renovationStars}/5 Upgrades`}
                    </span>
                  </div>
                )}

                {/* Rent & Valuation Metrics */}
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 grid grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-neutral-500 block">Hourly Lease Income</span>
                    <span className="font-mono font-bold text-sm text-emerald-400 tabular-nums">
                      +{formatCurrency(currentRent)}/hr
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Current Asset Value</span>
                    <span className="font-mono font-bold text-sm text-neutral-200 tabular-nums">
                      {formatCurrency(isOwned ? saleValue : prop.purchasePrice)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isOwned ? (
                  <button
                    onClick={() => buyProperty(prop.id)}
                    disabled={!canBuy}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                      canBuy
                        ? 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950'
                        : 'bg-neutral-850 text-neutral-500 cursor-not-allowed border border-neutral-800'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Purchase Title Deed</span>
                    <span className="font-mono font-bold">({formatCurrency(prop.purchasePrice)})</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    {/* Renovate Button */}
                    <button
                      onClick={() => renovateProperty(prop.id)}
                      disabled={!canReno}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        canReno
                          ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700'
                          : 'bg-neutral-900/60 text-neutral-500 cursor-not-allowed border border-neutral-850'
                      }`}
                    >
                      <Hammer className="w-3.5 h-3.5" />
                      <span>{prop.renovationStars >= 5 ? 'Fully Upgraded' : `Renovate (${formatCurrency(renoCost)})`}</span>
                    </button>

                    {/* Sell / Flip Property */}
                    <button
                      onClick={() => sellProperty(prop.id)}
                      className="py-2 px-3 rounded-lg text-xs font-semibold bg-neutral-950 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-colors"
                      title="Sell property at current appreciated market value"
                    >
                      Flip ({formatCurrency(saleValue)})
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
