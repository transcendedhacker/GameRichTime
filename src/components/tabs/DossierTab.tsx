import React, { useState } from 'react';
import {
  User,
  Sparkles,
  Award,
  Heart,
  Brain,
  Crown,
  Briefcase,
  Flame,
  CheckCircle2,
  Clock,
  ChevronRight,
  Shield,
  Edit2,
  Check,
  TrendingUp,
  MapPin,
  Calendar,
  Gift
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';

const AVATARS = [
  { id: 'avatar_1', name: 'Wall Street Titan', emoji: '👔', bg: 'from-amber-600 to-amber-900' },
  { id: 'avatar_2', name: 'Tech Visionary', emoji: '🧑‍💼', bg: 'from-cyan-600 to-blue-900' },
  { id: 'avatar_3', name: 'Hedge Fund Maven', emoji: '💼', bg: 'from-emerald-600 to-teal-900' },
  { id: 'avatar_4', name: 'High-Society Mogul', emoji: '👑', bg: 'from-purple-600 to-indigo-900' },
  { id: 'avatar_5', name: 'Sovereign Magnate', emoji: '🎖️', bg: 'from-rose-600 to-pink-900' },
];

export const DossierTab: React.FC = () => {
  const {
    cash,
    netWorth,
    currentTitle,
    prestigePoints,
    persona,
    updatePersona,
    allocateStatusPoint,
    performLifestyleActivity,
    lifestyleActivitiesList,
    dailyObjectives,
    claimDailyObjective,
    refreshDailyObjectives,
    timeUntilNextDailyRefresh
  } = useGame();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(persona.name);
  const [tempBio, setTempBio] = useState(persona.bioTitle);
  const [tempCity, setTempCity] = useState(persona.originCity);

  const handleSaveProfile = () => {
    updatePersona({
      name: tempName.trim() || 'Harrison Sterling',
      bioTitle: tempBio.trim() || 'Private Equity Principal',
      originCity: tempCity.trim() || 'Manhattan, New York'
    });
    setIsEditingProfile(false);
  };

  // Format remaining seconds into HH:MM:SS
  const formatCountdown = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const activeAvatar = AVATARS.find(a => a.id === persona.avatarId) || AVATARS[0];

  const completedObjectivesCount = dailyObjectives.filter(o => o.completed).length;
  const allObjectivesClaimed = dailyObjectives.every(o => o.claimed);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner: Executive ID Card / Passport */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-neutral-950 border border-neutral-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar & Dossier Credentials */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar Selector */}
            <div className="relative group shrink-0">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${activeAvatar.bg} p-1 shadow-lg border border-amber-500/40 flex items-center justify-center text-4xl select-none`}>
                <span>{activeAvatar.emoji}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-neutral-900 border border-amber-500/50 rounded-full px-2 py-0.5 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                Lv. {Math.floor((persona.charisma + persona.intellect + persona.elegance + persona.influence) / 4)}
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 uppercase tracking-wider">
                  Executive Dossier
                </span>
                <span className="text-xs text-neutral-500">·</span>
                <span className="text-xs text-neutral-400 font-medium">{currentTitle.title}</span>
              </div>

              {isEditingProfile ? (
                <div className="space-y-2 pt-1 max-w-md">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Executive Name"
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    placeholder="Corporate Title"
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-xs text-neutral-300 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={tempCity}
                    onChange={(e) => setTempCity(e.target.value)}
                    placeholder="Headquarters City"
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-xs text-neutral-300 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSaveProfile}
                      className="px-3 py-1 text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Dossier
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-neutral-100">
                      {persona.name}
                    </h1>
                    <button
                      onClick={() => {
                        setTempName(persona.name);
                        setTempBio(persona.bioTitle);
                        setTempCity(persona.originCity);
                        setIsEditingProfile(true);
                      }}
                      className="text-neutral-500 hover:text-amber-400 p-1 transition-colors"
                      title="Edit Executive Profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    {persona.bioTitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      {persona.originCity}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      Age: {persona.age}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-amber-400 font-mono font-semibold">
                      <Award className="w-3.5 h-3.5" />
                      Net Worth: {formatCurrency(netWorth)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Avatar Archetypes Picker */}
          <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3.5 sm:p-4 shrink-0 flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Executive Archetype
            </span>
            <div className="flex items-center gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => updatePersona({ avatarId: av.id })}
                  title={av.name}
                  className={`w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-all ${
                    persona.avatarId === av.id
                      ? 'bg-amber-500/20 border-2 border-amber-400 shadow-md scale-105'
                      : 'bg-neutral-900 border border-neutral-800 hover:border-neutral-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-neutral-400 text-center font-medium">
              {activeAvatar.name}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = RPG Status Attributes & Right = Daily Objectives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 Cols): RPG Attributes & Lifestyle */}
        <div className="lg:col-span-5 space-y-6">
          {/* Attributes Header & Point Allocator */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-neutral-100 font-['Cinzel',serif]">
                    Executive Attributes
                  </h2>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Permanent RPG status points powering real in-game financial multipliers.
                </p>
              </div>

              {/* Status Points Available Pill */}
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Available Points</span>
                <span className={`inline-flex items-center gap-1 font-mono text-base font-bold px-2.5 py-0.5 rounded-full border ${
                  persona.unallocatedStatusPoints > 0
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}>
                  {persona.unallocatedStatusPoints} PTS
                </span>
              </div>
            </div>

            {/* 5 RPG Attributes */}
            <div className="space-y-4">
              {/* Charisma */}
              <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-200">Charisma</span>
                        <span className="text-xs font-mono font-bold text-amber-400">{persona.charisma}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block">
                        +{(persona.charisma * 0.6).toFixed(1)}% Contract tap yields & manager efficiency
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={persona.unallocatedStatusPoints <= 0}
                    onClick={() => allocateStatusPoint('charisma')}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-neutral-950 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    + Boost
                  </button>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${Math.min(100, (persona.charisma / 120) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Intellect */}
              <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-200">Intellect</span>
                        <span className="text-xs font-mono font-bold text-blue-400">{persona.intellect}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block">
                        +{(persona.intellect * 0.5).toFixed(1)}% Equity dividend yields & risk mitigation
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={persona.unallocatedStatusPoints <= 0}
                    onClick={() => allocateStatusPoint('intellect')}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:bg-blue-500 hover:text-neutral-950 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    + Boost
                  </button>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${Math.min(100, (persona.intellect / 120) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Elegance & High Society */}
              <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-200">Elegance & Style</span>
                        <span className="text-xs font-mono font-bold text-purple-400">{persona.elegance}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block">
                        +{(persona.elegance * 0.8).toFixed(1)}% Luxury asset prestige score & high-society clout
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={persona.unallocatedStatusPoints <= 0}
                    onClick={() => allocateStatusPoint('elegance')}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500 hover:text-neutral-950 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    + Boost
                  </button>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full"
                    style={{ width: `${Math.min(100, (persona.elegance / 120) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Health & Vitality */}
              <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-200">Health & Vitality</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">{persona.health}/100</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block">
                        Multiplies enterprise output (Current factor: {(0.85 + (persona.health / 100) * 0.35).toFixed(2)}x)
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={persona.unallocatedStatusPoints <= 0 || persona.health >= 100}
                    onClick={() => allocateStatusPoint('health')}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-neutral-950 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    + Boost
                  </button>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${Math.min(100, persona.health)}%` }}
                  />
                </div>
              </div>

              {/* Influence & Clout */}
              <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-200">Political Influence</span>
                        <span className="text-xs font-mono font-bold text-amber-400">{persona.influence}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block">
                        {(persona.influence * 0.3).toFixed(1)}% Discount on enterprise expansion & real estate renovations
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={persona.unallocatedStatusPoints <= 0}
                    onClick={() => allocateStatusPoint('influence')}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-neutral-950 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    + Boost
                  </button>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${Math.min(100, (persona.influence / 120) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Executive Longevity & Elite Lifestyle Suites */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-100 font-['Cinzel',serif]">
                  Elite Lifestyle & Longevity
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Deploy surplus wealth to elevate personal biodata and health.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {lifestyleActivitiesList.map(activity => {
                const canAfford = cash >= activity.cost;
                return (
                  <div
                    key={activity.id}
                    className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-200">
                          {activity.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 uppercase">
                          {activity.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-emerald-400 font-mono font-semibold">
                          +{activity.attributeBoost.amount} {activity.attributeBoost.stat.toUpperCase()}
                        </span>
                        <span className="text-neutral-600">·</span>
                        <span className="text-neutral-400 font-mono">
                          Fee: {formatCurrency(activity.cost)}
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={!canAfford}
                      onClick={() => performLifestyleActivity(activity.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-neutral-950 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                    >
                      Enroll ({formatCompactNumber(activity.cost)})
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Daily Financial Objectives (24h Challenges) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-6">
            {/* Header: Countdown & Daily Mastery */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Gift className="w-4 h-4" />
                  <span>24-Hour Capital & Status Challenges</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 font-['Cinzel',serif]">
                  Daily Objectives
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Complete challenges to earn permanent Status Points and executive capital bonuses.
                </p>
              </div>

              {/* Timer & Refresh */}
              <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-xl p-3 shrink-0">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cycle Refresh</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-amber-300 tabular-nums">
                    {formatCountdown(timeUntilNextDailyRefresh)}
                  </div>
                </div>

                <button
                  onClick={() => refreshDailyObjectives(true)}
                  title="Generate new 24-hour objectives"
                  className="px-2.5 py-1 text-xs rounded bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                >
                  Reroll
                </button>
              </div>
            </div>

            {/* Daily Mastery Overview Pill */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Daily Completion Status
                </span>
                <div className="text-sm font-bold text-neutral-200 mt-0.5">
                  {completedObjectivesCount} of {dailyObjectives.length} Completed · {persona.totalObjectivesCompleted} All-Time
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {dailyObjectives.map((obj, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                      obj.claimed
                        ? 'bg-emerald-500 text-neutral-950'
                        : obj.completed
                        ? 'bg-amber-400 text-neutral-950 animate-bounce'
                        : 'bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {obj.claimed ? '✓' : i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* List of 3-5 Daily Objectives */}
            <div className="space-y-4">
              {dailyObjectives.map((objective) => {
                const progressPct = Math.min(100, (objective.currentCount / objective.targetCount) * 100);

                return (
                  <div
                    key={objective.id}
                    className={`p-5 rounded-xl border transition-all ${
                      objective.claimed
                        ? 'bg-neutral-950/40 border-neutral-800/50 opacity-60'
                        : objective.completed
                        ? 'bg-amber-500/5 border-amber-500/40 shadow-lg shadow-amber-500/5'
                        : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Objective Details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                            objective.category === 'deals' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                            objective.category === 'trading' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                            objective.category === 'enterprise' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                            objective.category === 'realestate' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                            'bg-neutral-800 text-neutral-300 border-neutral-700'
                          }`}>
                            {objective.category}
                          </span>
                          <h4 className="text-base font-bold text-neutral-100">
                            {objective.title}
                          </h4>
                        </div>

                        <p className="text-xs text-neutral-400">
                          {objective.description}
                        </p>

                        {/* Progress Bar & Numerical Target */}
                        <div className="space-y-1 pt-1 max-w-md">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-neutral-400">
                              Progress: {objective.currentCount} / {objective.targetCount}
                            </span>
                            <span className={objective.completed ? 'text-emerald-400 font-bold' : 'text-neutral-400'}>
                              {progressPct.toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 rounded-full ${
                                objective.completed
                                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                  : 'bg-gradient-to-r from-amber-500 to-amber-400'
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Rewards & Claim Action */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                        {/* Reward Badges */}
                        <div className="flex flex-col sm:items-end gap-1">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Rewards
                          </span>
                          <div className="flex flex-wrap sm:justify-end gap-1.5">
                            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                              +{objective.rewardStatusPoints} PTS
                            </span>
                            {objective.rewardAttribute && (
                              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                                +{objective.attributeBonusAmount} {objective.rewardAttribute.slice(0, 4).toUpperCase()}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded text-xs font-mono text-neutral-300 bg-neutral-800">
                              +{formatCompactNumber(objective.rewardCash)}
                            </span>
                          </div>
                        </div>

                        {/* Claim Button */}
                        {objective.claimed ? (
                          <div className="flex items-center gap-1 text-xs text-neutral-500 font-semibold px-3 py-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Claimed</span>
                          </div>
                        ) : (
                          <button
                            disabled={!objective.completed}
                            onClick={() => claimDailyObjective(objective.id)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                              objective.completed
                                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95'
                                : 'bg-neutral-800 text-neutral-500 border border-neutral-700/60 cursor-not-allowed'
                            }`}
                          >
                            <Gift className="w-3.5 h-3.5" />
                            <span>{objective.completed ? 'Claim Rewards' : 'In Progress'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Strategic Value Note for the Player */}
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-1.5">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Executive Advisory: Why Status Points Matter
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed">
                In capital building simulations, raw cash bonuses rapidly succumb to inflationary scale. Status Points grant permanent RPG character progression: <strong>Charisma</strong> magnifies deal contract yields, <strong>Intellect</strong> boosts stock dividend dividends, <strong>Elegance</strong> elevates luxury asset prestige, and <strong>Health</strong> ensures maximum enterprise efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
