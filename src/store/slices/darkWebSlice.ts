import { StateCreator } from 'zustand';
import { GameState, GameActions, BlackMarketItem } from '../gameStore';

const BLACK_MARKET_ITEMS: BlackMarketItem[] = [
  {
    id: 'stealth-rig',
    name: 'Stealth Mining Rig',
    description: 'Untraceable mining hardware that bypasses power grid detection',
    price: 50000,
    riskIncrease: 10,
    effect: '+50% mining speed, -25% power consumption',
    requiredReputation: 0,
    category: 'mining',
    permanent: true,
    duration: 0 // Permanent items have 0 duration
  },
  {
    id: 'power-theft',
    name: 'Power Grid Hack',
    description: 'Illegally tap into the power grid for free electricity',
    price: 100000,
    riskIncrease: 25,
    effect: 'Free power for 24 hours',
    requiredReputation: 50,
    category: 'power',
    permanent: false,
    duration: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  },
  {
    id: 'insider-info',
    name: 'Exchange Insider Info',
    description: 'Get advance notice of market-moving news',
    price: 250000,
    riskIncrease: 15,
    effect: 'Predict next 3 market movements',
    requiredReputation: 100,
    category: 'market',
    permanent: false,
    duration: 12 * 60 * 60 * 1000 // 12 hours in milliseconds
  },
  {
    id: 'fake-audit',
    name: 'Fake Security Audit',
    description: 'Fraudulent security certificate for your custom coin',
    price: 150000,
    riskIncrease: 20,
    effect: '+30% coin adoption rate',
    requiredReputation: 75,
    category: 'coin',
    permanent: false,
    duration: 48 * 60 * 60 * 1000 // 48 hours in milliseconds
  },
  {
    id: 'ddos-service',
    name: 'DDoS-for-Hire',
    description: 'Take down competitor exchanges temporarily',
    price: 500000,
    riskIncrease: 40,
    effect: 'Boost your coin price by 200% for 1 hour',
    requiredReputation: 150,
    category: 'market',
    permanent: false,
    duration: 1 * 60 * 60 * 1000 // 1 hour in milliseconds
  },
  {
    id: 'quantum-miner',
    name: 'Stolen Quantum Miner',
    description: 'Military-grade quantum mining hardware',
    price: 10000000,
    riskIncrease: 35,
    effect: '10x mining speed, undetectable by authorities',
    requiredReputation: 200,
    category: 'mining',
    permanent: true,
    duration: 0 // Permanent items have 0 duration
  }
];

export const createDarkWebSlice: StateCreator<
  GameState & GameActions,
  [],
  [],
  Pick<GameState, 'blackMarketItems' | 'ownedBlackMarketItems' | 'blackMarketItemExpiry' | 'isUnderground' | 'undergroundEndTime'> & 
  Pick<GameActions, 'buyBlackMarketItem' | 'payBribe' | 'goUnderground'>
> = (set, get) => ({
  blackMarketItems: BLACK_MARKET_ITEMS,
  ownedBlackMarketItems: [],
  blackMarketItemExpiry: {},
  isUnderground: false,
  undergroundEndTime: 0,
  
  buyBlackMarketItem: (itemId) => {
    const state = get();
    const item = state.blackMarketItems.find(i => i.id === itemId);
    
    if (!item || state.ownedBlackMarketItems.includes(itemId)) return;
    if (state.dollars < item.price || state.reputation < item.requiredReputation) return;
    
    // Check if item has expired and can be repurchased
    const currentExpiry = state.blackMarketItemExpiry[itemId];
    const isExpired = currentExpiry && currentExpiry > 0 && Date.now() > currentExpiry;
    
    if (state.ownedBlackMarketItems.includes(itemId) && !isExpired) return;
    
    const expiryTime = item.permanent ? 0 : Date.now() + item.duration;
    
    set((state) => ({
      dollars: state.dollars - item.price,
      riskMeter: Math.min(state.riskMeter + item.riskIncrease, 100),
      tax: {
        ...state.tax,
        monthlyBreakdown: {
          ...state.tax.monthlyBreakdown,
          darkWeb: state.tax.monthlyBreakdown.darkWeb + (item.price * 0.15) // 15% "tax" on dark web purchases
        },
        unpaidBalance: state.tax.unpaidBalance + (item.price * 0.15),
        taxMeter: Math.min(100, state.tax.taxMeter + 5)
      },
      ownedBlackMarketItems: state.ownedBlackMarketItems.includes(itemId) 
        ? state.ownedBlackMarketItems 
        : [...state.ownedBlackMarketItems, itemId],
      blackMarketItemExpiry: {
        ...state.blackMarketItemExpiry,
        [itemId]: expiryTime
      }
    }));
    
    get().addEvent({
      title: 'Black Market Purchase',
      description: `${isExpired ? 'Repurchased' : 'Acquired'} ${item.name}. ${item.effect}${item.permanent ? '' : ` (Expires in ${Math.floor(item.duration / 3600000)}h)`}`,
      type: 'warning'
    });
  },
  
  payBribe: () => {
    const state = get();
    const bribeCost = state.riskMeter * 1000;
    
    if (state.dollars >= bribeCost && state.riskMeter >= 10) {
      set((state) => ({
        dollars: state.dollars - bribeCost,
        riskMeter: Math.max(state.riskMeter - 30, 0)
      }));
      
      get().addEvent({
        title: 'Bribe Paid',
        description: `Paid $${bribeCost} to reduce heat. Risk meter decreased.`,
        type: 'info'
      });
    }
  },
  
  goUnderground: () => {
    const state = get();
    
    if (state.riskMeter >= 50 && !state.isUnderground) {
      set((state) => ({
        isUnderground: true,
        undergroundEndTime: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      }));
      
      get().addEvent({
        title: 'Gone Underground',
        description: 'Hiding from authorities for 24 hours. All income reduced by 75%.',
        type: 'warning'
      });
    }
  }
});