import { DailyObjective, ObjectiveCategory } from '../types/game';

interface ObjectiveTemplate {
  title: string;
  description: string;
  category: ObjectiveCategory;
  baseTarget: number;
  rewardStatusPoints: number;
  rewardAttribute: 'charisma' | 'intellect' | 'elegance' | 'health' | 'influence';
  attributeBonusAmount: number;
}

const TEMPLATES: ObjectiveTemplate[] = [
  {
    title: 'Executive Dealmaker',
    description: 'Negotiate and sign {target} manual commercial contracts from your executive desk.',
    category: 'deals',
    baseTarget: 25,
    rewardStatusPoints: 2,
    rewardAttribute: 'charisma',
    attributeBonusAmount: 2
  },
  {
    title: 'Wall Street Liquidity',
    description: 'Execute {target} equity or cryptocurrency market orders on the terminal.',
    category: 'trading',
    baseTarget: 3,
    rewardStatusPoints: 2,
    rewardAttribute: 'intellect',
    attributeBonusAmount: 2
  },
  {
    title: 'Industrial Expansion',
    description: 'Upgrade an enterprise operational capacity or retain an officer.',
    category: 'enterprise',
    baseTarget: 1,
    rewardStatusPoints: 3,
    rewardAttribute: 'influence',
    attributeBonusAmount: 2
  },
  {
    title: 'Elite High Society',
    description: 'Participate in {target} executive wellness or elite lifestyle activity.',
    category: 'lifestyle',
    baseTarget: 1,
    rewardStatusPoints: 2,
    rewardAttribute: 'elegance',
    attributeBonusAmount: 3
  },
  {
    title: 'Architectural Renovation',
    description: 'Enhance a real estate title with architectural renovations or acquire land.',
    category: 'realestate',
    baseTarget: 1,
    rewardStatusPoints: 3,
    rewardAttribute: 'influence',
    attributeBonusAmount: 2
  },
  {
    title: 'Central Vault Liquidity',
    description: 'Calibrate private bank lending margins or deposit reserve capital.',
    category: 'banking',
    baseTarget: 1,
    rewardStatusPoints: 3,
    rewardAttribute: 'intellect',
    attributeBonusAmount: 2
  },
  {
    title: 'Endurance & Vitality',
    description: 'Sign {target} high-stakes contracts without suffering executive burnout.',
    category: 'deals',
    baseTarget: 50,
    rewardStatusPoints: 2,
    rewardAttribute: 'health',
    attributeBonusAmount: 3
  }
];

export function generateDailyObjectives(hourlyIncome: number, netWorth: number): DailyObjective[] {
  // Select 4 random distinct templates
  const shuffled = [...TEMPLATES].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 4);

  // Scaled cash bonus: proportional to current hourly income with reasonable floor and cap
  const scaledCashReward = Math.max(1500, Math.round(hourlyIncome * 0.4 + 500));

  return selected.map((tpl, index) => {
    return {
      id: `obj_${Date.now()}_${index}`,
      title: tpl.title,
      description: tpl.description.replace('{target}', tpl.baseTarget.toString()),
      category: tpl.category,
      targetCount: tpl.baseTarget,
      currentCount: 0,
      completed: false,
      claimed: false,
      rewardCash: scaledCashReward,
      rewardStatusPoints: tpl.rewardStatusPoints,
      rewardAttribute: tpl.rewardAttribute,
      attributeBonusAmount: tpl.attributeBonusAmount
    };
  });
}
