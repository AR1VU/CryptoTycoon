import React from 'react';
import { Zap, TrendingUp, Wrench, AlertTriangle, DollarSign } from 'lucide-react';
import { useGameStore } from '../../store';

const PowerPanel: React.FC = () => {
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

  const powerPlantTypes = [
    { 
      type: 'coal' as const, 
      name: 'Coal Power Plant', 
      baseCost: 100000, 
      icon: '🏭',
      description: 'Cheap but polluting'
    },
    { 
      type: 'solar' as const, 
      name: 'Solar Farm', 
      baseCost: 1000000, 
      icon: '☀️',
      description: 'Clean but expensive'
    },
    { 
      type: 'nuclear' as const, 
      name: 'Nuclear Plant', 
      baseCost: 50000000000, 
      icon: '☢️',
      description: 'High capacity, low pollution'
    },
    { 
      type: 'quantum' as const, 
      name: 'Quantum Reactor', 
      baseCost: 10000000000000, 
      icon: '⚛️',
      description: 'Ultimate power source'
    }
  ];

  const getPowerPlantCost = (type: string, count: number) => {
    const baseConfig = powerPlantTypes.find(p => p.type === type);
    if (!baseConfig) return 0;
    return baseConfig.baseCost * Math.pow(1.5, count);
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400';
      case 'malfunction': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPollutionColor = () => {
    if (pollution > 70) return 'text-red-400';
    if (pollution > 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const powerUtilization = (powerUsed / powerCapacity) * 100;
  const effectivePowerCapacity = powerCapacity * gridEfficiency;
  const excessPower = Math.max(0, effectivePowerCapacity - powerUsed);
  const batteryUtilization = (batteryStored / batteryCapacity) * 100;

  return (
    <div className="space-y-6">
      {/* Power Grid Overview */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Zap className="mr-3 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Power Grid Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Power Usage</div>
            <div className={`text-2xl font-bold ${powerUsed > effectivePowerCapacity ? 'text-red-400' : 'text-blue-400'}`}>
              {formatNumber(powerUsed)} MW
            </div>
            <div className="bg-gray-600 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  powerUtilization > 100 ? 'bg-red-500' : 
                  powerUtilization > 80 ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(powerUtilization, 100)}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Total Capacity</div>
            <div className="text-2xl font-bold text-green-400">
              {powerCapacity < 1000 ? powerCapacity.toFixed(1) : formatNumber(powerCapacity)} MW
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Effective: {effectivePowerCapacity < 1000 ? effectivePowerCapacity.toFixed(1) : formatNumber(effectivePowerCapacity)} MW
            </div>
            {excessPower > 0 && (
              <div className="text-sm text-green-400 mt-1">
                Excess: {excessPower.toFixed(1)} MW
              </div>
            )}
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Battery Storage</div>
            <div className="text-2xl font-bold text-purple-400">
              {batteryStored.toFixed(1)} / {batteryCapacity} MWh
            </div>
            <div className="bg-gray-600 rounded-full h-2 mt-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${batteryUtilization}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {batteryUtilization.toFixed(1)}% Full
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Pollution Level</div>
            <div className={`text-2xl font-bold ${getPollutionColor()}`}>
              {pollution.toFixed(1)}
            </div>
            <div className="bg-gray-600 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${getPollutionColor().replace('text', 'bg')}`}
                style={{ width: `${Math.min(pollution, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {powerUsed > effectivePowerCapacity && (
          <div className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-center">
            <AlertTriangle className="text-red-400 mr-3" />
            <div>
              <div className="text-red-400 font-semibold">Power Shortage!</div>
              <div className="text-gray-300 text-sm">
                Your miners are consuming more power than your grid can provide. This reduces mining efficiency.
              </div>
            </div>
          </div>
        )}
        
        {/* Battery Management */}
        <div className="mt-4 bg-purple-900/20 border border-purple-500 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="text-purple-400 mr-3">🔋</div>
              <div>
                <div className="text-purple-400 font-semibold">Battery System</div>
                <div className="text-gray-300 text-sm">
                  Store excess power and sell it for profit. Charging rate depends on your power plants.
                </div>
              </div>
            </div>
            <button
              onClick={upgradeBattery}
              disabled={dollars < batteryCapacity * 1000}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              Upgrade (+10 MWh) - ${formatNumber(batteryCapacity * 1000)}
            </button>
          </div>
          
          {/* Battery Charging Info */}
          {powerPlants.length > 0 && excessPower > 0 && (
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <div className="text-green-400 text-sm font-semibold mb-1">⚡ Charging Active</div>
              <div className="text-gray-300 text-sm">
                Excess power is automatically charging your battery. Charging rate varies by power plant type.
              </div>
            </div>
          )}
          
          {powerPlants.length === 0 && (
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <div className="text-red-400 text-sm font-semibold mb-1">⚠️ No Power Plants</div>
              <div className="text-gray-300 text-sm">
                You need to build power plants to charge your battery and earn money from energy sales.
              </div>
            </div>
          )}
          
          {/* Battery Power Selling */}
          {batteryStored > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="text-purple-400 mr-3" />
                <div>
                  <div className="text-purple-400 font-semibold">Sell Battery Power</div>
                  <div className="text-gray-300 text-sm">
                    Sell stored energy at $25/MWh. Available: {batteryStored.toFixed(1)} MWh
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  className="w-20 bg-gray-700 text-white rounded px-2 py-1 text-sm"
                  min="0"
                  max={batteryStored.toFixed(1)}
                  step="0.1"
                />
                <span className="text-gray-400 text-sm">MWh</span>
                <button
                  onClick={() => setSellAmount(batteryStored.toFixed(1))}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-sm"
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
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-1 rounded font-medium transition-colors disabled:cursor-not-allowed"
                >
                  Sell (+${(parseFloat(sellAmount || '0') * 25).toFixed(2)})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Buy Power Plants */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Build Power Plants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {powerPlantTypes.map((plantType) => {
            const count = powerPlants.filter(p => p.type === plantType.type).length;
            const cost = getPowerPlantCost(plantType.type, count);
            const canAfford = dollars >= cost;
            
            return (
              <div key={plantType.type} className="bg-gray-700 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{plantType.icon}</div>
                  <h4 className="font-semibold text-white">{plantType.name}</h4>
                  <div className="text-gray-400 text-xs mb-2">{plantType.description}</div>
                  <div className="text-gray-400 text-sm">Owned: {count}</div>
                </div>
                <button
                  onClick={() => buyPowerPlant(plantType.type)}
                  disabled={!canAfford}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                    canAfford
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Build - ${formatNumber(cost)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Power Plant Management */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Power Plant Management</h3>
        {powerPlants.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No power plants built yet. Build your first power plant above!
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {powerPlants.map((plant) => (
              <div key={plant.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {powerPlantTypes.find(t => t.type === plant.type)?.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">
                        {plant.type.charAt(0).toUpperCase() + plant.type.slice(1)} Plant (Level {plant.level})
                      </div>
                      <div className="text-sm text-gray-400">
                        Capacity: {formatNumber(plant.capacity)} MW | 
                        Efficiency: {(plant.efficiency * 100).toFixed(1)}% | 
                        Upkeep: ${formatNumber(plant.upkeep)}/tick
                      </div>
                      <div className="text-sm text-gray-400">
                        Charging Rate: {
                          plant.type === 'coal' ? '0.1' :
                          plant.type === 'solar' ? '0.05' :
                          plant.type === 'nuclear' ? '0.3' :
                          plant.type === 'quantum' ? '0.8' : '0'
                        } MWh/tick
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Status: </span>
                        <span className={getStatusColor(plant.status)}>
                          {plant.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Environmental Impact: </span>
                        <span className={plant.environmentalImpact > 0 ? 'text-red-400' : 'text-green-400'}>
                          {plant.environmentalImpact > 0 ? '+' : ''}{plant.environmentalImpact}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => upgradePowerPlant(plant.id)}
                      disabled={dollars < plant.level * plant.level * 10000}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      title={`Upgrade ($${formatNumber(plant.level * plant.level * 10000)})`}
                    >
                      <TrendingUp size={14} />
                    </button>
                    
                    {plant.status === 'malfunction' && (
                      <button
                        onClick={() => repairPowerPlant(plant.id)}
                        disabled={dollars < plant.level * 5000}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        title={`Repair ($${formatNumber(plant.level * 5000)})`}
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

      {/* Environmental Impact */}
      {pollution > 30 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="mr-2 text-yellow-400" />
            Environmental Alert
          </h3>
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
            <div className="text-yellow-400 font-semibold mb-2">High Pollution Detected</div>
            <div className="text-gray-300 text-sm mb-3">
              Your power plants are generating significant pollution. This increases market volatility and random event risks.
            </div>
            <div className="text-gray-400 text-sm">
              Consider investing in cleaner energy sources like solar or quantum reactors to reduce environmental impact.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerPanel;