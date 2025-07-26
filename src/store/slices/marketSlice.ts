import { StateCreator } from 'zustand';
import { GameState, GameActions } from '../gameStore';

export const createMarketSlice: StateCreator<
  GameState & GameActions,
  [],
  [],
  Pick<GameState, 'marketPrice' | 'usdBalance' | 'marketHistory' | 'portfolioValue' | 'transactionHistory'> & Pick<GameActions, 'buyBitBux' | 'sellBitBux' | 'updateMarketPrice'>
> = (set, get) => ({
  marketPrice: 50000,
  usdBalance: 1000,
  marketHistory: [50000],
  portfolioValue: 0,
  transactionHistory: [],
  
  buyBitBux: (usdAmount) => {
    const state = get();
    if (state.usdBalance >= usdAmount) {
      const bitbuxAmount = usdAmount / state.marketPrice;
      const fee = usdAmount * 0.01; // 1% transaction fee
      
      set((state) => ({
        usdBalance: state.usdBalance - usdAmount - fee,
        coins: state.coins + bitbuxAmount,
        transactionHistory: [...state.transactionHistory, {
          type: 'buy',
          amount: bitbuxAmount,
          price: state.marketPrice,
          timestamp: Date.now()
        }]
      }));
    }
  },
  
  sellBitBux: (bitbuxAmount) => {
    const state = get();
    if (state.coins >= bitbuxAmount) {
      const usdAmount = bitbuxAmount * state.marketPrice;
      const fee = usdAmount * 0.01; // 1% transaction fee
      
      set((state) => ({
        coins: state.coins - bitbuxAmount,
        usdBalance: state.usdBalance + usdAmount - fee,
        transactionHistory: [...state.transactionHistory, {
          type: 'sell',
          amount: bitbuxAmount,
          price: state.marketPrice,
          timestamp: Date.now()
        }]
      }));
    }
  },
  
  updateMarketPrice: () => {
    set((state) => {
      const volatility = 0.05 + (state.pollution / 1000); // Pollution affects volatility
      const change = (Math.random() - 0.5) * volatility;
      const newPrice = Math.max(1000, state.marketPrice * (1 + change));
      
      return {
        marketPrice: newPrice,
        marketHistory: [...state.marketHistory.slice(-99), newPrice],
        portfolioValue: state.coins * newPrice + state.usdBalance
      };
    });
  }
});