import React from 'react';
import { Network, TrendingUp, Wrench, AlertTriangle, DollarSign } from 'lucide-react';
import { useGameStore } from '../../store';
import { formatNumber, formatCurrency } from '../../utils/formatters';

const NetworkPanel: React.FC = () => {
  const {
    powerUsed,
    powerCapacity,
    batteryCapacity,
    batteryStored,
    powerPlants,
    gridEfficiency,
    pollution,
    dollars,
    buyPowerPlant,
    upgradePowerPlant,
    repairPowerPlant,
    sellBatteryPower,
    upgradeBattery
  } = useGameStore();

  const [sellAmount, setSellAmount] = React.useState<string>('1');

  const networkTypes = [
    { 
      type: 'coal' as const, 
      name: 'Layer 2 Network', 
      baseCost: 100000, 
      icon: '🔗',
      description: 'Basic scaling solution'
    },
    { 
      type: 'solar' as const, 
      name: 'Sidechain', 
      baseCost: 1000000, 
      icon: '⚡',
      description: 'Independent blockchain'
    },
    { 
      type: 'nuclear' as const, 
      name: 'Rollup Network', 
      baseCost: 50000000000, 
      icon: '🌐',
      description: 'Advanced rollup technology'
    },
    { 
      type: 'quantum' as const, 
      name: 'Quantum Network', 
      baseCost: 10000000000000, 
      icon: '⚛️',
      description: 'Next-gen quantum networking'
    }
  ];

  const getNetworkCost = (type: string, count: number) => {
    const baseConfig = networkTypes.find(p => p.type === type);
    if (!baseConfig) return 0;
    return baseConfig.baseCost * Math.pow(1.5, count);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400';
      case 'malfunction': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getCongestionColor = () => {
    if (pollution > 70) return 'text-red-400';
    if (pollution > 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const networkUtilization = (powerUsed / powerCapacity) * 100;
  const effectiveCapacity = powerCapacity * gridEfficiency;
  const excessCapacity = Math.max(0, effectiveCapacity - powerUsed);
  const storageUtilization = (batteryStored / batteryCapacity) * 100;

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500/30 rounded-lg p-6 backdrop-blur-md neon-glow">
        <div className="flex items-center mb-4">
          <Network className="mr-3 text-blue-400" />
          <h2 className="text-2xl font-bold text-white font-mono">Network Infrastructure</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black/40 border border-blue-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-blue-400 text-sm font-mono">Network Load</div>
            <div className={`text-2xl font-bold ${powerUsed > effectiveCapacity ? 'text-red-400' : 'text-blue-400'} neon-text`}>
              {formatNumber(powerUsed)} TPS
            </div>
            <div className="bg-gray-600 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  networkUtilization > 100 ? 'bg-red-500' : 
                  networkUtilization > 80 ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(networkUtilization, 100)}%` }}
              />
            </div>
          </div>
          
          <div className="bg-black/40 border border-green-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-green-400 text-sm font-mono">Total Capacity</div>
            <div className="text-2xl font-bold text-green-400 neon-text">
              {powerCapacity < 1000 ? powerCapacity.toFixed(1) : formatNumber(powerCapacity)} TPS
            </div>
            <div className="text-sm text-gray-400 mt-1 font-mono">
              Effective: {effectiveCapacity < 1000 ? effectiveCapacity.toFixed(1) : formatNumber(effectiveCapacity)} TPS
            </div>
            {excessCapacity > 0 && (
              <div className="text-sm text-green-400 mt-1 font-mono">
                Available: {excessCapacity.toFixed(1)} TPS
              </div>
            )}
          </div>
          
          <div className="bg-black/40 border border-purple-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-purple-400 text-sm font-mono">Data Storage</div>
            <div className="text-2xl font-bold text-purple-400 neon-text">
              {batteryStored.toFixed(1)} / {batteryCapacity} TB
            </div>
            <div className="bg-gray-600 rounded-full h-2 mt-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${storageUtilization}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              {storageUtilization.toFixed(1)}% Full
            </div>
          </div>
          
          <div className="bg-black/40 border border-yellow-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-yellow-400 text-sm font-mono">Network Congestion</div>
            <div className={`text-2xl font-bold ${getCongestionColor()} neon-text`}>
              {pollution.toFixed(1)}%
            </div>
            <div className="bg-gray-600 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${getCongestionColor().replace('text', 'bg')}`}
                style={{ width: `${Math.min(pollution, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {powerUsed > effectiveCapacity && (
          <div className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-center backdrop-blur-sm">
            <AlertTriangle className="text-red-400 mr-3" />
            <div>
              <div className="text-red-400 font-semibold font-mono">Network Congestion!</div>
              <div className="text-gray-300 text-sm font-mono">
                Transaction throughput exceeds network capacity. This reduces validation efficiency.
              </div>
            </div>
          </div>
        )}
        
        {/* Storage Management */}
        <div className="mt-4 bg-purple-900/20 border border-purple-500 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="text-purple-400 mr-3">💾</div>
              <div>
                <div className="text-purple-400 font-semibold font-mono">Data Storage System</div>
                <div className="text-gray-300 text-sm font-mono">
                  Store excess data and monetize storage capacity. Rate depends on network infrastructure.
                </div>
              </div>
            </div>
            <button
              onClick={upgradeBattery}
              disabled={dollars < batteryCapacity * 1000}
              className="web3-button text-white px-4 py-2 rounded-lg font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              Upgrade (+10 TB) - ${formatNumber(batteryCapacity * 1000)}
            </button>
          </div>
          
          {/* Storage Info */}
          {powerPlants.length > 0 && excessCapacity > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-cyan-500/20">
              <div className="text-green-400 text-sm font-semibold mb-1 font-mono">⚡ Storage Active</div>
              <div className="text-gray-300 text-sm font-mono">
                Excess capacity is automatically storing data. Storage rate varies by network type.
              </div>
            </div>
          )}
          
          {powerPlants.length === 0 && (
            <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-red-500/20">
              <div className="text-red-400 text-sm font-semibold mb-1 font-mono">⚠️ No Networks Deployed</div>
              <div className="text-gray-300 text-sm font-mono">
                Deploy network infrastructure to enable data storage and earn from capacity sales.
              </div>
            </div>
          )}
          
          {/* Data Sales */}
          {batteryStored > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="text-purple-400 mr-3" />
                <div>
                  <div className="text-purple-400 font-semibold font-mono">Sell Storage Capacity</div>
                  <div className="text-gray-300 text-sm font-mono">
                    Monetize stored data at $25/TB. Available: {batteryStored.toFixed(1)} TB
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  className="w-20 bg-gray-800/50 border border-cyan-500/30 text-white rounded px-2 py-1 text-sm font-mono"
                  min="0"
                  max={batteryStored.toFixed(1)}
                  step="0.1"
                />
                <span className="text-gray-400 text-sm font-mono">TB</span>
                <button
                  onClick={() => setSellAmount(batteryStored.toFixed(1))}
                  className="bg-gray-700/50 hover:bg-gray-600/50 text-cyan-400 px-2 py-1 rounded text-sm border border-cyan-500/30"
                >
                  Max
                </button>
                <button
                  onClick={() => {
                    const amount = parseFloat(sellAmount);
                    if (!isNaN(amount) && amount > 0) {
                      sellBatteryPower(amount);
                      setSellAmount('1');
                    }
                  }}
                  disabled={!sellAmount || parseFloat(sellAmount) <= 0 || parseFloat(sellAmount) > batteryStored}
                  className="web3-button text-white px-4 py-1 rounded font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sell (+${(parseFloat(sellAmount || '0') * 25).toFixed(2)})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deploy Networks */}
      <div className="bg-gradient-to-br from-gray-900/50 to-blue-900/50 border border-blue-500/30 rounded-lg p-6 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">Deploy Network Infrastructure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {networkTypes.map((networkType) => {
            const count = powerPlants.filter(p => p.type === networkType.type).length;
            const cost = getNetworkCost(networkType.type, count);
            const canAfford = dollars >= cost;
            
            return (
              <div key={networkType.type} className="bg-black/40 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm hover:border-cyan-400/50 transition-all">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{networkType.icon}</div>
                  <h4 className="font-semibold text-white font-mono">{networkType.name}</h4>
                  <div className="text-cyan-400 text-xs mb-2 font-mono">{networkType.description}</div>
                  <div className="text-gray-400 text-sm font-mono">Deployed: {count}</div>
                </div>
                <button
                  onClick={() => buyPowerPlant(networkType.type)}
                  disabled={!canAfford}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-all font-mono ${
                    canAfford
                      ? 'web3-button text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Deploy - ${formatNumber(cost)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Network Management */}
      <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/50 border border-purple-500/30 rounded-lg p-6 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">Network Management</h3>
        {powerPlants.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔗</div>
            <div className="text-gray-400 font-mono">No networks deployed yet.</div>
            <div className="text-cyan-400 text-sm mt-2 font-mono">Deploy your first network above!</div>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {powerPlants.map((network) => (
              <div key={network.id} className="bg-black/40 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {networkTypes.find(t => t.type === network.type)?.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white font-mono">
                        {network.type.charAt(0).toUpperCase() + network.type.slice(1)} Network (Level {network.level})
                      </div>
                      <div className="text-sm text-cyan-400 font-mono">
                        Capacity: {formatNumber(network.capacity)} TPS | 
                        Efficiency: {(network.efficiency * 100).toFixed(1)}% | 
                        Upkeep: ${formatNumber(network.upkeep)}/block
                      </div>
                      <div className="text-sm text-cyan-400 font-mono">
                        Storage Rate: {
                          network.type === 'coal' ? '0.1' :
                          network.type === 'solar' ? '0.05' :
                          network.type === 'nuclear' ? '0.3' :
                          network.type === 'quantum' ? '0.8' : '0'
                        } TB/block
                      </div>
                      <div className="text-sm font-mono">
                        <span className="text-gray-400">Status: </span>
                        <span className={getStatusColor(network.status)}>
                          {network.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm font-mono">
                        <span className="text-gray-400">Congestion Impact: </span>
                        <span className={network.environmentalImpact > 0 ? 'text-red-400' : 'text-green-400'}>
                          {network.environmentalImpact > 0 ? '+' : ''}{network.environmentalImpact}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => upgradePowerPlant(network.id)}
                      disabled={dollars < network.level * network.level * 10000}
                      className="bg-green-600/80 hover:bg-green-700/80 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-all border border-green-500/30"
                      title={`Upgrade ($${formatNumber(network.level * network.level * 10000)})`}
                    >
                      <TrendingUp size={14} />
                    </button>
                    
                    {network.status === 'malfunction' && (
                      <button
                        onClick={() => repairPowerPlant(network.id)}
                        disabled={dollars < network.level * 5000}
                        className="bg-red-600/80 hover:bg-red-700/80 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-all border border-red-500/30"
                        title={`Repair ($${formatNumber(network.level * 5000)})`}
                      >
                        <Wrench size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Congestion Alert */}
      {pollution > 30 && (
        <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-500 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center font-mono">
            <AlertTriangle className="mr-2 text-yellow-400" />
            Network Congestion Alert
          </h3>
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
            <div className="text-yellow-400 font-semibold mb-2 font-mono">High Network Congestion Detected</div>
            <div className="text-gray-300 text-sm mb-3 font-mono">
              Your networks are experiencing significant congestion. This increases transaction costs and reduces efficiency.
            </div>
            <div className="text-gray-400 text-sm font-mono">
              Consider deploying more efficient networks like rollups or quantum networks to reduce congestion.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkPanel;