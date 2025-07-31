import React, { useState } from 'react';
import { Shield, Zap, Wrench, TrendingUp, Settings } from 'lucide-react';
import { useGameStore } from '../../store';
import { formatNumber, formatCurrency } from '../../utils/formatters';

const ValidatorPanel: React.FC = () => {
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
  
  const [selectedValidator, setSelectedValidator] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState<string>('');

  const validatorTypes = [
    { type: 'cpu' as const, name: 'Light Validator', baseCost: 50, icon: '🔷', description: 'Basic PoS validator node' },
    { type: 'gpu' as const, name: 'Full Validator', baseCost: 500, icon: '💎', description: 'Enhanced validation power' },
    { type: 'asic' as const, name: 'Super Validator', baseCost: 5000, icon: '⚡', description: 'High-performance validator' },
    { type: 'quantum' as const, name: 'Quantum Validator', baseCost: 50000, icon: '🌌', description: 'Next-gen quantum validation' }
  ];

  const getValidatorCost = (type: string, count: number) => {
    const baseConfig = validatorTypes.find(m => m.type === type);
    if (!baseConfig) return 0;
    const costInETH = baseConfig.baseCost * Math.pow(2, count);
    return costInETH * marketPrice;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400';
      case 'overheating': return 'text-yellow-400';
      case 'broken': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    if (!isNaN(amount) && amount > 0 && amount <= bitbux) {
      convertBitBuxToDollars(amount);
      setStakeAmount('');
    }
  };

  const getStakingCooldown = () => {
    if (!lastClickMine) return 0;
    const cooldown = 60000 / clickPower;
    const elapsed = Date.now() - lastClickMine;
    return Math.max(0, cooldown - elapsed);
  };

  const canStake = getStakingCooldown() === 0;
  const cooldownSeconds = Math.ceil(getStakingCooldown() / 1000);

  return (
    <div className="space-y-6">
      {/* Validator Header */}
      <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-md neon-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center font-mono">
            <Shield className="mr-3 text-cyan-400" />
            Validator Network
          </h2>
          <div className="text-right">
            <button
              onClick={clickMine}
              disabled={!canStake}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all transform web3-button ${
                canStake 
                  ? 'text-white hover:scale-105 active:scale-95 neon-glow'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {canStake ? `⟐ Stake ETH (+${clickPower})` : `⏱️ Cooldown: ${cooldownSeconds}s`}
            </button>
            <div className="text-sm text-cyan-400 mt-2 font-mono">
              Staking Speed: {(60 / clickPower).toFixed(1)}s per stake
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/40 border border-cyan-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-cyan-400 text-sm font-mono">ETH Balance</div>
            <div className="text-2xl font-bold text-cyan-400 neon-text">{formatNumber(bitbux)} ETH</div>
          </div>
          <div className="bg-black/40 border border-green-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-green-400 text-sm font-mono">USDC Balance</div>
            <div className="text-2xl font-bold text-green-400">${formatNumber(dollars)}</div>
          </div>
          <div className="bg-black/40 border border-purple-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-purple-400 text-sm font-mono">Active Validators</div>
            <div className="text-2xl font-bold text-white">{miners.length}</div>
          </div>
        </div>
        
        {/* Staking Power Upgrade */}
        <div className="mt-4 bg-black/40 border border-purple-500 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold font-mono">Upgrade Staking Power</h4>
              <div className="text-sm text-purple-400 font-mono">
                Current Level: {clickPower} | Next: {(60 / (clickPower + 1)).toFixed(1)}s per stake
              </div>
            </div>
            <button
              onClick={upgradeClickPower}
              disabled={dollars < clickPower * 1000}
              className="web3-button text-white px-4 py-2 rounded font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              Upgrade - ${formatNumber(clickPower * 1000)}
            </button>
          </div>
        </div>
        
        {/* ETH to USDC Converter */}
        <div className="mt-4 bg-black/40 border border-yellow-500 rounded-lg p-4 backdrop-blur-sm">
          <h4 className="text-white font-semibold mb-3 font-mono">Convert ETH to USDC</h4>
          <div className="flex space-x-3">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Amount in ETH"
              className="flex-1 bg-gray-800/50 border border-cyan-500/30 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              max={bitbux}
            />
            <button
              onClick={() => setStakeAmount(bitbux.toString())}
              className="bg-gray-700/50 hover:bg-gray-600/50 text-cyan-400 px-3 py-2 rounded text-sm border border-cyan-500/30"
            >
              Max
            </button>
            <button
              onClick={handleStake}
              disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > bitbux}
              className="web3-button text-white px-4 py-2 rounded font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              Convert
            </button>
          </div>
          {stakeAmount && parseFloat(stakeAmount) > 0 && (
            <div className="text-sm text-cyan-400 mt-2 font-mono">
              Will receive: ${formatNumber(parseFloat(stakeAmount) * marketPrice * 0.99)} USDC (1% fee)
            </div>
          )}
        </div>
      </div>

      {/* Buy Validators */}
      <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/50 border border-purple-500/30 rounded-lg p-6 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">Deploy Validators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {validatorTypes.map((validatorType) => {
            const count = miners.filter(m => m.type === validatorType.type).length;
            const cost = getValidatorCost(validatorType.type, count);
            const canAfford = dollars >= cost;
            
            return (
              <div key={validatorType.type} className="bg-black/40 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm hover:border-cyan-400/50 transition-all">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{validatorType.icon}</div>
                  <h4 className="font-semibold text-white font-mono">{validatorType.name}</h4>
                  <div className="text-cyan-400 text-xs mb-2 font-mono">{validatorType.description}</div>
                  <div className="text-gray-400 text-sm font-mono">Deployed: {count}</div>
                </div>
                <button
                  onClick={() => buyMiner(validatorType.type)}
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

      {/* Validator Network Visualization */}
      <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500/30 rounded-lg p-6 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">Network Topology</h3>
        <div className="bg-black/50 rounded-lg p-4 min-h-64 border border-cyan-500/20">
          <svg viewBox="0 0 400 300" className="w-full h-64">
            {miners.map((validator, index) => {
              const x = (index % 8) * 45 + 20;
              const y = Math.floor(index / 8) * 60 + 30;
              const color = validator.status === 'operational' ? '#00d4ff' : 
                           validator.status === 'overheating' ? '#f59e0b' : '#ef4444';
              
              return (
                <g key={validator.id}>
                  <circle
                    cx={x + 17.5}
                    cy={y + 12.5}
                    r="15"
                    fill={color}
                    stroke="#374151"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-80 transition-all"
                    onClick={() => setSelectedValidator(validator.id)}
                  />
                  <text
                    x={x + 17.5}
                    y={y + 16}
                    textAnchor="middle"
                    fill="white"
                    fontSize="6"
                    className="pointer-events-none font-mono"
                  >
                    {validator.type.toUpperCase()}
                  </text>
                  {validator.status !== 'operational' && (
                    <circle
                      cx={x + 30}
                      cy={y + 5}
                      r="3"
                      fill="#ef4444"
                      className="animate-pulse"
                    />
                  )}
                  {/* Connection lines */}
                  {index > 0 && (
                    <line
                      x1={x + 17.5}
                      y1={y + 12.5}
                      x2={((index - 1) % 8) * 45 + 37.5}
                      y2={Math.floor((index - 1) / 8) * 60 + 42.5}
                      stroke="rgba(0, 212, 255, 0.3)"
                      strokeWidth="1"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Validator Management */}
      <div className="bg-gradient-to-br from-gray-900/50 to-blue-900/50 border border-blue-500/30 rounded-lg p-6 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">Validator Management</h3>
        {miners.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔷</div>
            <div className="text-gray-400 font-mono">No validators deployed yet.</div>
            <div className="text-cyan-400 text-sm mt-2 font-mono">Deploy your first validator above to start earning rewards!</div>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {miners.map((validator) => (
              <div key={validator.id} className="bg-black/40 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {validatorTypes.find(t => t.type === validator.type)?.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-white font-mono">
                        {validator.type.toUpperCase()} Validator (Level {validator.level})
                      </div>
                      <div className="text-sm text-cyan-400 font-mono">
                        Speed: {formatNumber(validator.speed)} TPS | 
                        Efficiency: {(validator.efficiency * 100).toFixed(1)}% |
                        Pool: {validator.assignedPool}
                      </div>
                      <div className="text-sm font-mono">
                        <span className="text-gray-400">Status: </span>
                        <span className={getStatusColor(validator.status)}>
                          {validator.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full transition-all"
                          style={{ width: `${(validator.currentDurability / validator.durability) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={validator.assignedPool}
                      onChange={(e) => assignMinerToPool(validator.id, e.target.value)}
                      className="bg-gray-800/50 border border-cyan-500/30 text-white rounded px-2 py-1 text-sm font-mono"
                    >
                      {miningPools.map(pool => (
                        <option key={pool} value={pool}>{pool}</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => upgradeMiner(validator.id)}
                      disabled={dollars < validator.level * validator.level * 500}
                      className="bg-green-600/80 hover:bg-green-700/80 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-all border border-green-500/30"
                      title={`Upgrade ($${formatNumber(validator.level * validator.level * 500)})`}
                    >
                      <TrendingUp size={14} />
                    </button>
                    
                    {validator.status === 'broken' && (
                      <button
                        onClick={() => repairMiner(validator.id)}
                        disabled={dollars < validator.level * 250}
                        className="bg-red-600/80 hover:bg-red-700/80 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-all border border-red-500/30"
                        title={`Repair ($${formatNumber(validator.level * 250)})`}
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

export default ValidatorPanel;