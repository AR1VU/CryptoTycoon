import { StateCreator } from 'zustand';
import { GameState, GameActions, PowerPlant } from '../gameStore';

const POWER_PLANT_CONFIGS = {
  coal: { baseCapacity: 50, baseCost: 100000, baseUpkeep: 1000, environmentalImpact: 5 },
  solar: { baseCapacity: 30, baseCost: 1000000, baseUpkeep: 200, environmentalImpact: -1 },
  nuclear: { baseCapacity: 200, baseCost: 50000000000, baseUpkeep: 50000, environmentalImpact: 1 },
  quantum: { baseCapacity: 500, baseCost: 10000000000000, baseUpkeep: 100000, environmentalImpact: -2 }
};

export const createPowerSlice: StateCreator<
  GameState & GameActions,
  [],
  [],
  Pick<GameState, 'powerUsed' | 'powerCapacity' | 'powerPlants' | 'gridEfficiency' | 'pollution'> & Pick<GameActions, 'buyPowerPlant' | 'upgradePowerPlant' | 'repairPowerPlant' | 'sellExcessPower'>
> = (set, get) => ({
  powerUsed: 0,
  powerCapacity: 1, // Starting with 1MW
  batteryCapacity: 10, // Starting battery capacity in MWh
  batteryStored: 0, // Current stored energy
  powerPlants: [],
  gridEfficiency: 0.8,
  pollution: 0,
  
  buyPowerPlant: (type) => {
    const state = get();
    const config = POWER_PLANT_CONFIGS[type];
    const costDollars = config.baseCost * Math.pow(1.5, state.powerPlants.filter(p => p.type === type).length);
    
    if (state.dollars >= costDollars) {
      const newPlant: PowerPlant = {
        id: `${type}-${Date.now()}`,
        type,
        level: 1,
        capacity: config.baseCapacity,
        cost: costDollars,
        upkeep: config.baseUpkeep,
        environmentalImpact: config.environmentalImpact,
        status: 'operational',
        efficiency: 0.9
      };
      
      set((state) => ({
        dollars: state.dollars - costDollars,
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
    
    const upgradeCostDollars = plant.level * plant.level * 10000; // Quadratic scaling: level² * 10000
    if (state.dollars >= upgradeCostDollars) {
      set((state) => ({
        dollars: state.dollars - upgradeCostDollars,
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
    
    const repairCostDollars = plant.level * 5000; // Much more expensive repairs
    if (state.dollars >= repairCostDollars) {
      set((state) => ({
        dollars: state.dollars - repairCostDollars,
        powerPlants: state.powerPlants.map(p => 
          p.id === id ? {
            ...p,
            status: 'operational',
            efficiency: p.efficiency * 0.95
          } : p
        )
      }));
    }
  },
  
  sellBatteryPower: (amount) => {
    const state = get();
    
    if (state.batteryStored >= amount && amount > 0) {
      const revenue = amount * 25; // $25 per MWh from battery
      
      set((state) => ({
        dollars: state.dollars + revenue,
        batteryStored: state.batteryStored - amount
      }));
      
      // Add event notification
      const addEvent = get().addEvent;
      if (addEvent) {
        addEvent({
          title: 'Battery Power Sold',
          description: `Sold ${amount.toFixed(2)} MWh from battery for $${revenue.toFixed(2)}`,
          type: 'success'
        });
      }
    }
  },
  
  upgradeBattery: () => {
    const state = get();
    const upgradeCost = state.batteryCapacity * 1000; // $1000 per current MWh capacity
    
    if (state.dollars >= upgradeCost) {
      set((state) => ({
        dollars: state.dollars - upgradeCost,
        batteryCapacity: state.batteryCapacity + 10 // Add 10 MWh per upgrade
      }));
      
      const addEvent = get().addEvent;
      if (addEvent) {
        addEvent({
          title: 'Battery Upgraded',
          description: `Battery capacity increased by 10 MWh. New capacity: ${state.batteryCapacity + 10} MWh`,
          type: 'success'
        });
      }
    }
  }
});