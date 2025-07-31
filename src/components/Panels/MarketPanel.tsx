import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpDown } from 'lucide-react';
import { useGameStore } from '../../store';
import { formatNumber, formatCurrency } from '../../utils/formatters';

const MarketPanel: React.FC = () => {
  const {
    bitbux,
    dollars,
    marketPrice,
    marketHistory,
    portfolioValue,
    transactionHistory,
    buyBitBux,
    sellBitBux
  } = useGameStore();

  const [tradeAmount, setTradeAmount] = useState<string>('100');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  const handleTrade = () => {
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (tradeType === 'buy') {
      buyBitBux(amount);
    } else {
      sellBitBux(amount);
    }
    
    setTradeAmount('100');
  };

  const getMaxTradeAmount = () => {
    if (tradeType === 'buy') {
      return Math.floor(dollars * 0.99); // Account for fees
    } else {
      return bitbux;
    }
  };

  const priceChange = marketHistory.length > 1 ? 
    ((marketPrice - marketHistory[marketHistory.length - 2]) / marketHistory[marketHistory.length - 2]) * 100 : 0;

  const recentTransactions = transactionHistory.slice(-10).reverse();

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="mr-3 text-green-400" />
          <h2 className="text-2xl font-bold text-white">BitBux Exchange</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Current Price</div>
            <div className="text-3xl font-bold text-white">
              {formatCurrency(marketPrice)}
            </div>
            <div className={`text-sm flex items-center mt-1 ${
              priceChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {priceChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span className="ml-1">{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">BitBux Balance</div>
            <div className="text-2xl font-bold text-yellow-400">
              {formatNumber(bitbux)} BB
            </div>
            <div className="text-sm text-gray-400">
              ≈ {formatCurrency(bitbux * marketPrice)}
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">USD Balance</div>
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(dollars)}
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Portfolio Value</div>
            <div className="text-2xl font-bold text-purple-400">
              {formatCurrency(portfolioValue)}
            </div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Price History</h3>
        <div className="bg-gray-900 rounded-lg p-4 h-64">
          <svg viewBox="0 0 800 200" className="w-full h-full">
            {marketHistory.length > 1 && (
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                points={marketHistory.map((price, index) => {
                  const x = (index / (marketHistory.length - 1)) * 780 + 10;
                  const minPrice = Math.min(...marketHistory);
                  const maxPrice = Math.max(...marketHistory);
                  const y = 180 - ((price - minPrice) / (maxPrice - minPrice)) * 160 + 10;
                  return `${x},${y}`;
                }).join(' ')}
              />
            )}
            
            {/* Price points */}
            {marketHistory.map((price, index) => {
              if (index % Math.max(Math.floor(marketHistory.length / 20), 1) === 0) {
                const x = (index / (marketHistory.length - 1)) * 780 + 10;
                const minPrice = Math.min(...marketHistory);
                const maxPrice = Math.max(...marketHistory);
                const y = 180 - ((price - minPrice) / (maxPrice - minPrice)) * 160 + 10;
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#10b981"
                    className="opacity-70"
                  />
                );
              }
              return null;
            })}
          </svg>
        </div>
      </div>

      {/* Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <ArrowUpDown className="mr-2" />
            Trade BitBux
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Trade Type</label>
              <div className="flex rounded-lg overflow-hidden">
                <button
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-2 px-4 font-medium transition-colors ${
                    tradeType === 'buy' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Buy BitBux
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-2 px-4 font-medium transition-colors ${
                    tradeType === 'sell' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Sell BitBux
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Amount ({tradeType === 'buy' ? 'USD' : 'BitBux'})
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
                <button
                  onClick={() => setTradeAmount(getMaxTradeAmount().toString())}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  Max
                </button>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Max: {formatNumber(getMaxTradeAmount())} {tradeType === 'buy' ? 'USD' : 'BitBux'}
              </div>
            </div>
            
            {tradeAmount && parseFloat(tradeAmount) > 0 && (
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-400 mb-1">Trade Summary:</div>
                {tradeType === 'buy' ? (
                  <>
                    <div className="text-white">
                      Spend: {formatCurrency(parseFloat(tradeAmount))}
                    </div>
                    <div className="text-white">
                      Receive: ~{formatNumber(parseFloat(tradeAmount) / marketPrice)} BB
                    </div>
                    <div className="text-red-400 text-sm">
                      Fee: {formatCurrency(parseFloat(tradeAmount) * 0.01)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-white">
                      Sell: {formatNumber(parseFloat(tradeAmount))} BB
                    </div>
                    <div className="text-white">
                      Receive: ~{formatCurrency(parseFloat(tradeAmount) * marketPrice * 0.99)}
                    </div>
                    <div className="text-red-400 text-sm">
                      Fee: {formatCurrency(parseFloat(tradeAmount) * marketPrice * 0.01)}
                    </div>
                  </>
                )}
              </div>
            )}
            
            <button
              onClick={handleTrade}
              disabled={!tradeAmount || parseFloat(tradeAmount) <= 0 || parseFloat(tradeAmount) > getMaxTradeAmount()}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                tradeType === 'buy'
                  ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white'
              } disabled:cursor-not-allowed`}
            >
              {tradeType === 'buy' ? 'Buy BitBux' : 'Sell BitBux'}
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
          {recentTransactions.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No transactions yet
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentTransactions.map((tx, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        tx.type === 'buy' ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {tx.type === 'buy' ? 'Bought' : 'Sold'} {formatNumber(tx.amount)} BB
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatCurrency(tx.price)} per BB
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">
                        {formatCurrency(tx.amount * tx.price)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Market News (Simulated) */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Market News</h3>
        <div className="space-y-3">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-blue-400 text-lg">📈</div>
              <div>
                <div className="font-medium text-white">BitBux Adoption Increases</div>
                <div className="text-sm text-gray-400">
                  Major corporations announce BitBux integration plans, driving market optimism.
                </div>
                <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-400 text-lg">⚠️</div>
              <div>
                <div className="font-medium text-white">Regulatory Concerns</div>
                <div className="text-sm text-gray-400">
                  Government officials discuss new cryptocurrency regulations.
                </div>
                <div className="text-xs text-gray-500 mt-1">6 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPanel;