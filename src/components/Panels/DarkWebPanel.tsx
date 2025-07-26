import React from 'react';
import { Shield, AlertTriangle, ShoppingCart, Eye } from 'lucide-react';
import { useGameStore } from '../../store';

const DarkWebPanel: React.FC = () => {
  const { coins, riskMeter, reputation } = useGameStore();

  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getRiskColor = () => {
    if (riskMeter > 70) return 'text-red-400';
    if (riskMeter > 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const blackMarketItems = [
    {
      id: 'stealth-rig',
      name: 'Stealth Mining Rig',
      description: 'Untraceable mining hardware that bypasses power grid detection',
      price: 5000,
      riskIncrease: 10,
      effect: '+50% mining speed, -25% power consumption',
      available: true
    },
    {
      id: 'power-theft',
      name: 'Power Grid Hack',
      description: 'Illegally tap into the power grid for free electricity',
      price: 10000,
      riskIncrease: 25,
      effect: 'Free power for 24 hours',
      available: reputation > 50
    },
    {
      id: 'insider-info',
      name: 'Exchange Insider Info',
      description: 'Get advance notice of market-moving news',
      price: 25000,
      riskIncrease: 15,
      effect: 'Predict next 3 market movements',
      available: reputation > 100
    },
    {
      id: 'fake-audit',
      name: 'Fake Security Audit',
      description: 'Fraudulent security certificate for your custom coin',
      price: 15000,
      riskIncrease: 20,
      effect: '+30% coin adoption rate',
      available: reputation > 75
    }
  ];

  const surveillanceEvents = [
    'Government monitoring increased',
    'Exchange compliance check detected',
    'Suspicious transaction flagged',
    'Law enforcement inquiry pending'
  ];

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
              {formatNumber(coins)} BB
            </div>
          </div>
        </div>
      </div>

      {/* Black Market */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <ShoppingCart className="mr-2" />
          Black Market Items
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blackMarketItems.map((item) => (
            <div key={item.id} className={`bg-gray-700 rounded-lg p-4 border ${
              item.available ? 'border-gray-600' : 'border-gray-800'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    item.available ? 'text-white' : 'text-gray-500'
                  }`}>
                    {item.name}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    item.available ? 'text-gray-400' : 'text-gray-600'
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
                  <span className="text-yellow-400">{formatNumber(item.price)} BB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk:</span>
                  <span className="text-red-400">+{item.riskIncrease}%</span>
                </div>
                <div className="text-green-400 text-xs mt-2">
                  Effect: {item.effect}
                </div>
              </div>
              
              <button
                disabled={!item.available || coins < item.price}
                className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
                  item.available && coins >= item.price
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {!item.available ? `Requires ${item.name.includes('Power') ? '50' : '75'} Reputation` : 
                 coins < item.price ? 'Insufficient Funds' : 'Purchase'}
              </button>
            </div>
          ))}
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
                {formatNumber(riskMeter * 1000)} BB
              </span>
            </div>
            <button
              disabled={coins < riskMeter * 1000 || riskMeter < 10}
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
              disabled={riskMeter < 50}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {riskMeter < 50 ? 'Risk Too Low' : 'Go Underground'}
            </button>
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