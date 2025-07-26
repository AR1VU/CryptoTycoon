import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Miner {
  id: string;
  type: 'cpu' | 'gpu' | 'asic' | 'quantum';
  level: number;
  speed: number;
  efficiency: number;
  durability: number;
  currentDurability: number;
  status: 'operational' | 'overheating' | 'broken';
  assignedPool: string;
  position: { x: number; y: number };
  skin: string;
}

export interface PowerPlant {
  id: string;
  type: 'coal' | 'solar' | 'nuclear' | 'quantum';
  level: number;
  capacity: number;
  cost: number;
  upkeep: number;
  environmentalImpact: number;
  status: 'operational' | 'malfunction';
  efficiency: number;
}

export interface CustomCoin {
  name: string;
  symbol: string;
  totalSupply: number;
  currentPrice: number;
  volatility: number;
  popularity: number;
  adoptionRate: number;
  marketingLevel: number;
  techLevel: number;
  volume: number;
}

export interface HackingMission {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  reward: number;
  riskIncrease: number;
  cooldown: number;
  isActive: boolean;
  progress: number;
}

export interface GameState {
  // Basic resources
  coins: number;
  marketPrice: number;
  usdBalance: number;
  
  // Mining
  miners: Miner[];
  miningPools: string[];
  clickPower: number;
  
  // Power
  powerUsed: number;
  powerCapacity: number;
  powerPlants: PowerPlant[];
  gridEfficiency: number;
  pollution: number;
  
  // Market
  marketHistory: number[];
  portfolioValue: number;
  transactionHistory: Array<{
    type: 'buy' | 'sell';
    amount: number;
    price: number;
    timestamp: number;
  }>;
  
  // Custom coin
  coinLaunched: boolean;
  customCoin: CustomCoin | null;
  
  // Dark web & hacking
  riskMeter: number;
  reputation: number;
  hackingMissions: HackingMission[];
  currentMission: string | null;
  hackingToolsLevel: number;
  
  // Upgrades
  upgrades: Record<string, number>;
  
  // Events
  events: Array<{
    id: string;
    title: string;
    description: string;
    type: 'info' | 'warning' | 'danger' | 'success';
    timestamp: number;
  }>;
  
  // Game meta
  prestige: number;
  prestigePoints: number;
  gameStartTime: number;
  lastSaveTime: number;
}

interface GameActions {
  // Mining actions
  clickMine: () => void;
  buyMiner: (type: Miner['type']) => void;
  upgradeMiner: (id: string) => void;
  repairMiner: (id: string) => void;
  assignMinerToPool: (id: string, pool: string) => void;
  
  // Power actions
  buyPowerPlant: (type: PowerPlant['type']) => void;
  upgradePowerPlant: (id: string) => void;
  repairPowerPlant: (id: string) => void;
  
  // Market actions
  buyBitBux: (amount: number) => void;
  sellBitBux: (amount: number) => void;
  updateMarketPrice: () => void;
  
  // Custom coin actions
  launchCoin: (coinData: Omit<CustomCoin, 'currentPrice' | 'volume'>) => void;
  marketCoin: () => void;
  upgradeCoinTech: () => void;
  
  // Hacking actions
  startMission: (missionId: string) => void;
  progressMission: () => void;
  completeCurrentMission: () => void;
  upgradeHackingTools: () => void;
  
  // General actions
  addEvent: (event: Omit<GameState['events'][0], 'id' | 'timestamp'>) => void;
  buyUpgrade: (upgradeId: string) => void;
  saveGame: () => void;
  resetGame: () => void;
  prestigeReset: () => void;
  
  // Automated systems
  processTick: () => void;
}