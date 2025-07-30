import { StateCreator } from 'zustand';
import { GameState, GameActions, Miner } from '../gameStore';

const MINER_CONFIGS = {
  cpu: { baseSpeed: 1, baseCost: 50, baseEfficiency: 0.8 },
  gpu: { baseSpeed: 5, baseCost: 500, baseEfficiency: 0.9 },
  asic: { baseSpeed: 25, baseCost: 5000, baseEfficiency: 0.95 },
  quantum: { baseSpeed: 100, baseCost: 50000, baseEfficiency: 0.99 }
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
    // Check if enough time has passed since last click mine (1 minute base, reduced by click power)
    const now = Date.now();
    const miningCooldown = 60000 / state.clickPower; // 60 seconds divided by click power
    
    if (!state.lastClickMine || now - state.lastClickMine >= miningCooldown) {
      set((state) => ({
        bitbux: state.bitbux + state.clickPower,
        lastClickMine: now
      }));
    }
  },
  
  upgradeClickPower: () => {
    const state = get();
    const cost = state.clickPower * 1000; // Each level costs 1000 * current level
    if (state.dollars >= cost) {
      set((state) => ({
        dollars: state.dollars - cost,
        clickPower: state.clickPower + 1
      }));
    }
  },
  
  buyMiner: (type) => {
    const state = get();
    const config = MINER_CONFIGS[type];
    const costInBitBux = config.baseCost * Math.pow(2, state.miners.filter(m => m.type === type).length); // Exponential scaling
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
        powerUsed: state.powerUsed + (config.baseSpeed * 0.5) // More realistic power consumption
      }));
    }
  },
  
  upgradeMiner: (id) => {
    const state = get();
    const miner = state.miners.find(m => m.id === id);
    if (!miner) return;
    
    const upgradeCostDollars = miner.level * miner.level * 500; // Quadratic scaling: level² * 500
    if (state.dollars >= upgradeCostDollars) {
      const oldPowerConsumption = miner.speed * 0.5;
      const newSpeed = miner.speed * 1.2;
      const newPowerConsumption = newSpeed * 0.5;
      const powerIncrease = newPowerConsumption - oldPowerConsumption;
      
      set((state) => ({
        dollars: state.dollars - upgradeCostDollars,
        powerUsed: state.powerUsed + powerIncrease,
        miners: state.miners.map(m => 
          m.id === id ? {
            ...m,
            level: m.level + 1,
            speed: newSpeed,
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
    
    const repairCostDollars = miner.level * 250; // More expensive repairs
    if (state.dollars >= repairCostDollars) {
      set((state) => ({
        dollars: state.dollars - repairCostDollars,
        miners: state.miners.map(m => 
          m.id === id ? {
            ...m,
            status: 'operational',
            currentDurability: m.durability * 0.8,
            efficiency: m.efficiency * 0.95 // Slight efficiency loss after repair
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