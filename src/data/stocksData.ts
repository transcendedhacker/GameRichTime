import { StockQuote } from '../types/game';

export const initialStocks: StockQuote[] = [
  {
    symbol: 'APX',
    name: 'Apex Technologies',
    category: 'Tech',
    price: 245.50,
    initialPrice: 245.50,
    previousPrice: 242.10,
    dividendYieldPerHour: 0.0004, // 0.04% per hour
    volatility: 0.022,
    history: [238.2, 240.1, 239.5, 242.0, 241.8, 244.2, 243.0, 245.5],
    ownedShares: 0,
    avgBuyPrice: 0,
    description: 'Global consumer electronics, smartphones, operating systems, and cloud infrastructure.'
  },
  {
    symbol: 'NVX',
    name: 'Nova Dynamics AI',
    category: 'Tech',
    price: 680.00,
    initialPrice: 680.00,
    previousPrice: 665.40,
    dividendYieldPerHour: 0.0002,
    volatility: 0.038,
    history: [620.0, 635.5, 642.0, 650.0, 662.5, 658.0, 665.4, 680.0],
    ownedShares: 0,
    avgBuyPrice: 0,
    description: 'Designer of next-generation tensor chips powering foundation generative AI models.'
  },
  {
    symbol: 'VLT',
    name: 'Volt Motors',
    category: 'Automotive',
    price: 165.20,
    initialPrice: 165.20,
    previousPrice: 168.00,
    dividendYieldPerHour: 0.0001,
    volatility: 0.032,
    history: [175.0, 172.5, 170.0, 166.4, 169.2, 167.0, 168.0, 165.2],
    ownedShares: 0,
    avgBuyPrice: 0,
    description: 'Electric mobility leader producing luxury performance sedans and autonomous robotaxis.'
  },
  {
    symbol: 'BEX',
    name: 'BioGenix Pharma',
    category: 'Health',
    price: 112.80,
    initialPrice: 112.80,
    previousPrice: 110.50,
    dividendYieldPerHour: 0.0006, // High dividend
    volatility: 0.020,
    history: [108.0, 109.2, 108.8, 110.1, 109.8, 111.4, 110.5, 112.8],
    ownedShares: 0,
    avgBuyPrice: 0,
    description: 'Biopharmaceutical giant with patents on gene editing therapies and oncology treatments.'
  },
  {
    symbol: 'CRD',
    name: 'Crestview Energy',
    category: 'Energy',
    price: 185.40,
    initialPrice: 185.40,
    previousPrice: 184.20,
    dividendYieldPerHour: 0.0008, // Very strong dividend
    volatility: 0.018,
    history: [180.5, 181.2, 183.0, 182.4, 183.9, 184.5, 184.2, 185.4],
    ownedShares: 0,
    avgBuyPrice: 0,
    description: 'International oil exploration and green hydrogen infrastructure operator.'
  },
  {
    symbol: 'AEX',
    name: 'Aegis Aerospace & Defense',
    category: 'Defense',
    price: 430.00,
    initialPrice: 430.00,
    previousPrice: 424.50,
    dividendYieldPerHour: 0.0005,
    volatility: 0.019,
    history: [415.0, 418.0, 420.5, 422.0, 421.5, 425.0, 424.5, 430.0],
    ownedShares: 0,
    avgBuyPrice: 0,
    description: 'Prime contractor for supersonic airframes, stealth avionics, and orbital defense systems.'
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin Digital Gold',
    category: 'Crypto',
    price: 64200.00,
    initialPrice: 64200.00,
    previousPrice: 62800.00,
    dividendYieldPerHour: 0,
    volatility: 0.055,
    history: [59500, 60800, 61400, 60200, 62100, 63500, 62800, 64200],
    ownedShares: 0,
    avgBuyPrice: 0,
    description: 'Decentralized digital store of value with a hard-coded 21 million supply limit.'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum Network',
    category: 'Crypto',
    price: 3450.00,
    initialPrice: 3450.00,
    previousPrice: 3380.00,
    dividendYieldPerHour: 0.0003, // Staking yield
    volatility: 0.060,
    history: [3150, 3220, 3280, 3250, 3340, 3400, 3380, 3450],
    ownedShares: 0,
    avgBuyPrice: 0,
    description: 'The foundation layer for decentralized finance, smart contracts, and tokenized assets.'
  },
  {
    symbol: 'SOL',
    name: 'Solana High-Speed',
    category: 'Crypto',
    price: 152.00,
    initialPrice: 152.00,
    previousPrice: 144.50,
    dividendYieldPerHour: 0.0002,
    volatility: 0.075,
    history: [130, 134, 138, 135, 142, 148, 144.5, 152],
    ownedShares: 0,
    avgBuyPrice: 0,
    description: 'Ultra-low latency blockchain processing 65,000 transactions per second.'
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    category: 'Crypto',
    price: 0.165,
    initialPrice: 0.165,
    previousPrice: 0.158,
    dividendYieldPerHour: 0,
    volatility: 0.095, // Extreme volatility
    history: [0.14, 0.145, 0.152, 0.148, 0.160, 0.163, 0.158, 0.165],
    ownedShares: 0,
    avgBuyPrice: 0,
    description: 'Internet meme cryptocurrency with passionate global community and unpredictable price swings.'
  }
];

export interface MarketHeadline {
  id: string;
  timeAgo: string;
  text: string;
  impactSymbol?: string;
  type: 'bull' | 'bear' | 'neutral';
}

export const sampleHeadlines: MarketHeadline[] = [
  { id: 'h1', timeAgo: 'Just now', text: 'Apex Technologies reports record quarterly earnings and announces AI chip integration.', impactSymbol: 'APX', type: 'bull' },
  { id: 'h2', timeAgo: '2m ago', text: 'Central Banks hint at lowering benchmark borrowing rates, sparking market-wide liquidity surge.', type: 'bull' },
  { id: 'h3', timeAgo: '6m ago', text: 'Nova Dynamics signs multi-billion sovereign cloud deal with Gulf energy coalition.', impactSymbol: 'NVX', type: 'bull' },
  { id: 'h4', timeAgo: '12m ago', text: 'Crypto market experiences heavy short liquidations as Bitcoin pushes toward resistance levels.', impactSymbol: 'BTC', type: 'bull' },
  { id: 'h5', timeAgo: '18m ago', text: 'Crestview Energy pays special quarterly dividend following offshore field discovery.', impactSymbol: 'CRD', type: 'bull' }
];
