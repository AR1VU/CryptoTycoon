import React from 'react';
import { Zap, TrendingUp, Wrench, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../../store';

const PowerPanel: React.FC = () => {
  const {
    powerUsed,
    powerCapacity,
    powerPlants,
    gridEfficiency,
    pollution,
    coins,
    buyPowerPlant,
    upgradePowerPlant,
    repairPowerPlant
  } = useGameStore();

  const powerPlantTypes = [
    { 
      type: 'coal' as const, 
      name: 'Coal Power Plant', 
      baseCost: 200, 
      icon: '🏭',
      description: 'Cheap but polluting'
    },
    { 
      type: 'solar' as const, 
      name: 'Solar Farm', 
      baseCost: 500, 
      icon: '☀️',
      description: 'Clean but expensive'
    },
    { 
      type: 'nuclear' as const, 
      name: 'Nuclear Plant', 
      baseCost: 5000, 
      icon: '☢️',
      description: 'High capacity, low pollution'
    },
    { 
      type: 'quantum' as const, 
      name: 'Quantum Reactor', 
      baseCost: 50000, 
      icon: '⚛️',
      description: 'Ultimate power source'
    }
  ];

  const getPowerPlantCost = (type: string, count: number) => {
    const baseConfig = powerPlantTypes.find(p => p.type === type);
    if (!baseConfig) return 0;
    return baseConfig.baseCost * Math.pow(1.3, count);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
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
              {formatNumber(powerCapacity)} MW
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Effective: {formatNumber(effectivePowerCapacity)} MW
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Grid Efficiency</div>
            <div className="text-2xl font-bold text-yellow-400">
              {(gridEfficiency * 100).toFixed(1)}%
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
      </div>

      {/* Buy Power Plants */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Build Power Plants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {powerPlantTypes.map((plantType) => {
            const count = powerPlants.filter(p => p.type === plantType.type).length;
            const cost = getPowerPlantCost(plantType.type, count);
            const canAfford = coins >= cost;
            
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
                  Build - {formatNumber(cost)} BB
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
                        Upkeep: {formatNumber(plant.upkeep)} BB/tick
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
                      disabled={coins < plant.level * 100}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      title={`Upgrade (${plant.level * 100} BB)`}
                    >
                      <TrendingUp size={14} />
                    </button>
                    
                    {plant.status === 'malfunction' && (
                      <button
                        onClick={() => repairPowerPlant(plant.id)}
                        disabled={coins < plant.level * 75}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        title={`Repair (${plant.level * 75} BB)`}
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