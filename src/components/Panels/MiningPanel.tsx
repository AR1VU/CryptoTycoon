import React, { useState } from 'react';
import { Cpu, Zap, Wrench, TrendingUp, Settings } from 'lucide-react';
import { useGameStore } from '../../store';
import { formatNumber, formatCurrency } from '../../utils/formatters';

const MiningPanel: React.FC = () => {
  const { 
    dollars,
    bitbux,
    marketPrice,
    miners,
    miningPools,
    clickPower,
    lastClickMine,
    clickMine,
    buyMiner,
    upgradeMiner,
    repairMiner,
    assignMinerToPool,
    upgradeClickPower,
    convertBitBuxToDollars
  } = useGameStore();
  
  const [selectedMiner, setSelectedMiner] = useState<string | null>(null);
  const [convertAmount, setConvertAmount] = useState<string>('');

  const minerTypes = [
    { type: 'cpu' as const, name: 'CPU Miner', baseCost: 50, icon: '🖥️' },
    { type: 'gpu' as const, name: 'GPU Miner', baseCost: 500, icon: '🎮' },
    { type: 'asic' as const, name: 'ASIC Miner', baseCost: 5000, icon: '⚡' },
    { type: 'quantum' as const, name: 'Quantum Miner', baseCost: 50000, icon: '🌌' }
  ];

  const getMinerCost = (type: string, count: number) => {
    const baseConfig = minerTypes.find(m => m.type === type);
    if (!baseConfig) return 0;
    const costInBitBux = baseConfig.baseCost * Math.pow(2, count); // Exponential scaling
    return costInBitBux * marketPrice; // Convert to dollars
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400';
      case 'overheating': return 'text-yellow-400';
      case 'broken': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleConvert = () => {
    const amount = parseFloat(convertAmount);
    if (!isNaN(amount) && amount > 0 && amount <= bitbux) {
      convertBitBuxToDollars(amount);
      setConvertAmount('');
    }
  };

  const getMiningCooldown = () => {
    if (!lastClickMine) return 0;
    const cooldown = 60000 / clickPower; // 60 seconds divided by click power
    const elapsed = Date.now() - lastClickMine;
    return Math.max(0, cooldown - elapsed);
  };

  const canMine = getMiningCooldown() === 0;
  const cooldownSeconds = Math.ceil(getMiningCooldown() / 1000);

  return (
    <div className="space-y-6">
      {/* Mining Header */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Cpu className="mr-3 text-yellow-400" />
            Mining Operations
          </h2>
          <div className="text-right">
            <button
              onClick={clickMine}
              disabled={!canMine}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-colors transform ${
                canMine 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white hover:scale-105 active:scale-95'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {canMine ? `⛏️ Mine BitBux (+${clickPower})` : `⏱️ Cooldown: ${cooldownSeconds}s`}
            </button>
            <div className="text-sm text-gray-400 mt-2">
              Mining Speed: {(60 / clickPower).toFixed(1)}s per mine
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">BitBux Balance</div>
            <div className="text-2xl font-bold text-yellow-400">{formatNumber(bitbux)} BB</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Dollar Balance</div>
            <div className="text-2xl font-bold text-green-400">${formatNumber(dollars)}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Total Miners</div>
            <div className="text-2xl font-bold text-white">{miners.length}</div>
          </div>
        </div>
        
        {/* Click Power Upgrade */}
        <div className="mt-4 bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">Upgrade Mining Speed</h4>
              <div className="text-sm text-gray-400">
                Current Level: {clickPower} | Next: {(60 / (clickPower + 1)).toFixed(1)}s per mine
              </div>
            </div>
            <button
              onClick={upgradeClickPower}
              disabled={dollars < clickPower * 1000}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors disabled:cursor-not-allowed"
            >
              Upgrade - ${formatNumber(clickPower * 1000)}
            </button>
          </div>
        </div>
        
        {/* BitBux to Dollar Converter */}
        <div className="mt-4 bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3">Convert BitBux to Dollars</h4>
          <div className="flex space-x-3">
            <input
              type="number"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
              placeholder="Amount in BitBux"
              className="flex-1 bg-gray-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              max={bitbux}
            />
            <button
              onClick={() => setConvertAmount(bitbux.toString())}
              className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm"
            >
              Max
            </button>
            <button
              onClick={handleConvert}
              disabled={!convertAmount || parseFloat(convertAmount) <= 0 || parseFloat(convertAmount) > bitbux}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors disabled:cursor-not-allowed"
            >
              Convert
            </button>
          </div>
          {convertAmount && parseFloat(convertAmount) > 0 && (
            <div className="text-sm text-gray-400 mt-2">
              Will receive: ${formatNumber(parseFloat(convertAmount) * marketPrice * 0.99)} (1% fee)
            </div>
          )}
        </div>
      </div>

      {/* Buy Miners */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Purchase Miners</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {minerTypes.map((minerType) => {
            const count = miners.filter(m => m.type === minerType.type).length;
            const cost = getMinerCost(minerType.type, count);
            const canAfford = dollars >= cost;
            
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
                  Buy - ${formatNumber(cost)}
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
                      disabled={dollars < miner.level * miner.level * 500}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      title={`Upgrade ($${formatNumber(miner.level * miner.level * 500)})`}
                    >
                      <TrendingUp size={14} />
                    </button>
                    
                    {miner.status === 'broken' && (
                      <button
                        onClick={() => repairMiner(miner.id)}
                        disabled={dollars < miner.level * 250}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        title={`Repair ($${formatNumber(miner.level * 250)})`}
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