import { StateCreator } from 'zustand';
import { GameState, GameActions, Miner } from '../gameStore';

const MINER_CONFIGS = {
  cpu: { baseSpeed: 1, baseCost: 10, baseEfficiency: 0.8 },
  gpu: { baseSpeed: 5, baseCost: 100, baseEfficiency: 0.9 },
  asic: { baseSpeed: 25, baseCost: 1000, baseEfficiency: 0.95 },
  quantum: { baseSpeed: 100, baseCost: 10000, baseEfficiency: 0.99 }
};

export const createMiningSlice: StateCreator<
  GameState & GameActions,
  [],
  [],
  Pick<GameState, 'miners' | 'miningPools' | 'clickPower'> & Pick<GameActions, 'clickMine' | 'buyMiner' | 'upgradeMiner' | 'repairMiner' | 'assignMinerToPool'>
> = (set, get) => ({
  miners: [],
  miningPools: ['Standard Pool', 'High Risk Pool', 'Green Pool'],
  clickPower: 1,
  
  clickMine: () => {
    const state = get();
    // Mining takes 1 minute base time, can be upgraded
    const miningTime = 60000 / state.clickPower; // 60 seconds divided by click power
    
    // For now, we'll give instant mining but you could implement a timer system
    set((state) => ({
      bitbux: state.bitbux + state.clickPower
    }));
  },
  
  buyMiner: (type) => {
    const state = get();
    const config = MINER_CONFIGS[type];
    const costInBitBux = config.baseCost * Math.pow(1.5, state.miners.filter(m => m.type === type).length);
    const costInDollars = costInBitBux * state.marketPrice;
    
    if (state.dollars >= costInDollars) {
      const newMiner: Miner = {
        id: `${type}-${Date.now()}`,
        type,
        level: 1,
        speed: config.baseSpeed,
        efficiency: config.baseEfficiency,
        durability: 100,
        currentDurability: 100,
        status: 'operational',
        assignedPool: 'Standard Pool',
        position: { x: Math.random() * 10, y: Math.random() * 10 },
        skin: 'default'
      };
      
      set((state) => ({
        dollars: state.dollars - costInDollars,
        miners: [...state.miners, newMiner],
        powerUsed: state.powerUsed + config.baseSpeed * 0.1
      }));
    }
  },
  
  upgradeMiner: (id) => {
    const state = get();
    const miner = state.miners.find(m => m.id === id);
    if (!miner) return;
    
    const upgradeCostDollars = miner.level * 50;
    if (state.dollars >= upgradeCostDollars) {
      set((state) => ({
        dollars: state.dollars - upgradeCostDollars,
        miners: state.miners.map(m => 
          m.id === id ? {
            ...m,
            level: m.level + 1,
            speed: m.speed * 1.2,
            efficiency: Math.min(m.efficiency * 1.05, 0.99)
          } : m
        )
      }));
    }
  },
  
  repairMiner: (id) => {
    const state = get();
    const miner = state.miners.find(m => m.id === id);
    if (!miner || miner.status !== 'broken') return;
    
    const repairCostDollars = miner.level * 25;
    if (state.dollars >= repairCostDollars) {
      set((state) => ({
        dollars: state.dollars - repairCostDollars,
        miners: state.miners.map(m => 
          m.id === id ? {
            ...m,
            status: 'operational',
            currentDurability: m.durability * 0.8
          } : m
        )
      }));
    }
  },
  
  assignMinerToPool: (id, pool) => {
    set((state) => ({
      miners: state.miners.map(m => 
        m.id === id ? { ...m, assignedPool: pool } : m
      )
    }));
  }
});