import React, { useState, useEffect } from 'react';
import { Newspaper, Sparkles, TrendingUp, TrendingDown, RefreshCw, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const NewsTicker: React.FC = () => {
  const { newsEvents, triggerManualNewsEvent } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto rotate news item every 5.5 seconds
  useEffect(() => {
    if (newsEvents.length <= 1) return;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % newsEvents.length);
        setIsAnimating(false);
      }, 300);
    }, 5500);

    return () => clearInterval(interval);
  }, [newsEvents.length]);

  const currentEvent = newsEvents[currentIndex] || newsEvents[0];
  if (!currentEvent) return null;

  const isBull = currentEvent.type === 'bull';
  const isBear = currentEvent.type === 'bear';

  return (
    <div className="bg-neutral-950 border-b border-neutral-800/80 text-xs px-4 sm:px-6 py-2 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* News Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold uppercase tracking-wider text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>WIRE</span>
          </div>

          <span className="hidden sm:inline-block text-[11px] font-semibold text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
            {currentEvent.category}
          </span>
        </div>

        {/* Scrolling / Animated Headline Container */}
        <div className="flex-1 overflow-hidden min-w-0 flex items-center gap-2">
          <div
            className={`flex items-center gap-2 transition-all duration-300 transform ${
              isAnimating ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            {isBull ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : isBear ? (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}

            <span className="font-medium text-neutral-200 truncate text-xs sm:text-[13px]">
              {currentEvent.headline}
            </span>

            {currentEvent.impactDescription && (
              <span className="hidden md:inline-block font-mono text-[11px] text-neutral-400 bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-800 shrink-0">
                {currentEvent.impactDescription}
              </span>
            )}
          </div>
        </div>

        {/* Right Action: Manual Shock/News Fetch */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden lg:inline text-[11px] text-neutral-500 font-mono">
            {currentIndex + 1}/{newsEvents.length}
          </span>
          <button
            onClick={triggerManualNewsEvent}
            title="Generate Random Market Event"
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 hover:text-amber-400 transition-colors"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Dispatch Shock</span>
          </button>
        </div>
      </div>
    </div>
  );
};
