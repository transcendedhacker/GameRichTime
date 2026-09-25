import { BillionaireProfile } from '../types/game';

export const globalBillionaires: BillionaireProfile[] = [
  { rank: 1, name: 'Elon M.', netWorth: 265000000000, company: 'Tesla & SpaceX', country: 'United States', industry: 'Automotive & Space' },
  { rank: 2, name: 'Jeff B.', netWorth: 215000000000, company: 'Amazon', country: 'United States', industry: 'Technology & Cloud' },
  { rank: 3, name: 'Bernard A.', netWorth: 195000000000, company: 'LVMH Moët Hennessy', country: 'France', industry: 'Luxury Goods' },
  { rank: 4, name: 'Mark Z.', netWorth: 185000000000, company: 'Meta Platforms', country: 'United States', industry: 'Tech & Social' },
  { rank: 5, name: 'Larry E.', netWorth: 175000000000, company: 'Oracle Corporation', country: 'United States', industry: 'Enterprise Software' },
  { rank: 6, name: 'Warren B.', netWorth: 142000000000, company: 'Berkshire Hathaway', country: 'United States', industry: 'Conglomerate & Finance' },
  { rank: 7, name: 'Bill G.', netWorth: 130000000000, company: 'Microsoft & Cascade', country: 'United States', industry: 'Tech & Philanthropy' },
  { rank: 8, name: 'Steve B.', netWorth: 125000000000, company: 'Microsoft / LA Clippers', country: 'United States', industry: 'Technology & Sports' },
  { rank: 9, name: 'Mukesh A.', netWorth: 118000000000, company: 'Reliance Industries', country: 'India', industry: 'Energy, Retail & Telecom' },
  { rank: 10, name: 'Amancio O.', netWorth: 105000000000, company: 'Inditex (Zara)', country: 'Spain', industry: 'Fast Fashion & Real Estate' },
  { rank: 25, name: 'Carlos Slim', netWorth: 92000000000, company: 'América Móvil', country: 'Mexico', industry: 'Telecommunications' },
  { rank: 50, name: 'Gautam A.', netWorth: 78000000000, company: 'Adani Group', country: 'India', industry: 'Infrastructure & Commodities' },
  { rank: 100, name: 'Ken Griffin', netWorth: 42000000000, company: 'Citadel Securities', country: 'United States', industry: 'Hedge Funds & Market Making' },
  { rank: 250, name: 'Ray Dalio', netWorth: 19000000000, company: 'Bridgewater Associates', country: 'United States', industry: 'Macro Investing' },
  { rank: 500, name: 'David Tepper', netWorth: 12000000000, company: 'Appaloosa Management', country: 'United States', industry: 'Distressed Debt' },
  { rank: 1000, name: 'Bespoke Family Trust', netWorth: 3500000000, company: 'Private Syndicate', country: 'Switzerland', industry: 'Private Banking' },
  { rank: 2500, name: 'Venture Capital Partner', netWorth: 1000000000, company: 'Sand Hill Ventures', country: 'United States', industry: 'Venture Capital' }
];

export interface TitleRank {
  minNetWorth: number;
  title: string;
  badge: string;
  bonusMultiplier: number;
}

export const titleRanks: TitleRank[] = [
  { minNetWorth: 0, title: 'Aspiring Hustler', badge: 'Tier I', bonusMultiplier: 1.0 },
  { minNetWorth: 5000, title: 'Freelance Operator', badge: 'Tier II', bonusMultiplier: 1.02 },
  { minNetWorth: 50000, title: 'Storefront Proprietor', badge: 'Tier III', bonusMultiplier: 1.05 },
  { minNetWorth: 250000, title: 'Serial Entrepreneur', badge: 'Tier IV', bonusMultiplier: 1.10 },
  { minNetWorth: 1000000, title: 'Self-Made Millionaire', badge: 'Tier V', bonusMultiplier: 1.15 },
  { minNetWorth: 10000000, title: 'Corporate Tycoon', badge: 'Tier VI', bonusMultiplier: 1.25 },
  { minNetWorth: 50000000, title: 'Private Equity Titan', badge: 'Tier VII', bonusMultiplier: 1.35 },
  { minNetWorth: 250000000, title: 'Industrial Magnate', badge: 'Tier VIII', bonusMultiplier: 1.50 },
  { minNetWorth: 1000000000, title: 'Forbes Billionaire', badge: 'Tier IX', bonusMultiplier: 1.75 },
  { minNetWorth: 10000000000, title: 'Global Oligarch', badge: 'Tier X', bonusMultiplier: 2.00 },
  { minNetWorth: 100000000000, title: 'Centibillionaire Sovereign', badge: 'Tier XI', bonusMultiplier: 2.50 },
  { minNetWorth: 1000000000000, title: 'Trillionaire Overlord', badge: 'Tier XII', bonusMultiplier: 3.00 }
];
