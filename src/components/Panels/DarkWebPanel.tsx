import React from 'react';
import { Shield, AlertTriangle, ShoppingCart, Eye } from 'lucide-react';
import { useGameStore } from '../../store';

const DarkWebPanel: React.FC = () => {
  const { 
    dollars, 
    riskMeter, 
    reputation, 
    blackMarketItems, 
    ownedBlackMarketItems,
    isUnderground,
    undergroundEndTime,
    buyBlackMarketItem,
    payBribe,
    goUnderground,
    exitUnderground
  } = useGameStore();

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

  const getRiskColor = () => {
    if (riskMeter > 70) return 'text-red-400';
    if (riskMeter > 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const surveillanceEvents = [
    'Government monitoring increased',
    'Exchange compliance check detected',
    'Suspicious transaction flagged',
    'Law enforcement inquiry pending'
  ];

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Dark Web Header */}
      <div className="bg-gray-900 border border-red-500 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Shield className="mr-3 text-red-400" />
          <h2 className="text-2xl font-bold text-white">Dark Web Marketplace</h2>
          <div className="ml-auto text-xs text-red-400 animate-pulse">
            🔒 ENCRYPTED CONNECTION
          </div>
        </div>
        
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertTriangle className="text-red-400 mr-3" />
            <div>
              <div className="text-red-400 font-semibold">High Risk Area</div>
              <div className="text-gray-300 text-sm">
                All actions here increase your risk meter. High risk attracts government attention.
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Risk Meter</div>
            <div className={`text-2xl font-bold ${getRiskColor()}`}>
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
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Reputation</div>
            <div className="text-2xl font-bold text-purple-400">
              {reputation}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Higher rep unlocks better items
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Available Funds</div>
            <div className="text-2xl font-bold text-yellow-400">
              ${formatNumber(dollars)}
            </div>
          </div>
        </div>
        
        {isUnderground && (
          <div className="mt-4 bg-blue-900/20 border border-blue-500 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-blue-400 text-lg mr-3">🕳️</div>
              <div>
                <div className="text-blue-400 font-semibold">Underground Status Active</div>
                <div className="text-gray-300 text-sm">
                  Hiding from authorities. All income reduced by 75%. 
                  Time remaining: {formatTime(undergroundEndTime - Date.now())}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Black Market */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <ShoppingCart className="mr-2" />
          Black Market Items
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blackMarketItems.map((item) => {
            const isOwned = ownedBlackMarketItems.includes(item.id);
            const canAfford = dollars >= item.price;
            const hasReputation = reputation >= item.requiredReputation;
            const available = !isOwned && canAfford && hasReputation;
            
            return (
              <div key={item.id} className={`bg-gray-700 rounded-lg p-4 border ${
                available ? 'border-gray-600' : isOwned ? 'border-green-600' : 'border-gray-800'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      isOwned ? 'text-green-400' : available ? 'text-white' : 'text-gray-500'
                    }`}>
                      {item.name}
                      {isOwned && <span className="ml-2 text-xs bg-green-600 px-2 py-1 rounded">OWNED</span>}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      available ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                  <div className="text-red-400 text-lg">
                    ⚠️
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
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
                </div>
                
                <button
                  onClick={() => buyBlackMarketItem(item.id)}
                  disabled={!available || isOwned}
                  className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
                    available && !isOwned
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isOwned ? 'Already Owned' :
                   !hasReputation ? `Requires ${item.requiredReputation} Reputation` : 
                   !canAfford ? 'Insufficient Funds' : 'Purchase'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Surveillance Alerts */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Eye className="mr-2" />
          Surveillance Alerts
        </h3>
        
        {riskMeter < 30 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🕵️</div>
            <div>All clear. No surveillance detected.</div>
            <div className="text-sm mt-1">Keep your risk meter low to avoid attention.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {surveillanceEvents.slice(0, Math.floor(riskMeter / 25)).map((event, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4 flex items-center">
                <div className="text-red-400 text-lg mr-3 animate-pulse">🔍</div>
                <div className="flex-1">
                  <div className="text-white font-medium">{event}</div>
                  <div className="text-gray-400 text-sm">
                    {new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-red-400 text-sm">
                  High Priority
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Risk Management */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Risk Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">💰 Pay Bribe</h4>
            <p className="text-sm text-gray-400 mb-3">
              Reduce risk meter by paying off officials. Cost increases with risk level.
            </p>
            <div className="text-sm mb-3">
              <span className="text-gray-400">Cost: </span>
              <span className="text-yellow-400">
                ${formatNumber(riskMeter * 1000)}
              </span>
            </div>
            <button
              onClick={payBribe}
              disabled={dollars < riskMeter * 1000 || riskMeter < 10}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {riskMeter < 10 ? 'Risk Too Low' : 'Pay Bribe'}
            </button>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">🏃 Go Underground</h4>
            <p className="text-sm text-gray-400 mb-3">
              Temporarily hide from authorities. Reduces all income but lowers risk over time.
            </p>
            <div className="text-sm mb-3">
              <span className="text-gray-400">Duration: </span>
              <span className="text-blue-400">24 hours</span>
            </div>
            <button
              onClick={goUnderground}
              disabled={riskMeter < 50 || isUnderground}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {isUnderground ? 'Already Underground' : riskMeter < 50 ? 'Risk Too Low' : 'Go Underground'}
            </button>
            
            {isUnderground && (
              <button
                onClick={exitUnderground}
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Exit Underground
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {riskMeter > 80 && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="text-red-400 mr-3" />
            <div>
              <div className="text-red-400 font-semibold text-lg">⚠️ EXTREME RISK WARNING ⚠️</div>
              <div className="text-gray-300 mt-2">
                Your activities have attracted significant government attention. 
                Expect raids, account freezes, and potential game over scenarios.
              </div>
              <div className="text-red-400 text-sm mt-2">
                Consider paying bribes or going underground immediately!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DarkWebPanel;