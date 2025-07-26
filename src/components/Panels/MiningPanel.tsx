import React, { useState } from 'react';
import { Cpu, Zap, Wrench, TrendingUp, Settings } from 'lucide-react';
import { useGameStore } from '../../store';

const MiningPanel: React.FC = () => {
  const { 
    coins,
    miners,
    miningPools,
    clickPower,
    clickMine,
    buyMiner,
    upgradeMiner,
    repairMiner,
    assignMinerToPool
  } = useGameStore();
  
  const [selectedMiner, setSelectedMiner] = useState<string | null>(null);

  const minerTypes = [
    { type: 'cpu' as const, name: 'CPU Miner', baseCost: 10, icon: '🖥️' },
    { type: 'gpu' as const, name: 'GPU Miner', baseCost: 100, icon: '🎮' },
    { type: 'asic' as const, name: 'ASIC Miner', baseCost: 1000, icon: '⚡' },
    { type: 'quantum' as const, name: 'Quantum Miner', baseCost: 10000, icon: '🌌' }
  ];

  const getMinerCost = (type: string, count: number) => {
    const baseConfig = minerTypes.find(m => m.type === type);
    if (!baseConfig) return 0;
    return baseConfig.baseCost * Math.pow(1.5, count);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400';
      case 'overheating': return 'text-yellow-400';
      case 'broken': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mining Header */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Cpu className="mr-3 text-yellow-400" />
            Mining Operations
          </h2>
          <button
            onClick={clickMine}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors transform hover:scale-105 active:scale-95"
          >
            ⛏️ Mine BitBux (+{clickPower})
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Total Miners</div>
            <div className="text-2xl font-bold text-white">{miners.length}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Operational</div>
            <div className="text-2xl font-bold text-green-400">
              {miners.filter(m => m.status === 'operational').length}
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Total Hash Rate</div>
            <div className="text-2xl font-bold text-purple-400">
              {formatNumber(miners.reduce((sum, m) => m.status === 'operational' ? sum + m.speed : sum, 0))} TH/s
            </div>
          </div>
        </div>
      </div>

      {/* Buy Miners */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Purchase Miners</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {minerTypes.map((minerType) => {
            const count = miners.filter(m => m.type === minerType.type).length;
            const cost = getMinerCost(minerType.type, count);
            const canAfford = coins >= cost;
            
            return (
              <div key={minerType.type} className="bg-gray-700 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{minerType.icon}</div>
                  <h4 className="font-semibold text-white">{minerType.name}</h4>
                  <div className="text-gray-400 text-sm">Owned: {count}</div>
                </div>
                <button
                  onClick={() => buyMiner(minerType.type)}
                  disabled={!canAfford}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                    canAfford
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Buy - {formatNumber(cost)} BB
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mining Rig Visualization */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Mining Rig Layout</h3>
        <div className="bg-gray-900 rounded-lg p-4 min-h-64">
          <svg viewBox="0 0 400 300" className="w-full h-64">
            {miners.map((miner, index) => {
              const x = (index % 8) * 45 + 20;
              const y = Math.floor(index / 8) * 60 + 30;
              const color = miner.status === 'operational' ? '#10b981' : 
                           miner.status === 'overheating' ? '#f59e0b' : '#ef4444';
              
              return (
                <g key={miner.id}>
                  <rect
                    x={x}
                    y={y}
                    width={35}
                    height={25}
                    fill={color}
                    stroke="#374151"
                    strokeWidth="1"
                    rx="3"
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedMiner(miner.id)}
                  />
                  <text
                    x={x + 17.5}
                    y={y + 16}
                    textAnchor="middle"
                    fill="white"
                    fontSize="8"
                    className="pointer-events-none"
                  >
                    {miner.type.toUpperCase()}
                  </text>
                  {miner.status !== 'operational' && (
                    <circle
                      cx={x + 30}
                      cy={y + 5}
                      r="3"
                      fill="#ef4444"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Miner Management */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Miner Management</h3>
        {miners.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No miners purchased yet. Buy your first miner above!
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {miners.map((miner) => (
              <div key={miner.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {minerTypes.find(t => t.type === miner.type)?.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {miner.type.toUpperCase()} Miner (Level {miner.level})
                      </div>
                      <div className="text-sm text-gray-400">
                        Speed: {formatNumber(miner.speed)} TH/s | 
                        Efficiency: {(miner.efficiency * 100).toFixed(1)}% |
                        Pool: {miner.assignedPool}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Status: </span>
                        <span className={getStatusColor(miner.status)}>
                          {miner.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="bg-gray-600 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${(miner.currentDurability / miner.durability) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={miner.assignedPool}
                      onChange={(e) => assignMinerToPool(miner.id, e.target.value)}
                      className="bg-gray-600 text-white rounded px-2 py-1 text-sm"
                    >
                      {miningPools.map(pool => (
                        <option key={pool} value={pool}>{pool}</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => upgradeMiner(miner.id)}
                      disabled={coins < miner.level * 50}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      title={`Upgrade (${miner.level * 50} BB)`}
                    >
                      <TrendingUp size={14} />
                    </button>
                    
                    {miner.status === 'broken' && (
                      <button
                        onClick={() => repairMiner(miner.id)}
                        disabled={coins < miner.level * 25}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        title={`Repair (${miner.level * 25} BB)`}
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
    </div>
  );
};

export default MiningPanel;