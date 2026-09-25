import { MarketEvent, StockQuote, BusinessItem, RealEstateItem, BillionaireProfile } from '../types/game';

interface EventGeneratorInput {
  stocks: StockQuote[];
  businesses: BusinessItem[];
  properties: RealEstateItem[];
  billionaires: BillionaireProfile[];
  netWorth: number;
  cash: number;
}

export interface GeneratedMarketEventResult {
  event: MarketEvent;
  stockEffect?: { symbol: string; percentDelta: number };
  businessIncomeEffect?: { businessId: string; boostFactor: number; durationSeconds: number };
  cashBonusEffect?: number;
}

export function generateDynamicMarketEvent(input: EventGeneratorInput): GeneratedMarketEventResult {
  const { stocks, businesses, properties, billionaires, netWorth } = input;
  const id = 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const now = Date.now();

  const randCategory = Math.random();

  // 1. Stock / Crypto Specific Shock (40% probability)
  if (randCategory < 0.40 && stocks.length > 0) {
    const stock = stocks[Math.floor(Math.random() * stocks.length)];
    const isCrypto = stock.category === 'Crypto';
    const isBull = Math.random() > 0.45;
    const deltaPercent = isBull
      ? (isCrypto ? +(0.08 + Math.random() * 0.18) : +(0.04 + Math.random() * 0.10))
      : (isCrypto ? -(0.06 + Math.random() * 0.15) : -(0.03 + Math.random() * 0.08));

    const headlinesBull = [
      `BREAKING: ${stock.name} (${stock.symbol}) beats Wall Street consensus with 48% surge in quarterly revenue!`,
      `${stock.symbol} secures sovereign wealth fund endorsement; institutional inflows accelerate rapidly.`,
      `Regulatory greenlight granted to ${stock.name} for breakthrough technological expansion!`,
      `${stock.symbol} experiences massive short squeeze as trading volume shatters all-time records!`
    ];

    const headlinesBear = [
      `FLASH: ${stock.name} (${stock.symbol}) faces sudden supply chain bottlenecks and margin compression.`,
      `Antitrust regulators open probe into ${stock.symbol} market dominance, triggering sudden selloff.`,
      `Whale wallet transfers large tranche of ${stock.symbol}, sending order books into brief panic.`,
      `Downgrade warning: Major investment bank trims ${stock.name} target guidance citing macro headwinds.`
    ];

    const headline = isBull
      ? headlinesBull[Math.floor(Math.random() * headlinesBull.length)]
      : headlinesBear[Math.floor(Math.random() * headlinesBear.length)];

    return {
      event: {
        id,
        timestamp: now,
        timeAgo: 'Just now',
        headline,
        category: isCrypto ? 'Crypto' : 'Stock',
        type: isBull ? 'bull' : 'bear',
        affectedTargetName: stock.symbol,
        impactDescription: `${stock.symbol} shares ${isBull ? 'surged' : 'dropped'} by ${(Math.abs(deltaPercent) * 100).toFixed(1)}%`
      },
      stockEffect: {
        symbol: stock.symbol,
        percentDelta: deltaPercent
      }
    };
  }

  // 2. Enterprise & Industry News (30% probability)
  if (randCategory < 0.70 && businesses.length > 0) {
    const business = businesses[Math.floor(Math.random() * businesses.length)];
    const isOwned = business.owned;
    const isBull = Math.random() > 0.4;

    const templatesBull = [
      `COMMERCE: Surge in consumer demand boosts margins for ${business.category.toLowerCase()} sector across the metropolis!`,
      `INDUSTRY PULSE: New municipal trade accord accelerates revenue opportunities for ${business.name}.`,
      `TECHNOLOGY BREAKTHROUGH: Next-gen automation tools cut operating overhead for ${business.category} operators by 25%.`,
      `HIGH FOOTFALL: Executive summits and conferences in downtown corridors spur major spending spikes.`
    ];

    const templatesBear = [
      `MARKET WATCH: Energy grid spikes temporarily increase operational overhead for industrial & service enterprises.`,
      `SUPPLY SHIFT: Commercial logistics delays cause localized supply squeezes for ${business.name}.`,
      `REGULATORY SHIFT: New municipal commercial licensing guidelines implemented across city business districts.`,
      `MACRO CAUTION: Consumer discretionary spending contracts slightly amidst cautious credit conditions.`
    ];

    const headline = isBull
      ? templatesBull[Math.floor(Math.random() * templatesBull.length)]
      : templatesBear[Math.floor(Math.random() * templatesBear.length)];

    return {
      event: {
        id,
        timestamp: now,
        timeAgo: 'Just now',
        headline,
        category: 'Business',
        type: isBull ? 'bull' : (Math.random() > 0.5 ? 'neutral' : 'bear'),
        affectedTargetName: business.name,
        impactDescription: isOwned
          ? (isBull ? `Your ${business.name} operations experience high demand!` : `Your ${business.name} manages through sector fluctuations.`)
          : `${business.category} sector market movement detected.`
      },
      businessIncomeEffect: isOwned
        ? {
            businessId: business.id,
            boostFactor: isBull ? 1.35 : 0.85,
            durationSeconds: 45
          }
        : undefined
    };
  }

  // 3. Billionaire & Forbes High Society Drama (15% probability)
  if (randCategory < 0.85 && billionaires.length > 0) {
    const magnate = billionaires[Math.floor(Math.random() * billionaires.length)];
    const isRivalry = netWorth > magnate.netWorth * 0.5;

    const billionaireNews = [
      `FORBES DOSSIER: ${magnate.name} liquidated a $2.4B position in ${magnate.company} to fund aerospace ventures.`,
      `GALA DISPATCH: High society gossips as ${magnate.name} outbids competitors for vintage Mediterranean estates.`,
      `MEGA-MERGER: ${magnate.company} announces intent to acquire overseas infrastructure assets in all-cash buyout.`,
      isRivalry
        ? `RIVAL WATCH: Financial commentators note your conglomerate is closing the wealth gap with ${magnate.name}!`
        : `GLOBAL WEALTH: ${magnate.name} reaches a staggering $${(magnate.netWorth / 1e9).toFixed(1)}B milestone following global equities rally.`
    ];

    const chosenHeadline = billionaireNews[Math.floor(Math.random() * billionaireNews.length)];

    return {
      event: {
        id,
        timestamp: now,
        timeAgo: 'Just now',
        headline: chosenHeadline,
        category: 'Billionaire',
        type: 'neutral',
        affectedTargetName: magnate.name,
        impactDescription: `Forbes wealth rankings updated.`
      }
    };
  }

  // 4. Macro Economy & Central Banking (15% probability)
  const macroEvents = [
    {
      headline: `GLOBAL CENTRAL BANK: Benchmark lending rates cut by 25 basis points; liquidity surges across capital markets!`,
      type: 'bull' as const,
      desc: `Risk appetite rises across equities and commercial real estate.`
    },
    {
      headline: `TREASURY ANNOUNCEMENT: Sovereign bond yields stabilize as inflation metrics cool faster than forecasted.`,
      type: 'bull' as const,
      desc: `Corporate borrowing conditions ease worldwide.`
    },
    {
      headline: `COMMODITY WIRE: Offshore crude oil reserves jump as newly deployed ultra-deepwater drilling rigs go live.`,
      type: 'neutral' as const,
      desc: `Energy transport costs stabilize for international carriers.`
    },
    {
      headline: `REAL ESTATE REPORT: Luxury high-rise penthouses in New York and London see record capital appreciation.`,
      type: 'bull' as const,
      desc: `Prime property valuations trend upwards.`
    },
    {
      headline: `FINANCIAL STABILITY: Commercial private banking syndicates report record reserve capital solvency.`,
      type: 'bull' as const,
      desc: `Credit liquidity flows freely to high-tier enterprises.`
    }
  ];

  const chosenMacro = macroEvents[Math.floor(Math.random() * macroEvents.length)];

  return {
    event: {
      id,
      timestamp: now,
      timeAgo: 'Just now',
      headline: chosenMacro.headline,
      category: 'Economy',
      type: chosenMacro.type,
      impactDescription: chosenMacro.desc
    }
  };
}
