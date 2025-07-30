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
  bitbux: number;
  dollars: number;
  marketPrice: number;
  lastClickMine?: number;
  
  // Mining
  miners: Miner[];
  miningPools: string[];
  clickPower: number;
  
  // Power
  powerUsed: number;
  powerCapacity: number;
  batteryCapacity: number;
  batteryStored: number;
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
  rugPullExecuted: boolean;
  
  // Dark web & hacking
  riskMeter: number;
  reputation: number;
  hackingMissions: HackingMission[];
  currentMission: string | null;
  hackingToolsLevel: number;
  blackMarketItems: BlackMarketItem[];
  ownedBlackMarketItems: string[];
  blackMarketItemExpiry: Record<string, number>; // itemId -> expiry timestamp
  
  // Dark web specific
  isUnderground: boolean;
  undergroundEndTime: number;
  
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

export interface BlackMarketItem {
  id: string;
  name: string;
  description: string;
  price: number;
  riskIncrease: number;
  effect: string;
  requiredReputation: number;
  category: 'mining' | 'power' | 'market' | 'coin';
  permanent: boolean;
  duration: number; // Duration in milliseconds, 0 for permanent
}

interface GameActions {
  // Mining actions
  clickMine: () => void;
  buyMiner: (type: Miner['type']) => void;
  upgradeMiner: (id: string) => void;
  repairMiner: (id: string) => void;
  assignMinerToPool: (id: string, pool: string) => void;
  upgradeClickPower: () => void;
  
  // Power actions
  buyPowerPlant: (type: PowerPlant['type']) => void;
  upgradePowerPlant: (id: string) => void;
  repairPowerPlant: (id: string) => void;
  sellBatteryPower: (amount: number) => void;
  upgradeBattery: () => void;
  
  // Market actions
  buyBitBux: (dollarAmount: number) => void;
  sellBitBux: (bitbuxAmount: number) => void;
  updateMarketPrice: () => void;
  convertBitBuxToDollars: (bitbuxAmount: number) => void;
  
  // Custom coin actions
  launchCoin: (coinData: Omit<CustomCoin, 'currentPrice' | 'volume'>) => void;
  marketCoin: () => void;
  upgradeCoinTech: () => void;
  rugPullCoin: () => void;
  pumpAndDumpCoin: () => void;
  
  // Hacking actions
  startMission: (missionId: string) => void;
  progressMission: () => void;
  completeCurrentMission: () => void;
  upgradeHackingTools: () => void;
  
  // Reputation actions
  donateToUnderground: () => void;
  exitUnderground: () => void;
  
  // Dark web actions
  buyBlackMarketItem: (itemId: string) => void;
  payBribe: () => void;
  goUnderground: () => void;
  
  // General actions
  addEvent: (event: Omit<GameState['events'][0], 'id' | 'timestamp'>) => void;
  buyUpgrade: (upgradeId: string) => void;
  saveGame: () => void;
  resetGame: () => void;
  prestigeReset: () => void;
  
  // Automated systems
  processTick: () => void;
}