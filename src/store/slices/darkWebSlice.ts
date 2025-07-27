import { StateCreator } from 'zustand';
import { GameState, GameActions, BlackMarketItem } from '../gameStore';

const BLACK_MARKET_ITEMS: BlackMarketItem[] = [
  {
    id: 'stealth-rig',
    name: 'Stealth Mining Rig',
    description: 'Untraceable mining hardware that bypasses power grid detection',
    price: 5000,
    riskIncrease: 10,
    effect: '+50% mining speed, -25% power consumption',
    requiredReputation: 0,
    category: 'mining',
    permanent: true
  },
  {
    id: 'power-theft',
    name: 'Power Grid Hack',
    description: 'Illegally tap into the power grid for free electricity',
    price: 10000,
    riskIncrease: 25,
    effect: 'Free power for 24 hours',
    requiredReputation: 50,
    category: 'power',
    permanent: false
  },
  {
    id: 'insider-info',
    name: 'Exchange Insider Info',
    description: 'Get advance notice of market-moving news',
    price: 25000,
    riskIncrease: 15,
    effect: 'Predict next 3 market movements',
    requiredReputation: 100,
    category: 'market',
    permanent: false
  },
  {
    id: 'fake-audit',
    name: 'Fake Security Audit',
    description: 'Fraudulent security certificate for your custom coin',
    price: 15000,
    riskIncrease: 20,
    effect: '+30% coin adoption rate',
    requiredReputation: 75,
    category: 'coin',
    permanent: false
  },
  {
    id: 'ddos-service',
    name: 'DDoS-for-Hire',
    description: 'Take down competitor exchanges temporarily',
    price: 50000,
    riskIncrease: 40,
    effect: 'Boost your coin price by 200% for 1 hour',
    requiredReputation: 150,
    category: 'market',
    permanent: false
  },
  {
    id: 'quantum-miner',
    name: 'Stolen Quantum Miner',
    description: 'Military-grade quantum mining hardware',
    price: 100000,
    riskIncrease: 35,
    effect: '10x mining speed, undetectable by authorities',
    requiredReputation: 200,
    category: 'mining',
    permanent: true
  }
];

export const createDarkWebSlice: StateCreator<
  GameState & GameActions,
  [],
  [],
  Pick<GameState, 'blackMarketItems' | 'ownedBlackMarketItems' | 'isUnderground' | 'undergroundEndTime'> & 
  Pick<GameActions, 'buyBlackMarketItem' | 'payBribe' | 'goUnderground'>
> = (set, get) => ({
  blackMarketItems: BLACK_MARKET_ITEMS,
  ownedBlackMarketItems: [],
  isUnderground: false,
  undergroundEndTime: 0,
  
  buyBlackMarketItem: (itemId) => {
    const state = get();
    const item = state.blackMarketItems.find(i => i.id === itemId);
    
    if (!item || state.ownedBlackMarketItems.includes(itemId)) return;
    if (state.dollars < item.price || state.reputation < item.requiredReputation) return;
    
    set((state) => ({
      dollars: state.dollars - item.price,
      riskMeter: Math.min(state.riskMeter + item.riskIncrease, 100),
      ownedBlackMarketItems: [...state.ownedBlackMarketItems, itemId]
    }));
    
    get().addEvent({
      title: 'Black Market Purchase',
      description: `Acquired ${item.name}. ${item.effect}`,
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