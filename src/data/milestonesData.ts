import { Milestone } from '../types/game';

export const initialMilestones: Milestone[] = [
  {
    id: 'm_first_business',
    title: 'First Commercial Venture',
    targetNetWorth: 2000,
    rewardCash: 1000,
    rewardPrestige: 10,
    achieved: false,
    description: 'Acquire your very first business and launch your corporate empire.'
  },
  {
    id: 'm_six_figures',
    title: 'Six-Figure Executive',
    targetNetWorth: 100000,
    rewardCash: 25000,
    rewardPrestige: 25,
    achieved: false,
    description: 'Amass a total net worth exceeding $100,000 across assets and bank accounts.'
  },
  {
    id: 'm_millionaire',
    title: 'The Seven-Figure Club',
    targetNetWorth: 1000000,
    rewardCash: 150000,
    rewardPrestige: 100,
    achieved: false,
    description: 'Cross the monumental milestone of $1,000,000 net worth. Welcome to high society.'
  },
  {
    id: 'm_eight_figures',
    title: 'Decamillionaire Mogul',
    targetNetWorth: 10000000,
    rewardCash: 1200000,
    rewardPrestige: 350,
    achieved: false,
    description: 'Reach $10,000,000 in combined equity, luxury fleets, and commercial properties.'
  },
  {
    id: 'm_centimillionaire',
    title: 'Centimillionaire Titan',
    targetNetWorth: 100000000,
    rewardCash: 15000000,
    rewardPrestige: 1200,
    achieved: false,
    description: 'Break into the 9-figure echelon ($100M+). Your commercial decisions sway global indices.'
  },
  {
    id: 'm_billionaire',
    title: 'The 3-Comma Club (Billionaire)',
    targetNetWorth: 1000000000,
    rewardCash: 100000000,
    rewardPrestige: 5000,
    achieved: false,
    description: 'Accumulate $1,000,000,000 net worth. Enter the official Forbes Billionaires Registry.'
  },
  {
    id: 'm_decabillionaire',
    title: 'Decabillionaire Sovereign',
    targetNetWorth: 10000000000,
    rewardCash: 1000000000,
    rewardPrestige: 15000,
    achieved: false,
    description: 'Cross $10 Billion. Control vast industrial conglomerates and state banking monopolies.'
  },
  {
    id: 'm_trillionaire',
    title: 'World’s First Trillionaire',
    targetNetWorth: 1000000000000,
    rewardCash: 50000000000,
    rewardPrestige: 100000,
    achieved: false,
    description: 'Surpass all human financial limits. You have monopolized global commerce and space transit.'
  }
];
