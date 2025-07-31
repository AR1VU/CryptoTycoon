import { StateCreator } from 'zustand';
import { GameState, GameActions } from '../gameStore';

export const createMarketSlice: StateCreator<
  GameState & GameActions,
  [],
  [],
  Pick<GameState, 'marketPrice' | 'marketHistory' | 'portfolioValue' | 'transactionHistory'> & Pick<GameActions, 'buyBitBux' | 'sellBitBux' | 'updateMarketPrice'>
> = (set, get) => ({
  marketPrice: 1000,
  marketHistory: [1000],
  portfolioValue: 0,
  transactionHistory: [],
  
  buyBitBux: (dollarAmount) => {
    const state = get();
    if (state.dollars >= dollarAmount) {
      const bitbuxAmount = dollarAmount / state.marketPrice;
      const fee = dollarAmount * 0.01; // 1% transaction fee
      
      set((state) => ({
        dollars: state.dollars - dollarAmount - fee,
        bitbux: state.bitbux + bitbuxAmount,
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
    if (state.bitbux >= bitbuxAmount) {
      const dollarAmount = bitbuxAmount * state.marketPrice;
      const transactionFee = dollarAmount * 0.01; // 1% transaction fee
      const capitalGainsTax = dollarAmount * state.tax.capitalGainsRate; // Capital gains tax
      const totalDeductions = transactionFee + capitalGainsTax;
      
      set((state) => ({
        bitbux: state.bitbux - bitbuxAmount,
        dollars: state.dollars + dollarAmount - totalDeductions,
        tax: {
          ...state.tax,
          monthlyBreakdown: {
            ...state.tax.monthlyBreakdown,
            capitalGains: state.tax.monthlyBreakdown.capitalGains + capitalGainsTax
          },
          unpaidBalance: state.tax.unpaidBalance + capitalGainsTax
        },
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
        portfolioValue: state.bitbux * newPrice + state.dollars
      };
    });
  }
});