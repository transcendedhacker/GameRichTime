import React from 'react';
import { Volume2, VolumeX, Zap, RefreshCw, Bot } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenReset }) => {
  const {
    cash,
    netWorth,
    incomePerHour,
    multiplier,
    currentTitle,
    isMuted,
    toggleSound,
    gameSpeed,
    setGameSpeed,
    setIsAdvisorOpen,
    persona,
    dailyObjectives
  } = useGame();

  const pendingClaimsCount = dailyObjectives.filter(o => o.completed && !o.claimed).length;
  const hasDossierAlert = persona.unallocatedStatusPoints > 0 || pendingClaimsCount > 0;

  const navItems = [
    { id: 'dashboard', label: 'Suite' },
    { id: 'dossier', label: 'Dossier & Daily', alertCount: persona.unallocatedStatusPoints + pendingClaimsCount },
    { id: 'businesses', label: 'Enterprises' },
    { id: 'stocks', label: 'Exchange' },
    { id: 'realestate', label: 'Real Estate' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'bank', label: 'Banking' },
    { id: 'rankings', label: 'Forbes' }
  ];

  const toggleSpeed = () => {
    if (gameSpeed === 1) setGameSpeed(2);
    else if (gameSpeed === 2) setGameSpeed(5);
    else setGameSpeed(1);
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#dashboard"
            onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
            className="text-lg sm:text-xl font-bold tracking-tight text-amber-400 font-['Cinzel',serif] hover:text-amber-300 transition-colors"
          >
            Business Empire
          </a>
        </div>

        {/* Zone 2: 4-7 clean single-line nav links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const hasAlert = item.alertCount && item.alertCount > 0;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <span>{item.label}</span>
                {hasAlert && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-bold flex items-center justify-center font-mono">
                    {item.alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary controls */}
        <div className="flex items-center gap-2">
          {/* AI Advisor Launcher */}
          <button
            onClick={() => setIsAdvisorOpen(true)}
            title="Consult Archibald Sterling (AI Advisor)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Advisor AI</span>
          </button>

          {/* Speed Toggle */}
          <button
            onClick={toggleSpeed}
            title={`Game Speed: ${gameSpeed}x`}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              gameSpeed > 1
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums">{gameSpeed}x</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Reset Game Button */}
          <button
            onClick={onOpenReset}
            title="Reset Game State"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-rose-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Scroller */}
      <div className="lg:hidden px-4 py-2 border-t border-neutral-850 overflow-x-auto flex gap-1.5 no-scrollbar">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const hasAlert = item.alertCount && item.alertCount > 0;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span>{item.label}</span>
              {hasAlert && (
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-neutral-950 text-[9px] font-bold flex items-center justify-center font-mono">
                  {item.alertCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Executive Financial Metrics Bar */}
      <div className="bg-neutral-900/60 border-t border-neutral-800/60 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-xs">
          {/* Cash */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Cash:</span>
            <span className="font-mono tabular-nums text-sm font-bold text-emerald-400">
              {formatCurrency(cash)}
            </span>
          </div>

          {/* Net Worth */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Net Worth:</span>
            <span className="font-mono tabular-nums text-sm font-bold text-amber-300">
              {formatCurrency(netWorth)}
            </span>
          </div>

          {/* Hourly Passive Income */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Income:</span>
            <span className="font-mono tabular-nums text-sm font-bold text-emerald-300">
              +{formatCurrency(incomePerHour)}/hr
            </span>
          </div>

          {/* Executive Rank */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-neutral-400">Title:</span>
            <span className="text-neutral-200 font-medium">
              {currentTitle.title}
            </span>
            <span className="text-neutral-500">·</span>
            <span className="font-mono tabular-nums text-amber-400/90 font-semibold">
              {formatPercent((multiplier - 1) * 100)} yield
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
