import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameActions } from './gameStore';
import { createMiningSlice } from './slices/miningSlice';
import { createPowerSlice } from './slices/powerSlice';
import { createMarketSlice } from './slices/marketSlice';
import { createDarkWebSlice } from './slices/darkWebSlice';

const initialState: Omit<GameState, keyof (ReturnType<typeof createMiningSlice> & ReturnType<typeof createPowerSlice> & ReturnType<typeof createMarketSlice>)> = {
  bitbux: 100,
  dollars: 1000,
  
  // Custom coin
  coinLaunched: false,
  customCoin: null,
  rugPullExecuted: false,
  
  // Dark web & hacking
  riskMeter: 0,
  reputation: 0,
  hackingMissions: [
    {
      id: 'ddos-exchange',
      name: 'DDoS Exchange',
      description: 'Overload a major exchange to manipulate prices',
      difficulty: 3,
      reward: 5000,
      riskIncrease: 15,
      cooldown: 0,
      isActive: false,
      progress: 0
    },
    {
      id: 'steal-data',
      name: 'Corporate Data Theft',
      description: 'Infiltrate a corporation to steal valuable data',
      difficulty: 5,
      reward: 10000,
      riskIncrease: 25,
      cooldown: 0,
      isActive: false,
      progress: 0
    }
  ],
  currentMission: null,
  hackingToolsLevel: 1,
  blackMarketItems: [],
  ownedBlackMarketItems: [],
  isUnderground: false,
  undergroundEndTime: 0,
  
  // Upgrades
  upgrades: {},
  
  // Events
  events: [],
  
  // Game meta
  prestige: 0,
  prestigePoints: 0,
  gameStartTime: Date.now(),
  lastSaveTime: Date.now()
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      ...createMiningSlice(set, get),
      ...createPowerSlice(set, get),
      ...createMarketSlice(set, get),
      ...createDarkWebSlice(set, get),
      
      // Custom coin actions
      launchCoin: (coinData) => {
        set((state) => ({
          coinLaunched: true,
          customCoin: {
            ...coinData,
            currentPrice: 1,
            volume: 0
          },
          dollars: state.dollars - 10000 // Launch cost in dollars
        }));
      },
      
      marketCoin: () => {
        const state = get();
        if (state.customCoin && state.dollars >= 1000) {
          set((state) => ({
            dollars: state.dollars - 1000,
            customCoin: state.customCoin ? {
              ...state.customCoin,
              marketingLevel: state.customCoin.marketingLevel + 1,
              popularity: Math.min(state.customCoin.popularity + 10, 100)
            } : null
          }));
        }
      },
      
      upgradeCoinTech: () => {
        const state = get();
        if (state.customCoin && state.dollars >= 5000) {
          set((state) => ({
            dollars: state.dollars - 5000,
            customCoin: state.customCoin ? {
              ...state.customCoin,
              techLevel: state.customCoin.techLevel + 1,
              volatility: Math.max(state.customCoin.volatility - 5, 5)
            } : null
          }));
        }
      },
      
      rugPullCoin: () => {
        const state = get();
        if (state.customCoin && !state.rugPullExecuted) {
          const rugPullAmount = state.customCoin.currentPrice * state.customCoin.totalSupply * 0.8;
          
          set((state) => ({
            dollars: state.dollars + rugPullAmount,
            rugPullExecuted: true,
            riskMeter: Math.min(state.riskMeter + 50, 100),
            reputation: Math.max(state.reputation - 100, -100),
            customCoin: null,
            coinLaunched: false
          }));
          
          get().addEvent({
            title: 'Rug Pull Executed!',
            description: `Successfully executed rug pull and gained $${rugPullAmount.toFixed(2)}. Reputation severely damaged.`,
            type: 'danger'
          });
        }
      },
      
      pumpAndDumpCoin: () => {
        const state = get();
        if (state.customCoin && state.dollars >= 50000) {
          const pumpMultiplier = 2 + Math.random() * 3; // 2x to 5x pump
          
          set((state) => ({
            dollars: state.dollars - 50000,
            riskMeter: Math.min(state.riskMeter + 30, 100),
            customCoin: state.customCoin ? {
              ...state.customCoin,
              currentPrice: state.customCoin.currentPrice * pumpMultiplier,
              volatility: Math.min(state.customCoin.volatility + 20, 80)
            } : null
          }));
          
          get().addEvent({
            title: 'Pump & Dump Initiated!',
            description: `Coin price pumped ${pumpMultiplier.toFixed(1)}x! Sell quickly before the dump.`,
            type: 'warning'
          });
        }
      },
      
      convertBitBuxToDollars: (bitbuxAmount) => {
        const state = get();
        if (state.bitbux >= bitbuxAmount) {
          const dollarAmount = bitbuxAmount * state.marketPrice;
          const fee = dollarAmount * 0.01; // 1% conversion fee
          
          set((state) => ({
            bitbux: state.bitbux - bitbuxAmount,
            dollars: state.dollars + dollarAmount - fee
          }));
        }
      },
      
      // Hacking actions
      startMission: (missionId) => {
        const mission = get().hackingMissions.find(m => m.id === missionId);
        if (mission && mission.cooldown === 0 && !get().currentMission) {
          set((state) => ({
            currentMission: missionId,
            hackingMissions: state.hackingMissions.map(m =>
              m.id === missionId ? { ...m, isActive: true, progress: 0 } : m
            )
          }));
        }
      },
      
      progressMission: () => {
        const state = get();
        if (state.currentMission) {
          const mission = state.hackingMissions.find(m => m.id === state.currentMission);
          if (mission) {
            const progressIncrease = (state.hackingToolsLevel * 10) + Math.random() * 20;
            const newProgress = Math.min(mission.progress + progressIncrease, 100);
            
            set((state) => ({
              hackingMissions: state.hackingMissions.map(m =>
                m.id === state.currentMission ? { ...m, progress: newProgress } : m
              )
            }));
            
            if (newProgress >= 100) {
              get().completeCurrentMission();
            }
          }
        }
      },
      
      completeCurrentMission: () => {
        const state = get();
        if (state.currentMission) {
          const mission = state.hackingMissions.find(m => m.id === state.currentMission);
          if (mission) {
            const success = Math.random() > (mission.difficulty / 10);
            
            if (success) {
              set((state) => ({
                dollars: state.dollars + mission.reward,
                reputation: state.reputation + 10,
                riskMeter: Math.min(state.riskMeter + mission.riskIncrease, 100)
              }));
              
              get().addEvent({
                title: 'Mission Success!',
                description: `Successfully completed ${mission.name} and earned $${mission.reward}`,
                type: 'success'
              });
            } else {
              set((state) => ({
                riskMeter: Math.min(state.riskMeter + mission.riskIncrease * 2, 100)
              }));
              
              get().addEvent({
                title: 'Mission Failed!',
                description: `Failed to complete ${mission.name}. Risk increased significantly.`,
                type: 'danger'
              });
            }
            
            set((state) => ({
              currentMission: null,
              hackingMissions: state.hackingMissions.map(m =>
                m.id === state.currentMission ? {
                  ...m,
                  isActive: false,
                  progress: 0,
                  cooldown: 3600000 // 1 hour cooldown
                } : m
              )
            }));
          }
        }
      },
      
      upgradeHackingTools: () => {
        const state = get();
        const cost = state.hackingToolsLevel * 1000;
        if (state.dollars >= cost) {
          set((state) => ({
            dollars: state.dollars - cost,
            hackingToolsLevel: state.hackingToolsLevel + 1
          }));
        }
      },
      
      // General actions
      addEvent: (event) => {
        set((state) => ({
          events: [{
            ...event,
            id: `event-${Date.now()}`,
            timestamp: Date.now()
          }, ...state.events.slice(0, 49)] // Keep last 50 events
        }));
      },
      
      buyUpgrade: (upgradeId) => {
        const state = get();
        const currentLevel = state.upgrades[upgradeId] || 0;
        const cost = (currentLevel + 1) * 100;
        
        if (state.dollars >= cost) {
          set((state) => ({
            dollars: state.dollars - cost,
            upgrades: {
              ...state.upgrades,
              [upgradeId]: currentLevel + 1
            }
          }));
        }
      },
      
      saveGame: () => {
        set({ lastSaveTime: Date.now() });
      },
      
      resetGame: () => {
        set(initialState);
      },
      
      prestigeReset: () => {
        const state = get();
        const newPrestigePoints = Math.floor(state.dollars / 1000000);
        
        set({
          ...initialState,
          prestige: state.prestige + 1,
          prestigePoints: state.prestigePoints + newPrestigePoints
        });
      },
      
      // Automated systems
      processTick: () => {
        const state = get();
        
        // Process mining
        let totalMiningIncome = 0;
        const operationalMiners = state.miners.filter(m => m.status === 'operational');
        
        operationalMiners.forEach(miner => {
          if (state.powerUsed <= state.powerCapacity * state.gridEfficiency) {
            const poolMultiplier = miner.assignedPool === 'High Risk Pool' ? 1.5 : 
                                 miner.assignedPool === 'Green Pool' ? 0.8 : 1;
            totalMiningIncome += miner.speed * miner.efficiency * poolMultiplier;
            
            // Reduce durability
            const durabilityLoss = Math.random() * 0.1;
            if (miner.currentDurability - durabilityLoss <= 0) {
              set((state) => ({
                miners: state.miners.map(m => 
                  m.id === miner.id ? { ...m, status: 'broken' } : m
                )
              }));
            }
          }
        });
        
        // Process power plant upkeep
        let totalUpkeep = 0;
        state.powerPlants.forEach(plant => {
          if (plant.status === 'operational') {
            totalUpkeep += plant.upkeep;
            
            // Random malfunction chance
            if (Math.random() < 0.001) {
              set((state) => ({
                powerPlants: state.powerPlants.map(p => 
                  p.id === plant.id ? { ...p, status: 'malfunction' } : p
                )
              }));
              
              get().addEvent({
                title: 'Power Plant Malfunction!',
                description: `${plant.type} power plant has malfunctioned and needs repair.`,
                type: 'warning'
              });
            }
          }
        });
        
        // Update market price periodically
        if (Math.random() < 0.1) {
          get().updateMarketPrice();
        }
        
        // Process custom coin if launched
        if (state.customCoin) {
          const priceChange = (Math.random() - 0.5) * (state.customCoin.volatility / 100);
          const volumeIncrease = state.customCoin.popularity * Math.random() * 10;
          
          set((state) => ({
            customCoin: state.customCoin ? {
              ...state.customCoin,
              currentPrice: Math.max(0.01, state.customCoin.currentPrice * (1 + priceChange)),
              volume: state.customCoin.volume + volumeIncrease,
              adoptionRate: Math.min(state.customCoin.adoptionRate + state.customCoin.popularity * 0.01, 100)
            } : null
          }));
        }
        
        // Apply income and costs
        set((state) => ({
          bitbux: Math.max(0, state.bitbux + totalMiningIncome - totalUpkeep)
        }));
        
        // Process mission cooldowns
        set((state) => ({
          hackingMissions: state.hackingMissions.map(mission => ({
            ...mission,
            cooldown: Math.max(0, mission.cooldown - 1000)
          }))
        }));
        
        // Reduce risk meter over time
        if (state.riskMeter > 0) {
          set((state) => ({
            riskMeter: Math.max(0, state.riskMeter - 0.1)
          }));
        }
        
        // Process underground status
        if (state.isUnderground && Date.now() > state.undergroundEndTime) {
          set((state) => ({
            isUnderground: false,
            undergroundEndTime: 0
          }));
        }
      }
    }),
    {
      name: 'crypto-tycoon-save',
      version: 1
    }
  )
);