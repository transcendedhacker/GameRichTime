import React, { useState } from 'react';
import {
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  Radio,
  Newspaper
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { StockQuote } from '../../types/game';
import { formatCurrency, formatPercent, formatExactCurrency } from '../../utils/formatters';

export const StockMarketTab: React.FC = () => {
  const {
    cash,
    stocks,
    buyStock,
    sellStock,
    headlines,
    newsEvents,
    hourlyDividendsIncome
  } = useGame();

  const [selectedStock, setSelectedStock] = useState<StockQuote>(stocks[0]);
  const [tradeMode, setTradeMode] = useState<'BUY' | 'SELL'>('BUY');
  const [shareQuantity, setShareQuantity] = useState<number>(10);
  const [filter, setFilter] = useState<'ALL' | 'EQUITIES' | 'CRYPTO'>('ALL');

  // Keep selectedStock in sync with live ticks
  const currentSelected = stocks.find(s => s.symbol === selectedStock.symbol) || selectedStock;

  const filteredStocks = stocks.filter(s => {
    if (filter === 'ALL') return true;
    if (filter === 'EQUITIES') return s.category !== 'Crypto';
    if (filter === 'CRYPTO') return s.category === 'Crypto';
    return true;
  });

  // Calculate total portfolio value
  const totalPortfolioValue = stocks.reduce((acc, s) => acc + (s.ownedShares * s.price), 0);
  const totalCostBasis = stocks.reduce((acc, s) => acc + (s.ownedShares * s.avgBuyPrice), 0);
  const totalUnrealizedPL = totalPortfolioValue - totalCostBasis;
  const totalUnrealizedPLPercent = totalCostBasis > 0 ? (totalUnrealizedPL / totalCostBasis) * 100 : 0;

  // Render SVG Sparkline
  const renderChart = (history: number[], isPositive: boolean) => {
    if (!history || history.length < 2) return null;
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const width = 280;
    const height = 80;

    const points = history.map((val, idx) => {
      const x = (idx / (history.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 14) - 7;
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = isPositive ? '#10B981' : '#F43F5E';
    const fillColor = isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
        <defs>
          <linearGradient id={`grad-${currentSelected.symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0,${height} L 0,${height - ((history[0] - min) / range) * (height - 14) - 7} ${points} L ${width},${height} Z`}
          fill={`url(#grad-${currentSelected.symbol})`}
        />
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const handleTrade = () => {
    if (shareQuantity <= 0) return;
    if (tradeMode === 'BUY') {
      buyStock(currentSelected.symbol, shareQuantity);
    } else {
      sellStock(currentSelected.symbol, shareQuantity);
    }
  };

  const setMaxQuantity = () => {
    if (tradeMode === 'BUY') {
      const maxShares = Math.floor(cash / currentSelected.price);
      setShareQuantity(Math.max(1, maxShares));
    } else {
      setShareQuantity(currentSelected.ownedShares);
    }
  };

  const tradeCost = currentSelected.price * shareQuantity;
  const canExecuteTrade = tradeMode === 'BUY'
    ? cash >= tradeCost && shareQuantity > 0
    : currentSelected.ownedShares >= shareQuantity && shareQuantity > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Portfolio Overview Banner */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Global Equities & Crypto Desk</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-neutral-100">
            Exchange Terminal
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Trade high-growth tech shares, blue-chip conglomerates, and high-beta cryptocurrency tokens.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-xs text-neutral-400 block mb-0.5">Portfolio Value</span>
            <span className="text-base font-bold font-mono text-neutral-100 tabular-nums">
              {formatCurrency(totalPortfolioValue)}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-xs text-neutral-400 block mb-0.5">Unrealized P&L</span>
            <span className={`text-base font-bold font-mono tabular-nums ${totalUnrealizedPL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalUnrealizedPL >= 0 ? '+' : ''}{formatCurrency(totalUnrealizedPL)} ({formatPercent(totalUnrealizedPLPercent)})
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 col-span-2 sm:col-span-1">
            <span className="text-xs text-neutral-400 block mb-0.5">Hourly Dividends</span>
            <span className="text-base font-bold font-mono text-emerald-300 tabular-nums">
              +{formatCurrency(hourlyDividendsIncome)}/hr
            </span>
          </div>
        </div>
      </div>

      {/* Market News Ticker */}
      <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3 overflow-hidden text-xs">
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold uppercase tracking-wider shrink-0">
          <Newspaper className="w-3.5 h-3.5" />
          <span>Market Wire:</span>
        </div>
        <div className="text-neutral-300 truncate">
          {newsEvents[0]?.headline || headlines[0]?.text}
        </div>
      </div>

      {/* Main Terminal Grid: Quotes List (Left) + Detailed Trading Floor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quotes List */}
        <div className="lg:col-span-5 space-y-3">
          {/* Segmented Filter */}
          <div className="flex gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
            <button
              onClick={() => setFilter('ALL')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'ALL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => setFilter('EQUITIES')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'EQUITIES' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Equities
            </button>
            <button
              onClick={() => setFilter('CRYPTO')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'CRYPTO' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Crypto
            </button>
          </div>

          <div className="space-y-2">
            {filteredStocks.map(stock => {
              const isSelected = stock.symbol === currentSelected.symbol;
              const change = stock.price - stock.previousPrice;
              const changePercent = (change / (stock.previousPrice || 1)) * 100;
              const isUp = change >= 0;

              return (
                <div
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-neutral-850 border-amber-500/50 shadow-lg'
                      : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center font-mono font-bold text-xs text-neutral-300">
                      {stock.symbol}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-neutral-100">{stock.name}</span>
                        {stock.ownedShares > 0 && (
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            {stock.ownedShares} sh
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-neutral-500">{stock.category}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-neutral-100 tabular-nums">
                      {stock.price < 1 ? `$${stock.price.toFixed(4)}` : `$${stock.price.toFixed(2)}`}
                    </div>
                    <div className={`flex items-center justify-end text-xs font-mono tabular-nums ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{formatPercent(changePercent)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Trading Station & Sparkline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
            {/* Header for Selected Stock */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-mono text-neutral-100">
                    {currentSelected.symbol}
                  </h3>
                  <span className="text-xs text-neutral-400">· {currentSelected.name}</span>
                  <span className="text-xs font-medium bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded text-neutral-400">
                    {currentSelected.category}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  {currentSelected.description}
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
                  {currentSelected.price < 1 ? `$${currentSelected.price.toFixed(4)}` : `$${currentSelected.price.toFixed(2)}`}
                </span>
                {currentSelected.dividendYieldPerHour > 0 && (
                  <span className="block text-xs font-mono text-emerald-400">
                    +{formatPercent(currentSelected.dividendYieldPerHour * 100)}/hr div
                  </span>
                )}
              </div>
            </div>

            {/* Sparkline Visual */}
            <div className="my-6 p-4 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <div className="flex justify-between items-center text-xs text-neutral-500 mb-2">
                <span>Recent Price History (Real-Time Ticks)</span>
                <span className="font-mono text-neutral-400">
                  Vol: {(currentSelected.volatility * 100).toFixed(1)}%
                </span>
              </div>
              {renderChart(currentSelected.history, currentSelected.price >= currentSelected.previousPrice)}
            </div>

            {/* Holdings In Selected Stock */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-neutral-950 border border-neutral-850 text-xs mb-6">
              <div>
                <span className="text-neutral-500 block">Shares Owned</span>
                <span className="font-mono font-bold text-sm text-neutral-200 tabular-nums">
                  {currentSelected.ownedShares.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Average Cost</span>
                <span className="font-mono font-bold text-sm text-neutral-200 tabular-nums">
                  {currentSelected.avgBuyPrice > 0 ? `$${currentSelected.avgBuyPrice.toFixed(2)}` : '—'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Position Equity</span>
                <span className="font-mono font-bold text-sm text-emerald-400 tabular-nums">
                  {formatCurrency(currentSelected.ownedShares * currentSelected.price)}
                </span>
              </div>
            </div>

            {/* Trade Action Console */}
            <div className="space-y-4">
              {/* Buy / Sell Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
                <button
                  onClick={() => setTradeMode('BUY')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                    tradeMode === 'BUY'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  BUY ORDER
                </button>
                <button
                  onClick={() => setTradeMode('SELL')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                    tradeMode === 'SELL'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  SELL ORDER
                </button>
              </div>

              {/* Quantity Preset Buttons */}
              <div className="flex gap-2">
                {[1, 10, 50, 100, 500].map(qty => (
                  <button
                    key={qty}
                    onClick={() => setShareQuantity(qty)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                      shareQuantity === qty
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
                <button
                  onClick={setMaxQuantity}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-neutral-800 border border-neutral-700 text-amber-400 hover:bg-neutral-700 transition-colors"
                >
                  MAX
                </button>
              </div>

              {/* Custom Quantity Input */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    min="1"
                    value={shareQuantity}
                    onChange={(e) => setShareQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm font-mono text-neutral-100 focus:outline-none focus:border-amber-500/60"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-neutral-500 font-medium">
                    Shares
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-neutral-500 block">Total Transaction Value</span>
                  <span className="font-mono font-bold text-sm text-neutral-100 tabular-nums">
                    {formatCurrency(tradeCost)}
                  </span>
                </div>
              </div>

              {/* Submit Execution Button */}
              <button
                onClick={handleTrade}
                disabled={!canExecuteTrade}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  !canExecuteTrade
                    ? 'bg-neutral-850 text-neutral-500 cursor-not-allowed border border-neutral-800'
                    : tradeMode === 'BUY'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-98'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg active:scale-98'
                }`}
              >
                <span>Execute {tradeMode} ({shareQuantity.toLocaleString()} {currentSelected.symbol})</span>
                <span className="font-mono">· {formatCurrency(tradeCost)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
