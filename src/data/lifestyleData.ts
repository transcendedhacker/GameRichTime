import { LifestyleActivity } from '../types/game';

export const lifestyleActivities: LifestyleActivity[] = [
  {
    id: 'act_cryo_spa',
    name: 'Private Cryotherapy & Longevity Clinic',
    category: 'Wellness',
    cost: 2500,
    attributeBoost: {
      stat: 'health',
      amount: 4
    },
    durationSeconds: 15,
    description: 'Undergo hyperbaric oxygen chambers and cryo-restoration for peak executive stamina.'
  },
  {
    id: 'act_met_gala',
    name: 'High Society Met Gala Red Carpet',
    category: 'Social',
    cost: 15000,
    attributeBoost: {
      stat: 'elegance',
      amount: 4
    },
    durationSeconds: 20,
    description: 'Bespoke haute couture styling and red carpet presence among international cultural elites.'
  },
  {
    id: 'act_davos_summit',
    name: 'Davos World Economic Forum Keynote',
    category: 'Diplomacy',
    cost: 50000,
    attributeBoost: {
      stat: 'charisma',
      amount: 5
    },
    durationSeconds: 30,
    description: 'Deliver opening address on sovereign capital flows before global prime ministers and central bankers.'
  },
  {
    id: 'act_quantum_thinktank',
    name: 'Oxford Oxford/MIT Think Tank Fellowship',
    category: 'Academia',
    cost: 35000,
    attributeBoost: {
      stat: 'intellect',
      amount: 5
    },
    durationSeconds: 25,
    description: 'Sponsor and participate in high-level geopolitical and quantum financial modeling.'
  },
  {
    id: 'act_senate_lobby',
    name: 'Bipartisan Congressional PAC Delegation',
    category: 'Diplomacy',
    cost: 120000,
    attributeBoost: {
      stat: 'influence',
      amount: 6
    },
    durationSeconds: 40,
    description: 'Establish legislative ties in capital chambers, securing municipal deregulation and subsidies.'
  }
];
