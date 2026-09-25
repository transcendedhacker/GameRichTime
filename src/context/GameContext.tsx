import React, { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  BusinessItem,
  StockQuote,
  RealEstateItem,
  LuxuryItem,
  BankAccountState,
  Milestone,
  GameStats,
  MarketEvent,
  ChatMessage,
  DailyObjective,
  ExecutivePersona,
  ObjectiveCategory,
  LifestyleActivity
} from '../types/game';
import { initialBusinesses } from '../data/businessesData';
import { initialStocks, sampleHeadlines, MarketHeadline } from '../data/stocksData';
import { initialRealEstate } from '../data/realEstateData';
import { initialLuxuryItems } from '../data/luxuryData';
import { initialMilestones } from '../data/milestonesData';
import { titleRanks, TitleRank, globalBillionaires } from '../data/billionairesData';
import { soundService } from '../services/audioService';
import { generateDynamicMarketEvent } from '../services/marketEventsService';
import { generateDailyObjectives } from '../services/objectivesService';
import { lifestyleActivities } from '../data/lifestyleData';

interface GameContextType {
  // Cash & Net Worth
  cash: number;
  netWorth: number;
  incomePerHour: number;
  hourlyBusinessIncome: number;
  hourlyRealEstateIncome: number;
  hourlyDividendsIncome: number;
  hourlyBankIncome: number;
  hourlyLuxuryExpenses: number;
  prestigePoints: number;
  currentTitle: TitleRank;
  nextTitle: TitleRank | null;
  multiplier: number;
  
  // Game Speed
  gameSpeed: number;
  setGameSpeed: (speed: number) => void;

  // Sound
  isMuted: boolean;
  toggleSound: () => void;

  // Manual Click / Executive Deal
  manualTapDeal: (e?: React.MouseEvent) => number;
  tapEarningsAmount: number;

  // Businesses
  businesses: BusinessItem[];
  buyBusiness: (id: string) => boolean;
  upgradeBusinessLevel: (id: string) => boolean;
  buyBusinessUpgrade: (businessId: string, upgradeId: string) => boolean;
  hireBusinessManager: (businessId: string) => boolean;
  triggerSpecialAction: (businessId: string) => boolean;

  // Stocks & Crypto
  stocks: StockQuote[];
  headlines: MarketHeadline[];
  buyStock: (symbol: string, shares: number) => boolean;
  sellStock: (symbol: string, shares: number) => boolean;

  // Real Estate
  properties: RealEstateItem[];
  buyProperty: (id: string) => boolean;
  renovateProperty: (id: string) => boolean;
  sellProperty: (id: string) => boolean;

  // Luxury Assets
  luxuryItems: LuxuryItem[];
  buyLuxuryItem: (id: string) => boolean;
  sellLuxuryItem: (id: string) => boolean;

  // Commercial Bank
  bank: BankAccountState;
  unlockBank: () => boolean;
  setDepositRate: (rate: number) => void;
  setLoanRate: (rate: number) => void;
  upgradeBankSecurity: () => boolean;
  injectBankReserve: (amount: number) => boolean;
  withdrawBankReserve: (amount: number) => boolean;

  // Milestones & Stats
  milestones: Milestone[];
  claimMilestone: (id: string) => void;
  stats: GameStats;

  // News Ticker & Market Events
  newsEvents: MarketEvent[];
  latestEvent: MarketEvent | null;
  triggerManualNewsEvent: () => void;

  // Executive Persona & RPG Attributes
  persona: ExecutivePersona;
  updatePersona: (updates: Partial<ExecutivePersona>) => void;
  allocateStatusPoint: (attribute: 'charisma' | 'intellect' | 'elegance' | 'health' | 'influence') => boolean;
  performLifestyleActivity: (activityId: string) => boolean;
  lifestyleActivitiesList: LifestyleActivity[];

  // Daily Objectives
  dailyObjectives: DailyObjective[];
  claimDailyObjective: (objectiveId: string) => boolean;
  refreshDailyObjectives: (force?: boolean) => void;
  timeUntilNextDailyRefresh: number;

  // AI Advisor
  chatMessages: ChatMessage[];
  isAdvisorLoading: boolean;
  sendAdvisorMessage: (text: string) => Promise<void>;
  isAdvisorOpen: boolean;
  setIsAdvisorOpen: (open: boolean) => void;

  // Offline Modal State
  offlineModalData: { elapsedSeconds: number; earnings: number } | null;
  closeOfflineModal: () => void;

  // Active Celebrated Milestone
  celebratingMilestone: Milestone | null;
  closeCelebrationModal: () => void;

  // Reset Game
  resetGame: () => void;
}

const STORAGE_KEY = 'richman_empire_save_v1';

const initialPersona: ExecutivePersona = {
  name: 'Harrison Sterling',
  bioTitle: 'Venture Capitalist & Private Equity Principal',
  avatarId: 'avatar_1',
  age: 28,
  originCity: 'Manhattan, New York',
  charisma: 30,
  intellect: 35,
  elegance: 25,
  health: 92,
  influence: 20,
  unallocatedStatusPoints: 3,
  totalObjectivesCompleted: 0,
  lastObjectivesRefreshTimestamp: Date.now()
};

const initialBankState: BankAccountState = {
  unlocked: false,
  vaultCash: 0,
  depositRatePercent: 2.5, // 2.5% paid to clients
  loanRatePercent: 8.5,    // 8.5% charged to clients
  totalCustomerDeposits: 50000000,
  totalLoansIssued: 42000000,
  defaultRiskPercent: 1.2,
  securityTier: 1,
  licenseCost: 40000000
};

const initialStats: GameStats = {
  totalClicks: 0,
  manualCashEarned: 0,
  businessesOwnedCount: 0,
  propertiesOwnedCount: 0,
  luxuryAssetsCount: 0,
  stockTradesCount: 0,
  highestNetWorth: 500,
  timePlayedSeconds: 0
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [cash, setCash] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.cash === 'number') return parsed.cash;
      }
    } catch {
      // Fallback
    }
    return 1000; // Starter cash for exciting first minute!
  });

  const [businesses, setBusinesses] = useState<BusinessItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.businesses) {
          // Merge with initial to preserve structure
          return initialBusinesses.map(initB => {
            const match = parsed.businesses.find((b: BusinessItem) => b.id === initB.id);
            if (!match) return initB;
            return {
              ...initB,
              level: match.level ?? 0,
              owned: match.owned ?? false,
              managerHired: match.managerHired ?? false,
              upgrades: initB.upgrades.map(u => {
                const matchedU = match.upgrades?.find((mu: { id: string; purchased: boolean }) => mu.id === u.id);
                return matchedU ? { ...u, purchased: matchedU.purchased } : u;
              })
            };
          });
        }
      }
    } catch {
      // Fallback
    }
    return initialBusinesses;
  });

  const [stocks, setStocks] = useState<StockQuote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stocks) {
          return initialStocks.map(initS => {
            const match = parsed.stocks.find((s: StockQuote) => s.symbol === initS.symbol);
            if (!match) return initS;
            return {
              ...initS,
              price: match.price ?? initS.price,
              history: match.history ?? initS.history,
              ownedShares: match.ownedShares ?? 0,
              avgBuyPrice: match.avgBuyPrice ?? 0
            };
          });
        }
      }
    } catch {
      // Fallback
    }
    return initialStocks;
  });

  const [properties, setProperties] = useState<RealEstateItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.properties) {
          return initialRealEstate.map(initP => {
            const match = parsed.properties.find((p: RealEstateItem) => p.id === initP.id);
            if (!match) return initP;
            return {
              ...initP,
              owned: match.owned ?? false,
              renovationStars: match.renovationStars ?? 0,
              currentMarketValue: match.currentMarketValue ?? initP.purchasePrice
            };
          });
        }
      }
    } catch {
      // Fallback
    }
    return initialRealEstate;
  });

  const [luxuryItems, setLuxuryItems] = useState<LuxuryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.luxuryItems) {
          return initialLuxuryItems.map(initL => {
            const match = parsed.luxuryItems.find((l: LuxuryItem) => l.id === initL.id);
            if (!match) return initL;
            return {
              ...initL,
              owned: match.owned ?? false
            };
          });
        }
      }
    } catch {
      // Fallback
    }
    return initialLuxuryItems;
  });

  const [bank, setBank] = useState<BankAccountState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.bank) {
          return { ...initialBankState, ...parsed.bank };
        }
      }
    } catch {
      // Fallback
    }
    return initialBankState;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.milestones) {
          return initialMilestones.map(m => {
            const match = parsed.milestones.find((pm: Milestone) => pm.id === m.id);
            return match ? { ...m, achieved: match.achieved } : m;
          });
        }
      }
    } catch {
      // Fallback
    }
    return initialMilestones;
  });

  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stats) return { ...initialStats, ...parsed.stats };
      }
    } catch {
      // Fallback
    }
    return initialStats;
  });

  const [headlines, setHeadlines] = useState<MarketHeadline[]>(sampleHeadlines);
  const [newsEvents, setNewsEvents] = useState<MarketEvent[]>([
    {
      id: 'init_evt_1',
      timestamp: Date.now() - 10000,
      timeAgo: '10s ago',
      headline: 'GLOBAL EXCHANGE: Equities open higher as institutional trading desks deploy Q3 capital reserves.',
      category: 'Economy',
      type: 'bull',
      impactDescription: 'Broad market liquidity expansion in progress.'
    },
    {
      id: 'init_evt_2',
      timestamp: Date.now() - 35000,
      timeAgo: '35s ago',
      headline: 'Apex Technologies (APX) announces next-gen tensor compute node architecture.',
      category: 'Stock',
      type: 'bull',
      affectedTargetName: 'APX',
      impactDescription: 'APX shares test weekly highs.'
    }
  ]);
  const [latestEvent, setLatestEvent] = useState<MarketEvent | null>(null);
  const [businessBoosts, setBusinessBoosts] = useState<Record<string, { factor: number; expiry: number }>>({});

  // Executive Persona & RPG Attributes State
  const [persona, setPersona] = useState<ExecutivePersona>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.persona) {
          return { ...initialPersona, ...parsed.persona };
        }
      }
    } catch {
      // Fallback
    }
    return initialPersona;
  });

  // Daily Financial Objectives State
  const [dailyObjectives, setDailyObjectives] = useState<DailyObjective[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.dailyObjectives) && parsed.dailyObjectives.length > 0) {
          const lastRefresh = parsed.persona?.lastObjectivesRefreshTimestamp || 0;
          if (Date.now() - lastRefresh < 86400000) {
            return parsed.dailyObjectives;
          }
        }
      }
    } catch {
      // Fallback
    }
    return generateDailyObjectives(100, 1000);
  });

  // AI Advisor Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      text: 'Good day, Chief Executive. I am Archibald Sterling, your Senior Strategic Advisor. I continuously evaluate your balance sheet, corporate acquisitions, equity positions, and incoming market news wires. How may I direct our empire today?',
      timestamp: Date.now()
    }
  ]);
  const [isAdvisorLoading, setIsAdvisorLoading] = useState<boolean>(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState<boolean>(false);

  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundService.getMuted());
  const [offlineModalData, setOfflineModalData] = useState<{ elapsedSeconds: number; earnings: number } | null>(null);
  const [celebratingMilestone, setCelebratingMilestone] = useState<Milestone | null>(null);

  // Calculate prestige points (boosted by Elegance attribute)
  const prestigePoints = useMemo(() => {
    let pts = 0;
    const eleganceMultiplier = 1 + (persona.elegance * 0.008);
    luxuryItems.forEach(l => {
      if (l.owned) pts += Math.round(l.prestigePoints * eleganceMultiplier);
    });
    milestones.forEach(m => {
      if (m.achieved) pts += m.rewardPrestige;
    });
    return pts;
  }, [luxuryItems, milestones, persona.elegance]);

  // Executive multiplier from prestige
  const prestigeMultiplier = useMemo(() => {
    // Every 100 prestige adds 1% bonus
    return 1 + prestigePoints / 10000;
  }, [prestigePoints]);

  // Hourly income breakdown with dynamic business event boosts & Health vitality
  const hourlyBusinessIncome = useMemo(() => {
    const now = Date.now();
    let sum = 0;
    businesses.forEach(b => {
      if (b.owned && b.level > 0) {
        let busVal = b.baseIncomePerHour * Math.pow(1.15, b.level - 1);
        // Upgrades multiplier
        b.upgrades.forEach(u => {
          if (u.purchased) busVal *= u.multiplier;
        });
        // Manager bonus (boosted by Charisma)
        if (b.managerHired) {
          const charismaBoost = 1 + (persona.charisma * 0.003);
          busVal *= (1 + (b.managerBonusPercent * charismaBoost) / 100);
        }
        // Active event boost factor
        const activeBoost = businessBoosts[b.id];
        if (activeBoost && activeBoost.expiry > now) {
          busVal *= activeBoost.factor;
        }
        sum += busVal;
      }
    });
    // Health stamina factor (peaks at 100 health = +15% boost, below 50 causes slight fatigue)
    const healthFactor = Math.max(0.85, Math.min(1.20, 0.85 + (persona.health / 100) * 0.35));
    return sum * prestigeMultiplier * healthFactor;
  }, [businesses, prestigeMultiplier, businessBoosts, persona.charisma, persona.health]);

  const hourlyRealEstateIncome = useMemo(() => {
    let sum = 0;
    properties.forEach(p => {
      if (p.owned) {
        // Each star adds 30% rent
        const starBoost = 1 + p.renovationStars * 0.3;
        sum += p.baseRentPerHour * starBoost;
      }
    });
    return sum;
  }, [properties]);

  const hourlyDividendsIncome = useMemo(() => {
    let sum = 0;
    const intellectBonus = 1 + (persona.intellect * 0.005);
    stocks.forEach(s => {
      if (s.ownedShares > 0 && s.dividendYieldPerHour > 0) {
        sum += s.ownedShares * s.price * s.dividendYieldPerHour * intellectBonus;
      }
    });
    return sum;
  }, [stocks, persona.intellect]);

  const hourlyBankIncome = useMemo(() => {
    if (!bank.unlocked) return 0;
    // Bank profit = Loan revenue - Deposit interest expense
    const loanInterestAnnual = bank.totalLoansIssued * (bank.loanRatePercent / 100);
    const depositInterestAnnual = bank.totalCustomerDeposits * (bank.depositRatePercent / 100);
    const annualNet = loanInterestAnnual - depositInterestAnnual;
    // Convert to hourly (8760 hours in a year)
    const hourly = annualNet / 8760;
    return Math.max(0, hourly);
  }, [bank]);

  const hourlyLuxuryExpenses = useMemo(() => {
    let sum = 0;
    luxuryItems.forEach(l => {
      if (l.owned) sum += l.hourlyMaintenance;
    });
    return sum;
  }, [luxuryItems]);

  const incomePerHour = useMemo(() => {
    const gross = hourlyBusinessIncome + hourlyRealEstateIncome + hourlyDividendsIncome + hourlyBankIncome;
    return Math.max(0, gross - hourlyLuxuryExpenses);
  }, [hourlyBusinessIncome, hourlyRealEstateIncome, hourlyDividendsIncome, hourlyBankIncome, hourlyLuxuryExpenses]);

  // Total Portfolio & Asset Valuation for Net Worth
  const netWorth = useMemo(() => {
    let total = cash;

    // Businesses equity value
    businesses.forEach(b => {
      if (b.owned) {
        total += b.baseCost * (1 + (b.level - 1) * 0.5);
        b.upgrades.forEach(u => {
          if (u.purchased) total += u.cost;
        });
      }
    });

    // Stock & Crypto portfolio value
    stocks.forEach(s => {
      if (s.ownedShares > 0) {
        total += s.ownedShares * s.price;
      }
    });

    // Real Estate value
    properties.forEach(p => {
      if (p.owned) {
        total += p.currentMarketValue * (1 + p.renovationStars * 0.25);
      }
    });

    // Luxury items
    luxuryItems.forEach(l => {
      if (l.owned) {
        total += l.cost * 0.85; // slight asset depreciation
      }
    });

    // Bank vault cash
    if (bank.unlocked) {
      total += bank.vaultCash;
    }

    return Math.max(cash, total);
  }, [cash, businesses, stocks, properties, luxuryItems, bank]);

  // Determine current executive title
  const currentTitle = useMemo(() => {
    let current = titleRanks[0];
    for (let i = titleRanks.length - 1; i >= 0; i--) {
      if (netWorth >= titleRanks[i].minNetWorth) {
        current = titleRanks[i];
        break;
      }
    }
    return current;
  }, [netWorth]);

  const nextTitle = useMemo(() => {
    const currentIndex = titleRanks.findIndex(t => t.title === currentTitle.title);
    if (currentIndex >= 0 && currentIndex < titleRanks.length - 1) {
      return titleRanks[currentIndex + 1];
    }
    return null;
  }, [currentTitle]);

  const multiplier = useMemo(() => {
    return currentTitle.bonusMultiplier * prestigeMultiplier;
  }, [currentTitle, prestigeMultiplier]);

  // Influence discount (up to 20% discount on business upgrades and property renovations)
  const influenceDiscountFactor = useMemo(() => {
    return Math.max(0.80, 1 - (persona.influence * 0.003));
  }, [persona.influence]);

  // Tap earnings based on wealth & businesses owned & Charisma boost
  const tapEarningsAmount = useMemo(() => {
    let ownedCount = businesses.filter(b => b.owned).length;
    let base = 15;
    if (netWorth > 1000000000) base = 5000000;
    else if (netWorth > 100000000) base = 250000;
    else if (netWorth > 10000000) base = 25000;
    else if (netWorth > 1000000) base = 2500;
    else if (netWorth > 100000) base = 350;
    else if (netWorth > 10000) base = 50;

    const charismaMultiplier = 1 + (persona.charisma * 0.006);
    return Math.round((base + ownedCount * 25) * multiplier * charismaMultiplier);
  }, [netWorth, businesses, multiplier, persona.charisma]);

  // Daily Objective Progress incrementer helper
  const incrementObjectiveProgress = useCallback((category: ObjectiveCategory, amount: number = 1) => {
    setDailyObjectives(prev => prev.map(obj => {
      if (obj.category !== category || obj.completed) return obj;
      const nextCount = obj.currentCount + amount;
      const isCompleted = nextCount >= obj.targetCount;
      if (isCompleted && !obj.completed) {
        soundService.playUpgrade();
      }
      return {
        ...obj,
        currentCount: nextCount,
        completed: isCompleted
      };
    }));
  }, []);

  // Sound toggle
  const toggleSound = useCallback(() => {
    const nextMuted = soundService.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  // Manual tap click
  const manualTapDeal = useCallback((e?: React.MouseEvent) => {
    const earned = tapEarningsAmount;
    setCash(prev => prev + earned);
    setStats(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      manualCashEarned: prev.manualCashEarned + earned
    }));
    incrementObjectiveProgress('deals', 1);
    soundService.playCashTap();

    // Trigger subtle sparkle at click coordinate if event exists
    if (e && typeof confetti === 'function' && Math.random() < 0.25) {
      confetti({
        particleCount: 12,
        spread: 40,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight
        },
        colors: ['#F59E0B', '#10B981', '#FBBF24'],
        disableForReducedMotion: true
      });
    }

    return earned;
  }, [tapEarningsAmount, incrementObjectiveProgress]);

  // Check achievements & milestones
  useEffect(() => {
    milestones.forEach(m => {
      if (!m.achieved && netWorth >= m.targetNetWorth) {
        setMilestones(prev => prev.map(item => item.id === m.id ? { ...item, achieved: true } : item));
        setCash(prev => prev + m.rewardCash);
        setCelebratingMilestone(m);
        soundService.playMilestone();
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#EAB308']
          });
        } catch {
          // Ignore
        }
      }
    });

    if (netWorth > stats.highestNetWorth) {
      setStats(prev => ({ ...prev, highestNetWorth: netWorth }));
    }
  }, [netWorth, milestones, stats.highestNetWorth]);

  // Businesses Actions
  const buyBusiness = useCallback((id: string) => {
    const bus = businesses.find(b => b.id === id);
    if (!bus || bus.owned) return false;
    if (cash < bus.baseCost) return false;

    setCash(prev => prev - bus.baseCost);
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, owned: true, level: 1 } : b));
    setStats(prev => ({ ...prev, businessesOwnedCount: prev.businessesOwnedCount + 1 }));
    incrementObjectiveProgress('enterprise', 1);
    soundService.playCashPurchase();
    return true;
  }, [businesses, cash, incrementObjectiveProgress]);

  const upgradeBusinessLevel = useCallback((id: string) => {
    const bus = businesses.find(b => b.id === id);
    if (!bus || !bus.owned || bus.level >= bus.maxLevel) return false;
    const baseCost = Math.round(bus.baseCost * 0.45 * Math.pow(1.22, bus.level));
    const upgradeCost = Math.round(baseCost * influenceDiscountFactor);
    if (cash < upgradeCost) return false;

    setCash(prev => prev - upgradeCost);
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, level: b.level + 1 } : b));
    incrementObjectiveProgress('enterprise', 1);
    soundService.playUpgrade();
    return true;
  }, [businesses, cash, influenceDiscountFactor, incrementObjectiveProgress]);

  const buyBusinessUpgrade = useCallback((businessId: string, upgradeId: string) => {
    const bus = businesses.find(b => b.id === businessId);
    if (!bus || !bus.owned) return false;
    const upg = bus.upgrades.find(u => u.id === upgradeId);
    if (!upg || upg.purchased) return false;
    const upgradeCost = Math.round(upg.cost * influenceDiscountFactor);
    if (cash < upgradeCost) return false;

    setCash(prev => prev - upgradeCost);
    setBusinesses(prev => prev.map(b => {
      if (b.id !== businessId) return b;
      return {
        ...b,
        upgrades: b.upgrades.map(u => u.id === upgradeId ? { ...u, purchased: true } : u)
      };
    }));
    incrementObjectiveProgress('enterprise', 1);
    soundService.playUpgrade();
    return true;
  }, [businesses, cash, influenceDiscountFactor, incrementObjectiveProgress]);

  const hireBusinessManager = useCallback((businessId: string) => {
    const bus = businesses.find(b => b.id === businessId);
    if (!bus || !bus.owned || bus.managerHired) return false;
    if (cash < bus.managerCost) return false;

    setCash(prev => prev - bus.managerCost);
    setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, managerHired: true } : b));
    incrementObjectiveProgress('enterprise', 1);
    soundService.playUpgrade();
    return true;
  }, [businesses, cash, incrementObjectiveProgress]);

  const triggerSpecialAction = useCallback((businessId: string) => {
    const bus = businesses.find(b => b.id === businessId);
    if (!bus || !bus.owned || !bus.specialActionReward) return false;
    const now = Date.now();
    const cooldownMs = (bus.specialActionCooldown || 60) * 1000;
    if (bus.lastSpecialActionTime && (now - bus.lastSpecialActionTime) < cooldownMs) {
      return false;
    }

    const reward = Math.round(bus.specialActionReward * multiplier);
    setCash(prev => prev + reward);
    setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, lastSpecialActionTime: now } : b));
    incrementObjectiveProgress('enterprise', 1);
    soundService.playCashPurchase();
    return true;
  }, [businesses, multiplier, incrementObjectiveProgress]);

  // Stocks & Crypto Actions
  const buyStock = useCallback((symbol: string, shares: number) => {
    if (shares <= 0) return false;
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) return false;
    const totalCost = stock.price * shares;
    if (cash < totalCost) return false;

    setCash(prev => prev - totalCost);
    setStocks(prev => prev.map(s => {
      if (s.symbol !== symbol) return s;
      const newTotalShares = s.ownedShares + shares;
      const newAvgBuyPrice = ((s.avgBuyPrice * s.ownedShares) + totalCost) / newTotalShares;
      return {
        ...s,
        ownedShares: newTotalShares,
        avgBuyPrice: newAvgBuyPrice
      };
    }));
    setStats(prev => ({ ...prev, stockTradesCount: prev.stockTradesCount + 1 }));
    incrementObjectiveProgress('trading', 1);
    soundService.playTrade(true);
    return true;
  }, [stocks, cash, incrementObjectiveProgress]);

  const sellStock = useCallback((symbol: string, shares: number) => {
    if (shares <= 0) return false;
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock || stock.ownedShares < shares) return false;

    const totalProceeds = stock.price * shares;
    setCash(prev => prev + totalProceeds);
    setStocks(prev => prev.map(s => {
      if (s.symbol !== symbol) return s;
      const newShares = s.ownedShares - shares;
      return {
        ...s,
        ownedShares: newShares,
        avgBuyPrice: newShares === 0 ? 0 : s.avgBuyPrice
      };
    }));
    setStats(prev => ({ ...prev, stockTradesCount: prev.stockTradesCount + 1 }));
    incrementObjectiveProgress('trading', 1);
    soundService.playTrade(false);
    return true;
  }, [stocks, incrementObjectiveProgress]);

  // Real Estate Actions
  const buyProperty = useCallback((id: string) => {
    const prop = properties.find(p => p.id === id);
    if (!prop || prop.owned) return false;
    if (cash < prop.purchasePrice) return false;

    setCash(prev => prev - prop.purchasePrice);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, owned: true, currentMarketValue: p.purchasePrice } : p));
    setStats(prev => ({ ...prev, propertiesOwnedCount: prev.propertiesOwnedCount + 1 }));
    incrementObjectiveProgress('realestate', 1);
    soundService.playCashPurchase();
    return true;
  }, [properties, cash, incrementObjectiveProgress]);

  const renovateProperty = useCallback((id: string) => {
    const prop = properties.find(p => p.id === id);
    if (!prop || !prop.owned || prop.renovationStars >= 5) return false;
    const baseCost = Math.round(prop.renovationCost * Math.pow(1.3, prop.renovationStars));
    const cost = Math.round(baseCost * influenceDiscountFactor);
    if (cash < cost) return false;

    setCash(prev => prev - cost);
    setProperties(prev => prev.map(p => {
      if (p.id !== id) return p;
      const nextStars = p.renovationStars + 1;
      return {
        ...p,
        renovationStars: nextStars,
        currentMarketValue: Math.round(p.currentMarketValue * 1.35)
      };
    }));
    incrementObjectiveProgress('realestate', 1);
    soundService.playUpgrade();
    return true;
  }, [properties, cash, influenceDiscountFactor, incrementObjectiveProgress]);

  const sellProperty = useCallback((id: string) => {
    const prop = properties.find(p => p.id === id);
    if (!prop || !prop.owned) return false;

    const saleValue = Math.round(prop.currentMarketValue * (1 + prop.renovationStars * 0.25));
    setCash(prev => prev + saleValue);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, owned: false, renovationStars: 0 } : p));
    setStats(prev => ({ ...prev, propertiesOwnedCount: Math.max(0, prev.propertiesOwnedCount - 1) }));
    soundService.playCashPurchase();
    return true;
  }, [properties]);

  // Luxury Assets Actions
  const buyLuxuryItem = useCallback((id: string) => {
    const lux = luxuryItems.find(l => l.id === id);
    if (!lux || lux.owned) return false;
    if (cash < lux.cost) return false;

    setCash(prev => prev - lux.cost);
    setLuxuryItems(prev => prev.map(l => l.id === id ? { ...l, owned: true } : l));
    setStats(prev => ({ ...prev, luxuryAssetsCount: prev.luxuryAssetsCount + 1 }));
    soundService.playCashPurchase();
    return true;
  }, [luxuryItems, cash]);

  const sellLuxuryItem = useCallback((id: string) => {
    const lux = luxuryItems.find(l => l.id === id);
    if (!lux || !lux.owned) return false;

    const resellValue = Math.round(lux.cost * 0.75); // 75% resale
    setCash(prev => prev + resellValue);
    setLuxuryItems(prev => prev.map(l => l.id === id ? { ...l, owned: false } : l));
    setStats(prev => ({ ...prev, luxuryAssetsCount: Math.max(0, prev.luxuryAssetsCount - 1) }));
    soundService.playCashPurchase();
    return true;
  }, [luxuryItems]);

  // Bank Actions
  const unlockBank = useCallback(() => {
    if (bank.unlocked || cash < bank.licenseCost) return false;
    setCash(prev => prev - bank.licenseCost);
    setBank(prev => ({ ...prev, unlocked: true, vaultCash: 10000000 }));
    soundService.playMilestone();
    return true;
  }, [bank, cash]);

  const setDepositRate = useCallback((rate: number) => {
    setBank(prev => ({ ...prev, depositRatePercent: Math.max(0.5, Math.min(8.0, rate)) }));
  }, []);

  const setLoanRate = useCallback((rate: number) => {
    setBank(prev => ({ ...prev, loanRatePercent: Math.max(3.0, Math.min(25.0, rate)) }));
  }, []);

  const upgradeBankSecurity = useCallback(() => {
    if (!bank.unlocked || bank.securityTier >= 5) return false;
    const cost = 15000000 * bank.securityTier;
    if (cash < cost) return false;

    setCash(prev => prev - cost);
    setBank(prev => ({
      ...prev,
      securityTier: prev.securityTier + 1,
      defaultRiskPercent: Math.max(0.2, prev.defaultRiskPercent - 0.25)
    }));
    incrementObjectiveProgress('banking', 1);
    soundService.playUpgrade();
    return true;
  }, [bank, cash, incrementObjectiveProgress]);

  const injectBankReserve = useCallback((amount: number) => {
    if (!bank.unlocked || amount <= 0 || cash < amount) return false;
    setCash(prev => prev - amount);
    setBank(prev => ({
      ...prev,
      vaultCash: prev.vaultCash + amount,
      totalLoansIssued: prev.totalLoansIssued + amount * 0.8
    }));
    incrementObjectiveProgress('banking', 1);
    soundService.playTrade(true);
    return true;
  }, [bank, cash, incrementObjectiveProgress]);

  const withdrawBankReserve = useCallback((amount: number) => {
    if (!bank.unlocked || amount <= 0 || bank.vaultCash < amount) return false;
    setBank(prev => ({
      ...prev,
      vaultCash: prev.vaultCash - amount
    }));
    setCash(prev => prev + amount);
    soundService.playTrade(false);
    return true;
  }, [bank]);

  // Executive Persona & RPG Directives
  const updatePersona = useCallback((updates: Partial<ExecutivePersona>) => {
    setPersona(prev => ({ ...prev, ...updates }));
  }, []);

  const allocateStatusPoint = useCallback((attribute: 'charisma' | 'intellect' | 'elegance' | 'health' | 'influence') => {
    if (persona.unallocatedStatusPoints <= 0) return false;
    setPersona(prev => ({
      ...prev,
      unallocatedStatusPoints: prev.unallocatedStatusPoints - 1,
      [attribute]: prev[attribute] + 1
    }));
    soundService.playUpgrade();
    return true;
  }, [persona.unallocatedStatusPoints]);

  const performLifestyleActivity = useCallback((activityId: string) => {
    const act = lifestyleActivities.find(a => a.id === activityId);
    if (!act || cash < act.cost) return false;

    setCash(prev => prev - act.cost);
    setPersona(prev => ({
      ...prev,
      [act.attributeBoost.stat]: prev[act.attributeBoost.stat] + act.attributeBoost.amount
    }));
    incrementObjectiveProgress('lifestyle', 1);
    soundService.playUpgrade();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#F59E0B', '#10B981', '#60A5FA', '#EAB308']
      });
    } catch {
      // Ignore
    }
    return true;
  }, [cash, incrementObjectiveProgress]);

  const claimDailyObjective = useCallback((objectiveId: string) => {
    const obj = dailyObjectives.find(o => o.id === objectiveId);
    if (!obj || !obj.completed || obj.claimed) return false;

    // Award cash bonus
    setCash(prev => prev + obj.rewardCash);

    // Award unallocated status points and direct attribute booster
    setPersona(prev => {
      const nextAttr = obj.rewardAttribute ? {
        [obj.rewardAttribute]: prev[obj.rewardAttribute] + (obj.attributeBonusAmount || 1)
      } : {};

      return {
        ...prev,
        unallocatedStatusPoints: prev.unallocatedStatusPoints + obj.rewardStatusPoints,
        totalObjectivesCompleted: prev.totalObjectivesCompleted + 1,
        ...nextAttr
      };
    });

    setDailyObjectives(prev => prev.map(o => o.id === objectiveId ? { ...o, claimed: true } : o));
    soundService.playMilestone();

    try {
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#EAB308', '#EC4899', '#38BDF8']
      });
    } catch {
      // Ignore
    }
    return true;
  }, [dailyObjectives]);

  const refreshDailyObjectives = useCallback((force: boolean = false) => {
    const newObjs = generateDailyObjectives(incomePerHour, netWorth);
    setDailyObjectives(newObjs);
    setPersona(prev => ({
      ...prev,
      lastObjectivesRefreshTimestamp: Date.now()
    }));
    soundService.playUpgrade();
  }, [incomePerHour, netWorth]);

  // Countdown until next 24-hour cycle
  const timeUntilNextDailyRefresh = useMemo(() => {
    const elapsed = Date.now() - persona.lastObjectivesRefreshTimestamp;
    const remainingMs = Math.max(0, 86400000 - elapsed);
    return Math.floor(remainingMs / 1000);
  }, [persona.lastObjectivesRefreshTimestamp]);

  const claimMilestone = useCallback((id: string) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, achieved: true } : m));
  }, []);

  const closeOfflineModal = useCallback(() => {
    setOfflineModalData(null);
  }, []);

  const closeCelebrationModal = useCallback(() => {
    setCelebratingMilestone(null);
  }, []);

  // Dispatch and apply dynamic market event
  const dispatchMarketEvent = useCallback(() => {
    const result = generateDynamicMarketEvent({
      stocks,
      businesses,
      properties,
      billionaires: globalBillionaires,
      netWorth,
      cash
    });

    const newEvent = result.event;
    setNewsEvents(prev => [newEvent, ...prev.slice(0, 24)]);
    setLatestEvent(newEvent);

    // Apply stock price shock if affected
    if (result.stockEffect) {
      const { symbol, percentDelta } = result.stockEffect;
      setStocks(prevStocks => prevStocks.map(stock => {
        if (stock.symbol !== symbol) return stock;
        const newPrice = Math.max(0.01, Number((stock.price * (1 + percentDelta)).toFixed(stock.price < 1 ? 4 : 2)));
        return {
          ...stock,
          previousPrice: stock.price,
          price: newPrice,
          history: [...stock.history.slice(-14), newPrice]
        };
      }));
    }

    // Apply temporary business income boost / drag
    if (result.businessIncomeEffect) {
      const { businessId, boostFactor, durationSeconds } = result.businessIncomeEffect;
      const expiry = Date.now() + durationSeconds * 1000;
      setBusinessBoosts(prev => ({
        ...prev,
        [businessId]: { factor: boostFactor, expiry }
      }));
    }

    // Play subtle audio cue for high impact
    if (newEvent.type === 'bull') {
      soundService.playUpgrade();
    }
  }, [stocks, businesses, properties, netWorth, cash]);

  const triggerManualNewsEvent = useCallback(() => {
    dispatchMarketEvent();
  }, [dispatchMarketEvent]);

  // AI Advisor Chat Handler
  const sendAdvisorMessage = useCallback(async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      text: userText,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAdvisorLoading(true);

    try {
      const payloadGameState = {
        cash,
        netWorth,
        incomePerHour,
        multiplier,
        currentTitle: currentTitle.title,
        prestigePoints,
        businesses: businesses.filter(b => b.owned).map(b => ({
          name: b.name,
          level: b.level,
          managerHired: b.managerHired,
          baseIncomePerHour: b.baseIncomePerHour
        })),
        properties: properties.filter(p => p.owned).map(p => ({
          name: p.name,
          renovationStars: p.renovationStars,
          baseRentPerHour: p.baseRentPerHour
        })),
        stocks: stocks.map(s => ({
          symbol: s.symbol,
          price: s.price,
          ownedShares: s.ownedShares
        })),
        bank: {
          unlocked: bank.unlocked,
          vaultCash: bank.vaultCash,
          loanRatePercent: bank.loanRatePercent,
          depositRatePercent: bank.depositRatePercent
        },
        luxuryItems: luxuryItems.filter(l => l.owned).map(l => ({ name: l.name })),
        persona: {
          name: persona.name,
          bioTitle: persona.bioTitle,
          age: persona.age,
          city: persona.originCity,
          charisma: persona.charisma,
          intellect: persona.intellect,
          elegance: persona.elegance,
          health: persona.health,
          influence: persona.influence,
          unallocatedStatusPoints: persona.unallocatedStatusPoints
        },
        dailyObjectives: dailyObjectives.map(o => ({
          title: o.title,
          progress: `${o.currentCount}/${o.targetCount}`,
          completed: o.completed,
          claimed: o.claimed
        })),
        latestNews: latestEvent ? latestEvent.headline : newsEvents[0]?.headline || 'Normal market conditions'
      };

      const res = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: chatMessages.slice(-6).map(m => ({ role: m.role, text: m.text })),
          gameState: payloadGameState
        })
      });

      if (!res.ok) {
        throw new Error(`Advisor communication error (${res.status})`);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        text: data.reply || "I have analyzed your corporate balances, Chief Executive. Let us continue executing our strategy.",
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: 'bot_err_' + Date.now(),
        role: 'assistant',
        text: "Pardon me, Chief Executive. Our secure satellite encrypted line encountered minor interference. Based on your current balance sheet, I recommend reinvesting available cash into automated enterprises or dividend-yielding equities to compound your hourly cash flow.",
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsAdvisorLoading(false);
    }
  }, [cash, netWorth, incomePerHour, multiplier, currentTitle, prestigePoints, businesses, properties, stocks, bank, luxuryItems, latestEvent, newsEvents, chatMessages]);

  // Reset Game
  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCash(1000);
    setBusinesses(initialBusinesses);
    setStocks(initialStocks);
    setProperties(initialRealEstate);
    setLuxuryItems(initialLuxuryItems);
    setBank(initialBankState);
    setMilestones(initialMilestones);
    setStats(initialStats);
    setPersona(initialPersona);
    setDailyObjectives(generateDailyObjectives(100, 1000));
  }, []);

  // Offline earnings calculation on mount
  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lastSavedTimestamp) {
          const now = Date.now();
          const elapsedSec = Math.floor((now - parsed.lastSavedTimestamp) / 1000);
          // Only show modal if away for more than 20 seconds
          if (elapsedSec >= 20 && parsed.incomePerHour && parsed.incomePerHour > 0) {
            // Cap offline progression at 24 hours (86,400 seconds)
            const cappedSec = Math.min(elapsedSec, 86400);
            const earned = Math.round((cappedSec / 3600) * parsed.incomePerHour);
            if (earned > 0) {
              setCash(prev => prev + earned);
              setOfflineModalData({
                elapsedSeconds: elapsedSec,
                earnings: earned
              });
            }
          }
        }
      }
    } catch {
      // Fallback
    }
  }, []);

  // Live Game Loop: Ticks every 1 second (scaled by gameSpeed)
  useEffect(() => {
    const interval = setInterval(() => {
      // Passive income per second = incomePerHour / 3600 * gameSpeed
      const perSec = (incomePerHour / 3600) * gameSpeed;
      if (perSec > 0) {
        setCash(prev => prev + perSec);
      }

      setStats(prev => ({
        ...prev,
        timePlayedSeconds: prev.timePlayedSeconds + gameSpeed
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [incomePerHour, gameSpeed]);

  // Market Price Ticks: Update stock & crypto prices every 3 seconds
  useEffect(() => {
    const marketInterval = setInterval(() => {
      setStocks(prevStocks => {
        return prevStocks.map(stock => {
          // Random walk with slight mean reversion
          const pctDeviation = (stock.price - stock.initialPrice) / stock.initialPrice;
          const reversionPull = -pctDeviation * 0.08;
          const randomShock = (Math.random() - 0.49) * 2 * stock.volatility;
          const deltaPct = randomShock + reversionPull;
          const nextPrice = Math.max(0.01, Number((stock.price * (1 + deltaPct)).toFixed(stock.price < 1 ? 4 : 2)));

          // Append to history, keeping max 15 points
          const nextHistory = [...stock.history.slice(-14), nextPrice];
          return {
            ...stock,
            previousPrice: stock.price,
            price: nextPrice,
            history: nextHistory
          };
        });
      });

      // Subtle property market appreciation every 12 seconds
      if (Math.random() < 0.25) {
        setProperties(prevProps => prevProps.map(prop => {
          if (!prop.owned) return prop;
          const delta = 1 + (Math.random() * 0.01 - 0.003); // slight upward bias
          return {
            ...prop,
            currentMarketValue: Math.round(prop.currentMarketValue * delta)
          };
        }));
      }
    }, 3000);

    return () => clearInterval(marketInterval);
  }, []);

  // Periodic Random Market Event Trigger (every 18 seconds)
  useEffect(() => {
    const eventTimer = setInterval(() => {
      dispatchMarketEvent();
    }, 18000 / gameSpeed);

    return () => clearInterval(eventTimer);
  }, [dispatchMarketEvent, gameSpeed]);

  // Periodic Auto-Save to localStorage
  useEffect(() => {
    const saveState = () => {
      try {
        const payload = {
          cash,
          incomePerHour,
          businesses: businesses.map(b => ({
            id: b.id,
            level: b.level,
            owned: b.owned,
            managerHired: b.managerHired,
            upgrades: b.upgrades.map(u => ({ id: u.id, purchased: u.purchased }))
          })),
          stocks: stocks.map(s => ({
            symbol: s.symbol,
            price: s.price,
            history: s.history,
            ownedShares: s.ownedShares,
            avgBuyPrice: s.avgBuyPrice
          })),
          properties: properties.map(p => ({
            id: p.id,
            owned: p.owned,
            renovationStars: p.renovationStars,
            currentMarketValue: p.currentMarketValue
          })),
          luxuryItems: luxuryItems.map(l => ({
            id: l.id,
            owned: l.owned
          })),
          bank,
          milestones: milestones.map(m => ({ id: m.id, achieved: m.achieved })),
          stats,
          persona,
          dailyObjectives,
          lastSavedTimestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // LocalStorage quota or private mode fallback
      }
    };

    const saveTimer = setInterval(saveState, 5000);
    window.addEventListener('beforeunload', saveState);

    return () => {
      clearInterval(saveTimer);
      window.removeEventListener('beforeunload', saveState);
    };
  }, [cash, incomePerHour, businesses, stocks, properties, luxuryItems, bank, milestones, stats, persona, dailyObjectives]);

  return (
    <GameContext.Provider
      value={{
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
        gameSpeed,
        setGameSpeed,
        isMuted,
        toggleSound,
        manualTapDeal,
        tapEarningsAmount,
        businesses,
        buyBusiness,
        upgradeBusinessLevel,
        buyBusinessUpgrade,
        hireBusinessManager,
        triggerSpecialAction,
        stocks,
        headlines,
        buyStock,
        sellStock,
        properties,
        buyProperty,
        renovateProperty,
        sellProperty,
        luxuryItems,
        buyLuxuryItem,
        sellLuxuryItem,
        bank,
        unlockBank,
        setDepositRate,
        setLoanRate,
        upgradeBankSecurity,
        injectBankReserve,
        withdrawBankReserve,
        milestones,
        claimMilestone,
        stats,
        newsEvents,
        latestEvent,
        triggerManualNewsEvent,
        persona,
        updatePersona,
        allocateStatusPoint,
        performLifestyleActivity,
        lifestyleActivitiesList: lifestyleActivities,
        dailyObjectives,
        claimDailyObjective,
        refreshDailyObjectives,
        timeUntilNextDailyRefresh,
        chatMessages,
        isAdvisorLoading,
        sendAdvisorMessage,
        isAdvisorOpen,
        setIsAdvisorOpen,
        offlineModalData,
        closeOfflineModal,
        celebratingMilestone,
        closeCelebrationModal,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
