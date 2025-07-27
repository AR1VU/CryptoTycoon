import React, { useState } from 'react';
import { Coins, TrendingUp, Zap, Users } from 'lucide-react';
import { useGameStore } from '../../store';

const CoinLabPanel: React.FC = () => {
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

  const [coinForm, setCoinForm] = useState({
    name: '',
    symbol: '',
    totalSupply: 1000000,
    volatility: 20,
    popularity: 10
  });

  const formatNumber = (num: number): string => {
    if (num >= 1e33) return `${(num / 1e33).toFixed(2)} Decillion`;
    if (num >= 1e30) return `${(num / 1e30).toFixed(2)} Nonillion`;
    if (num >= 1e27) return `${(num / 1e27).toFixed(2)} Octillion`;
    if (num >= 1e24) return `${(num / 1e24).toFixed(2)} Septillion`;
    if (num >= 1e21) return `${(num / 1e21).toFixed(2)} Sextillion`;
    if (num >= 1e18) return `${(num / 1e18).toFixed(2)} Quintillion`;
    if (num >= 1e15) return `${(num / 1e15).toFixed(2)} Quadrillion`;
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)} Trillion`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)} Billion`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)} Million`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const handleLaunchCoin = () => {
    if (coinForm.name && coinForm.symbol && dollars >= 10000) {
      launchCoin({
        name: coinForm.name,
        symbol: coinForm.symbol.toUpperCase(),
        totalSupply: coinForm.totalSupply,
        volatility: coinForm.volatility,
        popularity: coinForm.popularity,
        adoptionRate: 0,
        marketingLevel: 1,
        techLevel: 1
      });
    }
  };

  if (!coinLaunched) {
    return (
      <div className="space-y-6">
        {/* Coin Lab Header */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Coins className="mr-3 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Coin Laboratory</h2>
          </div>
          <p className="text-gray-400">
            Create your own cryptocurrency and manage its market presence. Launch cost: $10,000
          </p>
        </div>

        {/* Coin Creation Form */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Design Your Coin</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Coin Name</label>
                <input
                  type="text"
                  value={coinForm.name}
                  onChange={(e) => setCoinForm({ ...coinForm, name: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., MoonCoin"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Symbol (3-4 letters)</label>
                <input
                  type="text"
                  value={coinForm.symbol}
                  onChange={(e) => setCoinForm({ ...coinForm, symbol: e.target.value.toUpperCase() })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., MOON"
                  maxLength={4}
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Total Supply: {formatNumber(coinForm.totalSupply)}
                </label>
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="100000"
                  value={coinForm.totalSupply}
                  onChange={(e) => setCoinForm({ ...coinForm, totalSupply: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Initial Volatility: {coinForm.volatility}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={coinForm.volatility}
                  onChange={(e) => setCoinForm({ ...coinForm, volatility: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-xs text-gray-500">Higher volatility = more price swings</div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Initial Popularity: {coinForm.popularity}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={coinForm.popularity}
                  onChange={(e) => setCoinForm({ ...coinForm, popularity: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-xs text-gray-500">Affects adoption rate and trading volume</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Coin Preview</h4>
                <div className="text-sm space-y-1">
                  <div className="text-purple-400">
                    {coinForm.name || 'Your Coin'} ({coinForm.symbol || 'SYM'})
                  </div>
                  <div className="text-gray-400">
                    Supply: {formatNumber(coinForm.totalSupply)}
                  </div>
                  <div className="text-gray-400">
                    Starting Price: $1.00
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLaunchCoin}
            disabled={!coinForm.name || !coinForm.symbol || dollars < 10000}
            className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            Launch Coin - $10,000
          </button>
        </div>

        {/* Coin Strategy Guide */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Strategy Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-green-400 text-lg mb-2">🚀</div>
              <h4 className="font-semibold text-white mb-2">Low Volatility</h4>
              <p className="text-sm text-gray-400">
                Stable coins attract long-term investors but may have slower growth.
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-yellow-400 text-lg mb-2">📈</div>
              <h4 className="font-semibold text-white mb-2">High Volatility</h4>
              <p className="text-sm text-gray-400">
                Volatile coins can moon quickly but also crash hard. High risk, high reward.
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-purple-400 text-lg mb-2">💎</div>
              <h4 className="font-semibold text-white mb-2">Limited Supply</h4>
              <p className="text-sm text-gray-400">
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
      {/* Coin Dashboard */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Coins className="mr-3 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">
            {customCoin?.name} ({customCoin?.symbol})
          </h2>
        </div>
        
        {customCoin && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Current Price</div>
              <div className="text-2xl font-bold text-purple-400">
                ${customCoin.currentPrice.toFixed(4)}
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Market Cap</div>
              <div className="text-2xl font-bold text-green-400">
                ${formatNumber(customCoin.currentPrice * customCoin.totalSupply)}
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm">24h Volume</div>
              <div className="text-2xl font-bold text-blue-400">
                {formatNumber(customCoin.volume)}
              </div>
              <div className="bg-gray-600 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(customCoin.volume / 1000, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Adoption Rate</div>
              <div className="text-2xl font-bold text-yellow-400">
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

      {/* Coin Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="mr-2" />
            Marketing Campaign
          </h3>
          
          {customCoin && (
            <>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Marketing Level</span>
                  <span className="text-white">Level {customCoin.marketingLevel}</span>
                </div>
                <div className="bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(customCoin.popularity, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Popularity: {customCoin.popularity.toFixed(1)}%
                </div>
              </div>
              
              <button
                onClick={marketCoin}
                disabled={dollars < 1000}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                Run Marketing Campaign - $1,000
              </button>
              
              <div className="mt-3 text-sm text-gray-400">
                Marketing increases popularity and trading volume. Higher popularity leads to better adoption rates.
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Zap className="mr-2" />
            Technology Upgrade
          </h3>
          
          {customCoin && (
            <>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Tech Level</span>
                  <span className="text-white">Level {customCoin.techLevel}</span>
                </div>
                <div className="bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.max(0, 100 - customCoin.volatility)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Volatility: {customCoin.volatility.toFixed(1)}%
                </div>
              </div>
              
              <button
                onClick={upgradeCoinTech}
                disabled={dollars < 5000}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                Upgrade Technology - $5,000
              </button>
              
              <div className="mt-3 text-sm text-gray-400">
                Technology upgrades reduce volatility and improve stability, making your coin more attractive to institutions.
              </div>
            </>
          )}
        </div>
      </div>

      {/* Coin Stats */}
      {customCoin && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Detailed Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-300">Market Metrics</h4>
              <div className="space-y-2 text-sm">
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
              <h4 className="font-medium text-gray-300">Development</h4>
              <div className="space-y-2 text-sm">
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
              <h4 className="font-medium text-gray-300">Community</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Popularity:</span>
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

      {/* Advanced Strategies (Future Features) */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Advanced Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-red-400 text-lg mb-2">⚠️</div>
            <h4 className="font-semibold text-white mb-2">Pump & Dump</h4>
            <p className="text-sm text-gray-400 mb-3">
              Artificially inflate price then sell. Costs $50,000 but can yield massive profits.
            </p>
            <button 
              onClick={pumpAndDumpCoin}
              disabled={!customCoin || dollars < 50000}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition-colors disabled:cursor-not-allowed"
            >
              {!customCoin ? 'No Coin Launched' : dollars < 50000 ? 'Need $50,000' : 'Execute Pump & Dump'}
            </button>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-orange-400 text-lg mb-2">🏃</div>
            <h4 className="font-semibold text-white mb-2">Rug Pull</h4>
            <p className="text-sm text-gray-400 mb-3">
              Abandon the project and cash out 80% of market cap. Destroys reputation but instant massive gains.
            </p>
            <button 
              onClick={rugPullCoin}
              disabled={!customCoin || rugPullExecuted}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition-colors disabled:cursor-not-allowed"
            >
              {!customCoin ? 'No Coin Launched' : rugPullExecuted ? 'Already Executed' : 'Execute Rug Pull'}
            </button>
          </div>
        </div>
        
        {customCoin && (
          <div className="mt-4 bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
            <div className="text-yellow-400 font-semibold mb-2">⚠️ High Risk Strategies</div>
            <div className="text-gray-300 text-sm">
              These strategies can yield massive profits but come with severe consequences:
            </div>
            <ul className="text-gray-400 text-sm mt-2 space-y-1">
              <li>• Pump & Dump: Temporarily inflates coin price but increases volatility and risk</li>
              <li>• Rug Pull: Instant massive payout but destroys your coin and reputation permanently</li>
              <li>• Both strategies significantly increase your risk meter and attract authorities</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinLabPanel;