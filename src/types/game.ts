export interface BusinessUpgrade {
  id: string;
  name: string;
  cost: number;
  multiplier: number;
  purchased: boolean;
  description: string;
}

export interface BusinessItem {
  id: string;
  name: string;
  category: 'Retail' | 'Services' | 'Industrial' | 'Tech' | 'Finance' | 'Mega-Corp';
  icon: string;
  tagline: string;
  description: string;
  baseCost: number;
  baseIncomePerHour: number;
  level: number;
  maxLevel: number;
  owned: boolean;
  managerHired: boolean;
  managerCost: number;
  managerName: string;
  managerBonusPercent: number; // e.g., 25 means +25%
  upgrades: BusinessUpgrade[];
  specialActionTitle?: string;
  specialActionReward?: number;
  specialActionCooldown?: number; // seconds
  lastSpecialActionTime?: number;
}

export interface StockQuote {
  symbol: string;
  name: string;
  category: 'Tech' | 'Energy' | 'Automotive' | 'Health' | 'Defense' | 'Crypto';
  price: number;
  initialPrice: number;
  previousPrice: number;
  dividendYieldPerHour: number; // as % of price
  volatility: number; // 0.01 to 0.08
  history: number[];
  ownedShares: number;
  avgBuyPrice: number;
  description: string;
}

export interface RealEstateItem {
  id: string;
  name: string;
  tier: 'Residential' | 'Luxury' | 'Commercial' | 'Exclusive';
  location: string;
  purchasePrice: number;
  currentMarketValue: number;
  baseRentPerHour: number;
  owned: boolean;
  renovationStars: number; // 0 to 5
  renovationCost: number;
  description: string;
  features: string[];
}

export interface LuxuryItem {
  id: string;
  name: string;
  category: 'Supercar' | 'Aircraft' | 'Superyacht' | 'Estate';
  brand: string;
  cost: number;
  hourlyMaintenance: number;
  prestigePoints: number;
  owned: boolean;
  topSpeedOrSpecs: string;
  description: string;
}

export interface BankAccountState {
  unlocked: boolean;
  vaultCash: number;
  depositRatePercent: number; // 1% to 8% paid to depositors
  loanRatePercent: number;    // 5% to 22% charged to borrowers
  totalCustomerDeposits: number;
  totalLoansIssued: number;
  defaultRiskPercent: number;
  securityTier: number; // 1 to 5
  licenseCost: number;
}

export interface BillionaireProfile {
  rank: number;
  name: string;
  netWorth: number;
  company: string;
  country: string;
  industry: string;
}

export interface GameStats {
  totalClicks: number;
  manualCashEarned: number;
  businessesOwnedCount: number;
  propertiesOwnedCount: number;
  luxuryAssetsCount: number;
  stockTradesCount: number;
  highestNetWorth: number;
  timePlayedSeconds: number;
}

export interface Milestone {
  id: string;
  title: string;
  targetNetWorth: number;
  rewardCash: number;
  rewardPrestige: number;
  achieved: boolean;
  description: string;
}

export interface MarketEvent {
  id: string;
  timestamp: number;
  timeAgo: string;
  headline: string;
  category: 'Stock' | 'Business' | 'Economy' | 'Billionaire' | 'Crypto';
  type: 'bull' | 'bear' | 'neutral';
  affectedTargetName?: string;
  impactDescription: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export type ObjectiveCategory = 'deals' | 'trading' | 'enterprise' | 'realestate' | 'banking' | 'lifestyle';

export interface DailyObjective {
  id: string;
  title: string;
  description: string;
  category: ObjectiveCategory;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  claimed: boolean;
  rewardCash: number;
  rewardStatusPoints: number;
  rewardAttribute?: 'charisma' | 'intellect' | 'elegance' | 'health' | 'influence';
  attributeBonusAmount?: number;
}

export interface ExecutivePersona {
  name: string;
  bioTitle: string;
  avatarId: string;
  age: number; // e.g. starts at 28, ages slowly with calendar/game progression
  originCity: string;
  // Core RPG Attributes (0 to 100+)
  charisma: number;      // Boosts manual deals & manager productivity (+0.5% per pt)
  intellect: number;     // Boosts dividend yields & reduces banking default risk (+0.5% per pt)
  elegance: number;      // Multiplies luxury prestige & social standing (+0.5% per pt)
  health: number;        // Energy & vitality; high health boosts passive efficiency up to +20%
  influence: number;     // Political clout; reduces upgrade & property renovation costs (-0.3% per pt)
  unallocatedStatusPoints: number;
  totalObjectivesCompleted: number;
  lastObjectivesRefreshTimestamp: number;
}

export interface LifestyleActivity {
  id: string;
  name: string;
  category: 'Wellness' | 'Social' | 'Academia' | 'Diplomacy';
  cost: number;
  attributeBoost: {
    stat: 'charisma' | 'intellect' | 'elegance' | 'health' | 'influence';
    amount: number;
  };
  durationSeconds: number;
  description: string;
}
