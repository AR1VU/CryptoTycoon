import React from 'react';
import { Eye, AlertTriangle, ShoppingCart, Shield } from 'lucide-react';
import { useGameStore } from '../../store';
import { formatNumber, formatCurrency } from '../../utils/formatters';

const DarkPoolPanel: React.FC = () => {
  const { 
    dollars, 
    riskMeter, 
    reputation, 
    blackMarketItems, 
    ownedBlackMarketItems,
    blackMarketItemExpiry,
    isUnderground,
    undergroundEndTime,
    buyBlackMarketItem,
    payBribe,
    goUnderground,
    exitUnderground
  } = useGameStore();

  const getRiskColor = () => {
    if (riskMeter > 70) return 'text-red-400';
    if (riskMeter > 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const surveillanceEvents = [
    'Blockchain analysis detected',
    'DEX compliance check flagged',
    'Suspicious transaction patterns',
    'Regulatory inquiry pending'
  ];

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Dark Pool Header */}
      <div className="bg-gradient-to-br from-red-900/50 to-black/50 border border-red-500/30 rounded-lg p-6 backdrop-blur-md neon-glow">
        <div className="flex items-center mb-4">
          <Eye className="mr-3 text-red-400" />
          <h2 className="text-2xl font-bold text-white font-mono">Dark Pool Trading</h2>
          <div className="ml-auto text-xs text-red-400 animate-pulse font-mono">
            🔒 ENCRYPTED_CHANNEL
          </div>
        </div>
        
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4 backdrop-blur-sm">
          <div className="flex items-center">
            <AlertTriangle className="text-red-400 mr-3" />
            <div>
              <div className="text-red-400 font-semibold font-mono">High Risk Trading Zone</div>
              <div className="text-gray-300 text-sm font-mono">
                All activities here increase your risk meter. High risk attracts regulatory attention.
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/40 border border-red-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-red-400 text-sm font-mono">Risk Meter</div>
            <div className={`text-2xl font-bold ${getRiskColor()} neon-text`}>
              {riskMeter.toFixed(1)}%
            </div>
            <div className="bg-gray-700 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  riskMeter > 70 ? 'bg-red-500' : 
                  riskMeter > 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${riskMeter}%` }}
              />
            </div>
          </div>
          
          <div className="bg-black/40 border border-purple-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-purple-400 text-sm font-mono">Reputation</div>
            <div className="text-2xl font-bold text-purple-400 neon-text">
              {reputation}
            </div>
            <div className="text-xs text-gray-500 mt-1 font-mono">
              Higher rep unlocks better items
            </div>
          </div>
          
          <div className="bg-black/40 border border-yellow-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-yellow-400 text-sm font-mono">Available Funds</div>
            <div className="text-2xl font-bold text-yellow-400 neon-text">
              ${formatNumber(dollars)}
            </div>
          </div>
        </div>
        
        {isUnderground && (
          <div className="mt-4 bg-blue-900/20 border border-blue-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="text-blue-400 text-lg mr-3">🕳️</div>
              <div>
                <div className="text-blue-400 font-semibold font-mono">Underground Status Active</div>
                <div className="text-gray-300 text-sm font-mono">
                  Hiding from authorities. All income reduced by 75%. 
                  Time remaining: {formatTime(undergroundEndTime - Date.now())}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dark Pool Items */}
      <div className="bg-gradient-to-br from-gray-900/50 to-red-900/50 border border-red-500/30 rounded-lg p-6 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center font-mono">
          <ShoppingCart className="mr-2" />
          Dark Pool Assets
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blackMarketItems.map((item) => {
            const isOwned = ownedBlackMarketItems.includes(item.id);
            const expiryTime = blackMarketItemExpiry[item.id];
            const isExpired = expiryTime && expiryTime > 0 && Date.now() > expiryTime;
            const timeRemaining = expiryTime && expiryTime > 0 ? Math.max(0, expiryTime - Date.now()) : 0;
            const canAfford = dollars >= item.price;
            const hasReputation = reputation >= item.requiredReputation;
            const available = (!isOwned || isExpired) && canAfford && hasReputation;
            
            return (
              <div key={item.id} className={`bg-black/40 rounded-lg p-4 border backdrop-blur-sm ${
                available ? 'border-red-500/30' : (isOwned && !isExpired) ? 'border-green-500/30' : 'border-gray-800/30'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className={`font-semibold font-mono ${
                      (isOwned && !isExpired) ? 'text-green-400' : available ? 'text-white' : 'text-gray-500'
                    }`}>
                      {item.name}
                      {(isOwned && !isExpired) && <span className="ml-2 text-xs bg-green-600 px-2 py-1 rounded">ACTIVE</span>}
                      {isExpired && <span className="ml-2 text-xs bg-red-600 px-2 py-1 rounded">EXPIRED</span>}
                    </h4>
                    <p className={`text-sm mt-1 font-mono ${
                      available ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {item.description}
                    </p>
                    {(isOwned && !isExpired && !item.permanent) && (
                      <div className="text-xs text-yellow-400 mt-1 font-mono">
                        Expires in: {Math.ceil(timeRemaining / 3600000)}h {Math.ceil((timeRemaining % 3600000) / 60000)}m
                      </div>
                    )}
                  </div>
                  <div className="text-red-400 text-lg">
                    ⚠️
                  </div>
                </div>
                
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-yellow-400">${formatNumber(item.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk:</span>
                    <span className="text-red-400">+{item.riskIncrease}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Required Rep:</span>
                    <span className="text-purple-400">{item.requiredReputation}</span>
                  </div>
                  <div className="text-green-400 text-xs mt-2">
                    Effect: {item.effect}
                  </div>
                  {!item.permanent && (
                    <div className="text-blue-400 text-xs">
                      Duration: {Math.floor(item.duration / 3600000)}h
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => buyBlackMarketItem(item.id)}
                  disabled={!available || (isOwned && !isExpired)}
                  className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-all font-mono ${
                    available && (!isOwned || isExpired)
                      ? 'bg-red-600/80 hover:bg-red-700/80 text-white border border-red-500/30'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {(isOwned && !isExpired) ? 'Already Active' :
                   isExpired ? 'Repurchase' :
                   !hasReputation ? `Requires ${item.requiredReputation} Reputation` : 
                   !canAfford ? 'Insufficient Funds' : 'Purchase'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Surveillance Alerts */}
      <div className="bg-gradient-to-br from-gray-900/50 to-blue-900/50 border border-blue-500/30 rounded-lg p-6 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center font-mono">
          <Shield className="mr-2" />
          Surveillance Alerts
        </h3>
        
        {riskMeter < 30 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🕵️</div>
            <div className="font-mono">All clear. No surveillance detected.</div>
            <div className="text-sm mt-1 font-mono">Keep your risk meter low to avoid attention.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {surveillanceEvents.slice(0, Math.floor(riskMeter / 25)).map((event, index) => (
              <div key={index} className="bg-black/40 border border-red-500/30 rounded-lg p-4 flex items-center backdrop-blur-sm">
                <div className="text-red-400 text-lg mr-3 animate-pulse">🔍</div>
                <div className="flex-1">
                  <div className="text-white font-medium font-mono">{event}</div>
                  <div className="text-gray-400 text-sm font-mono">
                    {new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-red-400 text-sm font-mono">
                  High Priority
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Risk Management */}
      <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/50 border border-purple-500/30 rounded-lg p-6 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">Risk Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/40 border border-yellow-500/30 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-semibold text-white mb-3 font-mono">💰 Pay Bribe</h4>
            <p className="text-sm text-gray-400 mb-3 font-mono">
              Reduce risk meter by paying off officials. Cost increases with risk level.
            </p>
            <div className="text-sm mb-3 font-mono">
              <span className="text-gray-400">Cost: </span>
              <span className="text-yellow-400">
                ${formatNumber(riskMeter * 1000)}
              </span>
            </div>
            <button
              onClick={payBribe}
              disabled={dollars < riskMeter * 1000 || riskMeter < 10}
              className="w-full bg-yellow-600/80 hover:bg-yellow-700/80 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-all disabled:cursor-not-allowed border border-yellow-500/30 font-mono"
            >
              {riskMeter < 10 ? 'Risk Too Low' : 'Pay Bribe'}
            </button>
          </div>
          
          <div className="bg-black/40 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-semibold text-white mb-3 font-mono">🏃 Go Underground</h4>
            <p className="text-sm text-gray-400 mb-3 font-mono">
              Temporarily hide from authorities. Reduces all income but lowers risk over time.
            </p>
            <div className="text-sm mb-3 font-mono">
              <span className="text-gray-400">Duration: </span>
              <span className="text-blue-400">24 hours</span>
            </div>
            <button
              onClick={goUnderground}
              disabled={riskMeter < 50 || isUnderground}
              className="w-full bg-blue-600/80 hover:bg-blue-700/80 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-all disabled:cursor-not-allowed border border-blue-500/30 font-mono"
            >
              {isUnderground ? 'Already Underground' : riskMeter < 50 ? 'Risk Too Low' : 'Go Underground'}
            </button>
            
            {isUnderground && (
              <button
                onClick={exitUnderground}
                className="w-full mt-2 bg-green-600/80 hover:bg-green-700/80 text-white py-2 px-4 rounded-lg font-medium transition-all border border-green-500/30 font-mono"
              >
                Exit Underground
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {riskMeter > 80 && (
        <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center">
            <AlertTriangle className="text-red-400 mr-3" />
            <div>
              <div className="text-red-400 font-semibold text-lg font-mono">⚠️ EXTREME RISK WARNING ⚠️</div>
              <div className="text-gray-300 mt-2 font-mono">
                Your activities have attracted significant regulatory attention. 
                Expect audits, asset freezes, and potential game over scenarios.
              </div>
              <div className="text-red-400 text-sm mt-2 font-mono">
                Consider paying bribes or going underground immediately!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DarkPoolPanel;