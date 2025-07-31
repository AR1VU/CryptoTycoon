import { StateCreator } from 'zustand';
import { GameState, GameActions } from '../gameStore';

export const createTaxSlice: StateCreator<
  GameState & GameActions,
  [],
  [],
  Pick<GameState, 'tax'> & Pick<GameActions, 'calculateTaxes' | 'payTaxes' | 'evadeTaxes' | 'triggerAudit' | 'lobbyForTaxReduction' | 'buyShellCompany' | 'handleAuditResult'>
> = (set, get) => ({
  tax: {
    miningRate: 0.15, // 15% mining income tax
    capitalGainsRate: 0.20, // 20% capital gains tax
    powerTaxRate: 0.05, // 5% power usage tax
    customCoinTaxRate: 0.10, // 10% custom coin transaction tax
    evasionAttempts: 0,
    auditsTriggered: 0,
    totalPaid: 0,
    unpaidBalance: 0,
    nextDueDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    lastPaymentDate: Date.now(),
    monthlyBreakdown: {
      mining: 0,
      capitalGains: 0,
      power: 0,
      darkWeb: 0,
      customCoin: 0
    },
    isAuditActive: false,
    auditEndTime: 0,
    taxMeter: 0,
    shellCompanies: 0,
    lobbyingLevel: 0
  },
  
  calculateTaxes: () => {
    const state = get();
    const now = Date.now();
    const daysSinceLastPayment = (now - state.tax.lastPaymentDate) / (24 * 60 * 60 * 1000);
    
    // Calculate estimated monthly taxes based on current income
    const estimatedMiningTax = state.bitbux * state.tax.miningRate * (daysSinceLastPayment / 30);
    const estimatedPowerTax = state.powerUsed * 100 * state.tax.powerTaxRate * (daysSinceLastPayment / 30);
    
    return estimatedMiningTax + estimatedPowerTax + state.tax.unpaidBalance;
  },
  
  payTaxes: () => {
    const state = get();
    const taxOwed = get().calculateTaxes();
    
    if (state.dollars >= taxOwed) {
      set((state) => ({
        dollars: state.dollars - taxOwed,
        tax: {
          ...state.tax,
          totalPaid: state.tax.totalPaid + taxOwed,
          unpaidBalance: 0,
          lastPaymentDate: Date.now(),
          nextDueDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
          taxMeter: Math.max(0, state.tax.taxMeter - 10)
        }
      }));
      
      get().addEvent({
        title: 'Taxes Paid',
        description: `Paid $${taxOwed.toFixed(2)} in taxes. Tax meter reduced.`,
        type: 'success'
      });
    }
  },
  
  evadeTaxes: () => {
    const state = get();
    const evasionSuccess = Math.random() > 0.3; // 70% success rate
    
    if (evasionSuccess) {
      set((state) => ({
        tax: {
          ...state.tax,
          evasionAttempts: state.tax.evasionAttempts + 1,
          taxMeter: Math.min(100, state.tax.taxMeter + 25),
          nextDueDate: Date.now() + 30 * 24 * 60 * 60 * 1000
        },
        riskMeter: Math.min(100, state.riskMeter + 15)
      }));
      
      get().addEvent({
        title: 'Tax Evasion Successful',
        description: 'Successfully evaded taxes this month, but risk and tax meter increased.',
        type: 'warning'
      });
    } else {
      get().triggerAudit();
    }
  },
  
  triggerAudit: () => {
    const state = get();
    
    set((state) => ({
      tax: {
        ...state.tax,
        isAuditActive: true,
        auditEndTime: Date.now() + 5 * 60 * 1000, // 5 minutes
        auditsTriggered: state.tax.auditsTriggered + 1
      }
    }));
    
    get().addEvent({
      title: '🚨 BLOCKCHAIN AUDIT INITIATED',
      description: 'DeFi regulators are auditing your on-chain activities! All operations suspended for 5 minutes.',
      type: 'danger'
    });
  },
  
  handleAuditResult: () => {
    const state = get();
    const auditSeverity = Math.min(state.tax.evasionAttempts * 0.2, 0.8);
    const fine = state.dollars * auditSeverity;
    const equipmentLoss = Math.floor(state.miners.length * auditSeverity * 0.3);
    
    set((state) => ({
      dollars: Math.max(0, state.dollars - fine),
      miners: state.miners.slice(equipmentLoss),
      tax: {
        ...state.tax,
        isAuditActive: false,
        auditEndTime: 0,
        unpaidBalance: 0,
        taxMeter: 0,
        evasionAttempts: Math.floor(state.tax.evasionAttempts * 0.5)
      },
      riskMeter: Math.min(100, state.riskMeter + 30)
    }));
    
    get().addEvent({
      title: 'Audit Complete',
      description: `Audit resulted in $${fine.toFixed(2)} fine and loss of ${equipmentLoss} miners.`,
      type: 'danger'
    });
  },
  
  lobbyForTaxReduction: (category) => {
    const state = get();
    const lobbyCost = (state.tax.lobbyingLevel + 1) * 50000;
    
    if (state.dollars >= lobbyCost) {
      set((state) => ({
        dollars: state.dollars - lobbyCost,
        tax: {
          ...state.tax,
          lobbyingLevel: state.tax.lobbyingLevel + 1,
          miningRate: category === 'mining' ? Math.max(0.05, state.tax.miningRate - 0.02) : state.tax.miningRate,
          capitalGainsRate: category === 'capital' ? Math.max(0.10, state.tax.capitalGainsRate - 0.02) : state.tax.capitalGainsRate,
          powerTaxRate: category === 'power' ? Math.max(0.01, state.tax.powerTaxRate - 0.01) : state.tax.powerTaxRate
        },
        riskMeter: Math.min(100, state.riskMeter + 10)
      }));
      
      get().addEvent({
        title: 'Lobbying Successful',
        description: `Reduced ${category} tax rate through lobbying. Risk increased.`,
        type: 'info'
      });
    }
  },
  
  buyShellCompany: () => {
    const state = get();
    const cost = (state.tax.shellCompanies + 1) * 100000;
    
    if (state.dollars >= cost) {
      set((state) => ({
        dollars: state.dollars - cost,
        tax: {
          ...state.tax,
          shellCompanies: state.tax.shellCompanies + 1
        },
        riskMeter: Math.min(100, state.riskMeter + 20)
      }));
      
      get().addEvent({
        title: 'Shell Company Established',
        description: 'Created offshore shell company to hide assets. High risk!',
        type: 'warning'
      });
    }
  }
});