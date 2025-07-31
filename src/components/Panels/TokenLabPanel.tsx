import React, { useState } from 'react';
import { Coins, TrendingUp, Plus, Trash2, Target } from 'lucide-react';
import { useGameStore } from '../../store';
import { formatNumber, formatCurrency } from '../../utils/formatters';

const TokenLabPanel: React.FC = () => {
  const {
    dollars,
    bitbux,
    coinLaunched,
    customCoin,
    rugPullExecuted,
    launchCoin,
    marketCoin,
    upgradeCoinTech,
    rugPullCoin,
    pumpAndDumpCoin
  } = useGameStore();

  const [tokenForm, setTokenForm] = useState({
    name: '',
    symbol: '',
    totalSupply: 1000000,
    volatility: 20,
    popularity: 10
  });

  const handleLaunchToken = () => {
    if (tokenForm.name && tokenForm.symbol && dollars >= 10000) {
      launchCoin({
        name: tokenForm.name,
        symbol: tokenForm.symbol.toUpperCase(),
        totalSupply: tokenForm.totalSupply,
        volatility: tokenForm.volatility,
        popularity: tokenForm.popularity,
        adoptionRate: 0,
        marketingLevel: 1,
        techLevel: 1
      });
    }
  };

  if (!coinLaunched) {
    return (
      <div className="space-y-6">
        {/* Token Lab Header */}
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-6 backdrop-blur-md neon-glow">
          <div className="flex items-center mb-4">
            <Coins className="mr-3 text-purple-400" />
            <h2 className="text-2xl font-bold text-white font-mono">Token Laboratory</h2>
          </div>
          <p className="text-purple-400 font-mono">
            Create your own ERC-20 token and manage its DeFi ecosystem. Launch cost: $10,000 USDC
          </p>
        </div>

        {/* Token Creation Form */}
        <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/50 border border-purple-500/30 rounded-lg p-6 backdrop-blur-md">
          <h3 className="text-xl font-semibold text-white mb-4 font-mono">Design Your Token</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-purple-400 text-sm mb-2 font-mono">Token Name</label>
                <input
                  type="text"
                  value={tokenForm.name}
                  onChange={(e) => setTokenForm({ ...tokenForm, name: e.target.value })}
                  className="w-full bg-black/40 border border-purple-500/30 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  placeholder="e.g., DeFiCoin"
                />
              </div>
              
              <div>
                <label className="block text-purple-400 text-sm mb-2 font-mono">Symbol (3-4 letters)</label>
                <input
                  type="text"
                  value={tokenForm.symbol}
                  onChange={(e) => setTokenForm({ ...tokenForm, symbol: e.target.value.toUpperCase() })}
                  className="w-full bg-black/40 border border-purple-500/30 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  placeholder="e.g., DEFI"
                  maxLength={4}
                />
              </div>
              
              <div>
                <label className="block text-purple-400 text-sm mb-2 font-mono">
                  Total Supply: {formatNumber(tokenForm.totalSupply)}
                </label>
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="100000"
                  value={tokenForm.totalSupply}
                  onChange={(e) => setTokenForm({ ...tokenForm, totalSupply: parseInt(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-purple-400 text-sm mb-2 font-mono">
                  Initial Volatility: {tokenForm.volatility}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={tokenForm.volatility}
                  onChange={(e) => setTokenForm({ ...tokenForm, volatility: parseInt(e.target.value) })}
                  className="w-full accent-purple-500"
                />
                <div className="text-xs text-gray-400 font-mono">Higher volatility = more price swings</div>
              </div>
              
              <div>
                <label className="block text-purple-400 text-sm mb-2 font-mono">
                  Initial Hype: {tokenForm.popularity}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={tokenForm.popularity}
                  onChange={(e) => setTokenForm({ ...tokenForm, popularity: parseInt(e.target.value) })}
                  className="w-full accent-purple-500"
                />
                <div className="text-xs text-gray-400 font-mono">Affects adoption rate and trading volume</div>
              </div>
              
              <div className="bg-black/40 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-white mb-2 font-mono">Token Preview</h4>
                <div className="text-sm space-y-1 font-mono">
                  <div className="text-purple-400 neon-text">
                    {tokenForm.name || 'Your Token'} ({tokenForm.symbol || 'SYM'})
                  </div>
                  <div className="text-gray-400">
                    Supply: {formatNumber(tokenForm.totalSupply)}
                  </div>
                  <div className="text-gray-400">
                    Starting Price: $1.00
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLaunchToken}
            disabled={!tokenForm.name || !tokenForm.symbol || dollars < 10000}
            className="w-full mt-6 web3-button text-white py-3 px-4 rounded-lg font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 font-mono"
          >
            Launch Token - $10,000 USDC
          </button>
        </div>

        {/* Token Strategy Guide */}
        <div className="bg-gradient-to-br from-gray-900/50 to-blue-900/50 border border-blue-500/30 rounded-lg p-6 backdrop-blur-md">
          <h3 className="text-xl font-semibold text-white mb-4 font-mono">DeFi Strategy Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/40 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-green-400 text-lg mb-2">🚀</div>
              <h4 className="font-semibold text-white mb-2 font-mono">Low Volatility</h4>
              <p className="text-sm text-gray-400 font-mono">
                Stable tokens attract institutional investors but may have slower growth.
              </p>
            </div>
            
            <div className="bg-black/40 border border-yellow-500/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-yellow-400 text-lg mb-2">📈</div>
              <h4 className="font-semibold text-white mb-2 font-mono">High Volatility</h4>
              <p className="text-sm text-gray-400 font-mono">
                Volatile tokens can moon quickly but also crash hard. High risk, high reward.
              </p>
            </div>
            
            <div className="bg-black/40 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-purple-400 text-lg mb-2">💎</div>
              <h4 className="font-semibold text-white mb-2 font-mono">Limited Supply</h4>
              <p className="text-sm text-gray-400 font-mono">
                Lower supply can drive scarcity and higher prices as demand grows.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Dashboard */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-6 backdrop-blur-md neon-glow">
        <div className="flex items-center mb-4">
          <Coins className="mr-3 text-purple-400" />
          <h2 className="text-2xl font-bold text-white font-mono">
            {customCoin?.name} ({customCoin?.symbol})
          </h2>
        </div>
        
        {customCoin && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-black/40 border border-purple-500 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-purple-400 text-sm font-mono">Current Price</div>
              <div className="text-2xl font-bold text-purple-400 neon-text">
                ${customCoin.currentPrice.toFixed(4)}
              </div>
            </div>
            
            <div className="bg-black/40 border border-green-500 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-green-400 text-sm font-mono">Market Cap</div>
              <div className="text-2xl font-bold text-green-400 neon-text">
                ${formatNumber(customCoin.currentPrice * customCoin.totalSupply)}
              </div>
            </div>
            
            <div className="bg-black/40 border border-blue-500 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-blue-400 text-sm font-mono">24h Volume</div>
              <div className="text-2xl font-bold text-blue-400 neon-text">
                {formatNumber(customCoin.volume)}
              </div>
              <div className="bg-gray-600 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(customCoin.volume / 1000, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="bg-black/40 border border-yellow-500 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-yellow-400 text-sm font-mono">Adoption Rate</div>
              <div className="text-2xl font-bold text-yellow-400 neon-text">
                {customCoin.adoptionRate.toFixed(1)}%
              </div>
              <div className="bg-gray-600 rounded-full h-2 mt-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{ width: `${customCoin.adoptionRate}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Token Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-900/50 to-blue-900/50 border border-green-500/30 rounded-lg p-6 backdrop-blur-md">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center font-mono">
            <TrendingUp className="mr-2" />
            Marketing Campaign
          </h3>
          
          {customCoin && (
            <>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2 font-mono">
                  <span className="text-green-400">Marketing Level</span>
                  <span className="text-white">Level {customCoin.marketingLevel}</span>
                </div>
                <div className="bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(customCoin.popularity, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1 font-mono">
                  Hype: {customCoin.popularity.toFixed(1)}%
                </div>
              </div>
              
              <button
                onClick={marketCoin}
                disabled={dollars < 1000}
                className="w-full web3-button text-white py-2 px-4 rounded-lg font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              >
                Run Marketing Campaign - $1,000
              </button>
              
              <div className="mt-3 text-sm text-green-400 font-mono">
                Marketing increases hype and trading volume. Higher hype leads to better adoption rates.
              </div>
            </>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-lg p-6 backdrop-blur-md">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center font-mono">
            <Zap className="mr-2" />
            Technology Upgrade
          </h3>
          
          {customCoin && (
            <>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2 font-mono">
                  <span className="text-blue-400">Tech Level</span>
                  <span className="text-white">Level {customCoin.techLevel}</span>
                </div>
                <div className="bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.max(0, 100 - customCoin.volatility)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1 font-mono">
                  Volatility: {customCoin.volatility.toFixed(1)}%
                </div>
              </div>
              
              <button
                onClick={upgradeCoinTech}
                disabled={dollars < 5000}
                className="w-full web3-button text-white py-2 px-4 rounded-lg font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              >
                Upgrade Technology - $5,000
              </button>
              
              <div className="mt-3 text-sm text-blue-400 font-mono">
                Technology upgrades reduce volatility and improve stability, making your token more attractive to institutions.
              </div>
            </>
          )}
        </div>
      </div>

      {/* Token Stats */}
      {customCoin && (
        <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/50 border border-purple-500/30 rounded-lg p-6 backdrop-blur-md">
          <h3 className="text-xl font-semibold text-white mb-4 font-mono">Detailed Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-purple-300 font-mono">Market Metrics</h4>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Supply:</span>
                  <span className="text-white">{formatNumber(customCoin.totalSupply)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Circulating:</span>
                  <span className="text-white">{formatNumber(customCoin.totalSupply * (customCoin.adoptionRate / 100))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price Change 24h:</span>
                  <span className={`${Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 15).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-blue-300 font-mono">Development</h4>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Marketing Level:</span>
                  <span className="text-white">{customCoin.marketingLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tech Level:</span>
                  <span className="text-white">{customCoin.techLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Stability:</span>
                  <span className="text-blue-400">{(100 - customCoin.volatility).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-green-300 font-mono">Community</h4>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Hype:</span>
                  <span className="text-white">{customCoin.popularity.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Adoption:</span>
                  <span className="text-white">{customCoin.adoptionRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Holders:</span>
                  <span className="text-white">{formatNumber(customCoin.adoptionRate * 1000)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Strategies */}
      <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 border border-red-500/30 rounded-lg p-6 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">Advanced DeFi Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/40 border border-orange-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-orange-400 text-lg mb-2">⚠️</div>
            <h4 className="font-semibold text-white mb-2 font-mono">Pump & Dump</h4>
            <p className="text-sm text-gray-400 mb-3 font-mono">
              Artificially inflate price then sell. Costs $50,000 but can yield massive profits.
            </p>
            <button 
              onClick={pumpAndDumpCoin}
              disabled={!customCoin || dollars < 50000}
              className="w-full bg-orange-600/80 hover:bg-orange-700/80 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition-all disabled:cursor-not-allowed border border-orange-500/30 font-mono"
            >
              {!customCoin ? 'No Token Launched' : dollars < 50000 ? 'Need $50,000' : 'Execute Pump & Dump'}
            </button>
          </div>
          
          <div className="bg-black/40 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-red-400 text-lg mb-2">🏃</div>
            <h4 className="font-semibold text-white mb-2 font-mono">Rug Pull</h4>
            <p className="text-sm text-gray-400 mb-3 font-mono">
              Abandon the project and cash out 80% of market cap. Destroys reputation but instant massive gains.
            </p>
            <button 
              onClick={rugPullCoin}
              disabled={!customCoin || rugPullExecuted}
              className="w-full bg-red-600/80 hover:bg-red-700/80 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition-all disabled:cursor-not-allowed border border-red-500/30 font-mono"
            >
              {!customCoin ? 'No Token Launched' : rugPullExecuted ? 'Already Executed' : 'Execute Rug Pull'}
            </button>
          </div>
        </div>
        
        {customCoin && (
          <div className="mt-4 bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-yellow-400 font-semibold mb-2 font-mono">⚠️ High Risk DeFi Strategies</div>
            <div className="text-gray-300 text-sm font-mono">
              These strategies can yield massive profits but come with severe consequences:
            </div>
            <ul className="text-gray-400 text-sm mt-2 space-y-1 font-mono">
              <li>• Pump & Dump: Temporarily inflates token price but increases volatility and risk</li>
              <li>• Rug Pull: Instant massive payout but destroys your token and reputation permanently</li>
              <li>• Both strategies significantly increase your risk meter and attract authorities</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenLabPanel;