import { StateCreator } from 'zustand';
import { GameState, GameActions, PowerPlant } from '../gameStore';

const POWER_PLANT_CONFIGS = {
  coal: { baseCapacity: 50, baseCost: 200, baseUpkeep: 10, environmentalImpact: 5 },
  solar: { baseCapacity: 30, baseCost: 500, baseUpkeep: 2, environmentalImpact: -1 },
  nuclear: { baseCapacity: 200, baseCost: 5000, baseUpkeep: 50, environmentalImpact: 1 },
  quantum: { baseCapacity: 500, baseCost: 50000, baseUpkeep: 100, environmentalImpact: -2 }
};

export const createPowerSlice: StateCreator<
  GameState & GameActions,
  [],
  [],
  Pick<GameState, 'powerUsed' | 'powerCapacity' | 'powerPlants' | 'gridEfficiency' | 'pollution'> & Pick<GameActions, 'buyPowerPlant' | 'upgradePowerPlant' | 'repairPowerPlant'>
> = (set, get) => ({
  powerUsed: 0,
  powerCapacity: 100,
  powerPlants: [],
  gridEfficiency: 0.8,
  pollution: 0,
  
  buyPowerPlant: (type) => {
    const state = get();
    const config = POWER_PLANT_CONFIGS[type];
    const cost = config.baseCost * Math.pow(1.3, state.powerPlants.filter(p => p.type === type).length);
    
    if (state.coins >= cost) {
      const newPlant: PowerPlant = {
        id: `${type}-${Date.now()}`,
        type,
        level: 1,
        capacity: config.baseCapacity,
        cost,
        upkeep: config.baseUpkeep,
        environmentalImpact: config.environmentalImpact,
        status: 'operational',
        efficiency: 0.9
      };
      
      set((state) => ({
        coins: state.coins - cost,
        powerPlants: [...state.powerPlants, newPlant],
        powerCapacity: state.powerCapacity + config.baseCapacity,
        pollution: Math.max(0, state.pollution + config.environmentalImpact)
      }));
    }
  },
  
  upgradePowerPlant: (id) => {
    const state = get();
    const plant = state.powerPlants.find(p => p.id === id);
    if (!plant) return;
    
    const upgradeCost = plant.level * 100;
    if (state.coins >= upgradeCost) {
      set((state) => ({
        coins: state.coins - upgradeCost,
        powerPlants: state.powerPlants.map(p => 
          p.id === id ? {
            ...p,
            level: p.level + 1,
            capacity: p.capacity * 1.3,
            efficiency: Math.min(p.efficiency * 1.02, 0.99)
          } : p
        ),
        powerCapacity: state.powerCapacity + plant.capacity * 0.3
      }));
    }
  },
  
  repairPowerPlant: (id) => {
    const state = get();
    const plant = state.powerPlants.find(p => p.id === id);
    if (!plant || plant.status !== 'malfunction') return;
    
    const repairCost = plant.level * 75;
    if (state.coins >= repairCost) {
      set((state) => ({
        coins: state.coins - repairCost,
        powerPlants: state.powerPlants.map(p => 
          p.id === id ? {
            ...p,
            status: 'operational',
            efficiency: p.efficiency * 0.95
          } : p
        )
      }));
    }
  }
});