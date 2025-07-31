import React, { useState } from 'react';
import { Calculator, AlertTriangle, Shield, TrendingDown, DollarSign, Eye, Zap } from 'lucide-react';
import { useGameStore } from '../../store';

const TaxOfficePanel: React.FC = () => {
  const {
    dollars,
    tax,
    riskMeter,
    calculateTaxes,
    payTaxes,
    evadeTaxes,
    lobbyForTaxReduction,
    buyShellCompany
  } = useGameStore();

  const [selectedLobbyCategory, setSelectedLobbyCategory] = useState<string>('mining');

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)} Trillion`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)} Billion`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)} Million`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const daysUntilDue = Math.ceil((tax.nextDueDate - Date.now()) / (24 * 60 * 60 * 1000));
  const isOverdue = daysUntilDue < 0;
  const currentTaxOwed = calculateTaxes();

  const getTaxMeterColor = () => {
    if (tax.taxMeter > 70) return 'text-red-400';
    if (tax.taxMeter > 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* DeFi Regulatory Office Header */}
      <div className="bg-gradient-to-br from-purple-900 to-blue-900 border border-purple-500 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Zap className="mr-3 text-purple-400" />
          <h2 className="text-2xl font-bold text-white font-mono">DeFi REGULATORY OFFICE</h2>
          <div className="ml-auto text-xs text-purple-400 animate-pulse font-mono">
            ⛓️ ON-CHAIN COMPLIANCE
          </div>
        </div>
        
        {tax.isAuditActive && (
          <div className="bg-red-900/30 border border-red-400 rounded-lg p-4 mb-4 backdrop-blur-sm">
            <div className="flex items-center">
              <Eye className="text-red-400 mr-3 animate-pulse" />
              <div>
                <div className="text-red-400 font-semibold text-lg font-mono">🔍 BLOCKCHAIN AUDIT ACTIVE</div>
                <div className="text-gray-300 text-sm font-mono">
                  Smart contract analysis in progress. Time remaining: {formatTime(tax.auditEndTime - Date.now())}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black/40 border border-purple-600 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-purple-400 text-sm font-mono">GAS_FEES_OWED</div>
            <div className={`text-2xl font-bold font-mono ${isOverdue ? 'text-red-400' : 'text-yellow-400'}`}>
              {formatCurrency(currentTaxOwed)}
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              {isOverdue ? `${Math.abs(daysUntilDue)} blocks overdue` : `Due in ${daysUntilDue} blocks`}
            </div>
          </div>
          
          <div className="bg-black/40 border border-green-600 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-green-400 text-sm font-mono">TOTAL_FEES_PAID</div>
            <div className="text-2xl font-bold text-green-400 font-mono">
              {formatCurrency(tax.totalPaid)}
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              Lifetime protocol fees
            </div>
          </div>
          
          <div className="bg-black/40 border border-yellow-600 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-yellow-400 text-sm font-mono">COMPLIANCE_SCORE</div>
            <div className={`text-2xl font-bold font-mono ${getTaxMeterColor()}`}>
              {(100 - tax.taxMeter).toFixed(1)}%
            </div>
            <div className="bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full transition-all"
                style={{ width: `${100 - tax.taxMeter}%` }}
              />
            </div>
          </div>
          
          <div className="bg-black/40 border border-blue-600 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-blue-400 text-sm font-mono">AUDITS_SURVIVED</div>
            <div className="text-2xl font-bold text-blue-400 font-mono">
              {tax.auditsTriggered}
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              MEV attempts: {tax.evasionAttempts}
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Fee Rates */}
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 border border-purple-500 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">CURRENT PROTOCOL FEES</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-black/50 border border-yellow-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-yellow-400 text-lg mb-2">⛏️</div>
            <h4 className="font-semibold text-white font-mono">MINING_FEE</h4>
            <div className="text-2xl font-bold text-yellow-400 font-mono">
              {(tax.miningRate * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              Applied to all PoW rewards
            </div>
          </div>
          
          <div className="bg-black/50 border border-green-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-green-400 text-lg mb-2">📈</div>
            <h4 className="font-semibold text-white font-mono">SWAP_FEE</h4>
            <div className="text-2xl font-bold text-green-400 font-mono">
              {(tax.capitalGainsRate * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              Applied to DEX transactions
            </div>
          </div>
          
          <div className="bg-black/50 border border-blue-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-blue-400 text-lg mb-2">⚡</div>
            <h4 className="font-semibold text-white font-mono">GAS_TAX</h4>
            <div className="text-2xl font-bold text-blue-400 font-mono">
              {(tax.powerTaxRate * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              Network congestion fee
            </div>
          </div>
          
          <div className="bg-black/50 border border-purple-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-purple-400 text-lg mb-2">🪙</div>
            <h4 className="font-semibold text-white font-mono">TOKEN_TAX</h4>
            <div className="text-2xl font-bold text-purple-400 font-mono">
              {(tax.customCoinTaxRate * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              Custom token transfer fee
            </div>
          </div>
        </div>
      </div>

      {/* DeFi Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-900 to-blue-900 border border-green-500 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center font-mono">
            <DollarSign className="mr-2" />
            PAY_PROTOCOL_FEES
          </h3>
          
          <div className="space-y-4">
            <div className="bg-black/50 border border-green-600 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3 font-mono">
                <span className="text-green-400">AMOUNT_DUE:</span>
                <span className="text-white font-bold">{formatCurrency(currentTaxOwed)}</span>
              </div>
              <div className="flex justify-between items-center mb-3 font-mono">
                <span className="text-green-400">WALLET_BALANCE:</span>
                <span className="text-green-400">{formatCurrency(dollars)}</span>
              </div>
              <div className="flex justify-between items-center font-mono">
                <span className="text-green-400">AFTER_TX:</span>
                <span className={dollars >= currentTaxOwed ? 'text-green-400' : 'text-red-400'}>
                  {formatCurrency(Math.max(0, dollars - currentTaxOwed))}
                </span>
              </div>
            </div>
            
            <button
              onClick={payTaxes}
              disabled={dollars < currentTaxOwed || tax.isAuditActive}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-4 rounded-lg font-medium font-mono transition-all disabled:cursor-not-allowed transform hover:scale-105"
            >
              {tax.isAuditActive ? 'AUDIT_IN_PROGRESS' : 
               dollars < currentTaxOwed ? 'INSUFFICIENT_BALANCE' : 'EXECUTE_PAYMENT'}
            </button>
            
            <button
              onClick={evadeTaxes}
              disabled={tax.isAuditActive}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-2 px-4 rounded-lg font-medium font-mono transition-all disabled:cursor-not-allowed transform hover:scale-105"
            >
              {tax.isAuditActive ? 'AUDIT_BLOCKING_MEV' : 'ATTEMPT_MEV_SANDWICH (70% Success)'}
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-red-900 border border-purple-500 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center font-mono">
            <Shield className="mr-2" />
            PROTOCOL_GOVERNANCE
          </h3>
          
          <div className="space-y-4">
            <div className="bg-black/50 border border-purple-600 rounded-lg p-4 backdrop-blur-sm">
              <h4 className="font-semibold text-white mb-2 font-mono">GOVERNANCE_VOTING</h4>
              <p className="text-sm text-purple-400 mb-3 font-mono">
                {'>'} Vote on protocol proposals to reduce fees. Costs governance tokens but increases MEV risk.
              </p>
              <div className="flex space-x-2 mb-3">
                <select
                  value={selectedLobbyCategory}
                  onChange={(e) => setSelectedLobbyCategory(e.target.value)}
                  className="flex-1 bg-gray-800 border border-purple-500 text-white rounded px-2 py-1 text-sm font-mono"
                >
                  <option value="mining">Mining Fee Reduction</option>
                  <option value="capital">Swap Fee Reduction</option>
                  <option value="power">Gas Tax Reduction</option>
                </select>
              </div>
              <button
                onClick={() => lobbyForTaxReduction(selectedLobbyCategory)}
                disabled={dollars < (tax.lobbyingLevel + 1) * 50000 || tax.isAuditActive}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-2 px-4 rounded-lg text-sm font-mono transition-all disabled:cursor-not-allowed transform hover:scale-105"
              >
                VOTE - {formatCurrency((tax.lobbyingLevel + 1) * 50000)} GOV
              </button>
            </div>
            
            <div className="bg-black/50 border border-red-600 rounded-lg p-4 backdrop-blur-sm">
              <h4 className="font-semibold text-white mb-2 font-mono">PRIVACY_PROTOCOLS</h4>
              <p className="text-sm text-red-400 mb-3 font-mono">
                {'>'} Deploy privacy smart contracts to obfuscate transactions. Very high MEV risk.
              </p>
              <div className="text-sm mb-3 font-mono">
                <span className="text-red-400">DEPLOYED: </span>
                <span className="text-white">{tax.shellCompanies}</span>
              </div>
              <button
                onClick={buyShellCompany}
                disabled={dollars < (tax.shellCompanies + 1) * 100000 || tax.isAuditActive}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-2 px-4 rounded-lg text-sm font-mono transition-all disabled:cursor-not-allowed transform hover:scale-105"
              >
                DEPLOY_PRIVACY_CONTRACT - {formatCurrency((tax.shellCompanies + 1) * 100000)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Analytics */}
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 border border-blue-500 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">PROTOCOL_ANALYTICS</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-black/50 border border-yellow-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-yellow-400 text-sm font-mono">MINING_FEES</div>
            <div className="text-xl font-bold text-white font-mono">
              {formatCurrency(tax.monthlyBreakdown.mining)}
            </div>
          </div>
          
          <div className="bg-black/50 border border-green-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-green-400 text-sm font-mono">SWAP_FEES</div>
            <div className="text-xl font-bold text-white font-mono">
              {formatCurrency(tax.monthlyBreakdown.capitalGains)}
            </div>
          </div>
          
          <div className="bg-black/50 border border-blue-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-blue-400 text-sm font-mono">GAS_FEES</div>
            <div className="text-xl font-bold text-white font-mono">
              {formatCurrency(tax.monthlyBreakdown.power)}
            </div>
          </div>
          
          <div className="bg-black/50 border border-red-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-red-400 text-sm font-mono">MEV_PENALTIES</div>
            <div className="text-xl font-bold text-white font-mono">
              {formatCurrency(tax.monthlyBreakdown.darkWeb)}
            </div>
          </div>
          
          <div className="bg-black/50 border border-purple-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-purple-400 text-sm font-mono">TOKEN_FEES</div>
            <div className="text-xl font-bold text-white font-mono">
              {formatCurrency(tax.monthlyBreakdown.customCoin)}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Warnings */}
      {tax.taxMeter > 50 && (
        <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-500 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-400 mr-3 animate-pulse" />
            <div>
              <div className="text-yellow-400 font-semibold font-mono">⚠️ COMPLIANCE_ALERT</div>
              <div className="text-gray-300 text-sm mt-1 font-mono">
                {'>'} Suspicious on-chain activity detected. High compliance risk increases audit probability.
              </div>
            </div>
          </div>
        </div>
      )}

      {isOverdue && (
        <div className="bg-gradient-to-r from-red-900/50 to-pink-900/50 border border-red-500 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center">
            <AlertTriangle className="text-red-400 mr-3 animate-bounce" />
            <div>
              <div className="text-red-400 font-semibold font-mono">🚨 OVERDUE_PROTOCOL_FEES</div>
              <div className="text-gray-300 text-sm mt-1 font-mono">
                {'>'} Protocol fees are {Math.abs(daysUntilDue)} blocks overdue! Slashing penalties accumulating.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Web3 Terminal Effect */}
      <div className="bg-black border border-green-500 rounded-lg p-4">
        <div className="font-mono text-sm space-y-1">
          <div className="text-green-400">{'>'} Connecting to DeFi protocol...</div>
          <div className="text-green-400">{'>'} Smart contract interface loaded</div>
          <div className="text-yellow-400">{'>'} Warning: All transactions are recorded on-chain</div>
          <div className="text-blue-400">{'>'} Compliance score: {(100 - tax.taxMeter).toFixed(1)}%</div>
          <div className="text-purple-400">{'>'} Protocol fees: {formatCurrency(currentTaxOwed)} pending</div>
          <div className="text-green-400">{'>'} Ready for DeFi operations</div>
        </div>
      </div>
    </div>
  );
};

export default TaxOfficePanel;