import React from 'react';
import { Terminal, Zap, Shield, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../../store';

const MEVPanel: React.FC = () => {
  const {
    dollars,
    reputation,
    riskMeter,
    hackingMissions,
    currentMission,
    hackingToolsLevel,
    startMission,
    progressMission,
    completeCurrentMission,
    upgradeHackingTools,
    donateToUnderground
  } = useGameStore();

  const formatNumber = (num: number): string => {
    if (num >= 1e18) return `${(num / 1e18).toFixed(2)} Quintillion`;
    if (num >= 1e15) return `${(num / 1e15).toFixed(2)} Quadrillion`;
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)} Trillion`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)} Billion`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)} Million`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getReputationColor = () => {
    if (reputation > 100) return 'text-purple-400';
    if (reputation > 50) return 'text-blue-400';
    if (reputation > 0) return 'text-green-400';
    if (reputation > -50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const activeMission = hackingMissions.find(m => m.id === currentMission);

  return (
    <div className="space-y-6">
      {/* MEV Header */}
      <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border border-orange-500/30 rounded-lg p-6 backdrop-blur-md neon-glow">
        <div className="flex items-center mb-4">
          <Terminal className="mr-3 text-orange-400" />
          <h2 className="text-2xl font-bold text-white font-mono">MEV EXTRACTION TERMINAL</h2>
          <div className="ml-auto text-xs text-orange-400 animate-pulse font-mono">
            {'>'} MEMPOOL_ACTIVE
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/40 border border-orange-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-orange-400 text-sm font-mono">REPUTATION</div>
            <div className={`text-2xl font-bold font-mono ${getReputationColor()} neon-text`}>
              {reputation}
            </div>
            <div className="text-xs text-gray-500 mt-1 font-mono">
              {reputation > 100 ? 'LEGENDARY' : 
               reputation > 50 ? 'ELITE' : 
               reputation > 0 ? 'SKILLED' : 
               reputation > -50 ? 'AMATEUR' : 'BLACKLISTED'}
            </div>
          </div>
          
          <div className="bg-black/40 border border-blue-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-blue-400 text-sm font-mono">TOOLS_LVL</div>
            <div className="text-2xl font-bold text-blue-400 font-mono neon-text">
              {hackingToolsLevel}
            </div>
            <div className="text-xs text-gray-500 mt-1 font-mono">
              Upgrade Cost: ${formatNumber(hackingToolsLevel * hackingToolsLevel * 5000)}
            </div>
          </div>
          
          <div className="bg-black/40 border border-yellow-500 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-yellow-400 text-sm font-mono">FUNDS</div>
            <div className="text-2xl font-bold text-yellow-400 font-mono neon-text">
              ${formatNumber(dollars)}
            </div>
          </div>
        </div>
      </div>

      {/* Active MEV Operation */}
      {activeMission && (
        <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 border border-red-500/30 rounded-lg p-6 backdrop-blur-md">
          <h3 className="text-xl font-semibold text-white mb-4 font-mono flex items-center">
            <Zap className="mr-2 text-red-400" />
            ACTIVE_MEV_OPERATION: {activeMission.name.toUpperCase()}
          </h3>
          
          <div className="bg-black/50 border border-red-500/30 rounded-lg p-4 mb-4 backdrop-blur-sm">
            <div className="text-green-400 font-mono text-sm mb-2">
              {'>'} {activeMission.description}
            </div>
            <div className="flex items-center justify-between mb-3 font-mono">
              <span className="text-gray-400">PROGRESS:</span>
              <span className="text-white">{activeMission.progress.toFixed(1)}%</span>
            </div>
            <div className="bg-gray-700 rounded-full h-3">
              <div
                className="bg-red-500 h-3 rounded-full transition-all animate-pulse"
                style={{ width: `${activeMission.progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={progressMission}
              className="bg-red-600/80 hover:bg-red-700/80 text-white px-4 py-2 rounded-lg font-mono transition-all border border-red-500/30"
            >
              EXECUTE_MEV
            </button>
            <button
              onClick={completeCurrentMission}
              disabled={activeMission.progress < 100}
              className="bg-green-600/80 hover:bg-green-700/80 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-mono transition-all disabled:cursor-not-allowed border border-green-500/30"
            >
              COMPLETE_OPERATION
            </button>
          </div>
        </div>
      )}

      {/* Available MEV Operations */}
      <div className="bg-gradient-to-br from-gray-900/50 to-orange-900/50 border border-orange-500/30 rounded-lg p-6 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">AVAILABLE_MEV_OPERATIONS</h3>
        
        <div className="space-y-4">
          {hackingMissions.map((mission) => {
            const isActive = mission.id === currentMission;
            const onCooldown = mission.cooldown > 0;
            const canStart = !isActive && !onCooldown && !currentMission;
            
            return (
              <div key={mission.id} className={`bg-black/40 rounded-lg p-4 border backdrop-blur-sm ${
                isActive ? 'border-red-500/30' : canStart ? 'border-orange-500/30' : 'border-gray-800/30'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-semibold font-mono ${
                      isActive ? 'text-red-400' : canStart ? 'text-white' : 'text-gray-500'
                    }`}>
                      {mission.name.toUpperCase()}
                      {isActive && <span className="ml-2 text-xs bg-red-600 px-2 py-1 rounded">ACTIVE</span>}
                      {onCooldown && <span className="ml-2 text-xs bg-yellow-600 px-2 py-1 rounded">COOLDOWN</span>}
                    </h4>
                    <p className={`text-sm mt-1 font-mono ${
                      canStart ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {'>'} {mission.description}
                    </p>
                  </div>
                  <div className="text-orange-400 text-lg">
                    💀
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm font-mono">
                  <div>
                    <span className="text-gray-400">DIFFICULTY:</span>
                    <div className="text-red-400">{'★'.repeat(mission.difficulty)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">REWARD:</span>
                    <div className="text-green-400">${formatNumber(mission.reward)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">RISK:</span>
                    <div className="text-yellow-400">+{mission.riskIncrease}%</div>
                  </div>
                  <div>
                    <span className="text-gray-400">COOLDOWN:</span>
                    <div className="text-blue-400">
                      {onCooldown ? `${Math.ceil(mission.cooldown / 60000)}m` : 'Ready'}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => startMission(mission.id)}
                  disabled={!canStart}
                  className={`w-full mt-4 py-2 px-4 rounded-lg font-mono font-medium transition-all ${
                    canStart
                      ? 'bg-red-600/80 hover:bg-red-700/80 text-white border border-red-500/30'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isActive ? 'OPERATION_ACTIVE' :
                   onCooldown ? 'ON_COOLDOWN' :
                   currentMission ? 'COMPLETE_CURRENT_FIRST' : 'START_OPERATION'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* MEV Tools */}
      <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-lg p-6 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono flex items-center">
          <Shield className="mr-2" />
          MEV_TOOLS
        </h3>
        
        <div className="bg-black/40 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white font-mono">CURRENT_LEVEL: {hackingToolsLevel}</div>
              <div className="text-gray-400 text-sm font-mono">
                Operation speed: +{hackingToolsLevel * 10}% per tick
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 font-mono">
                UPGRADE_COST: ${formatNumber(hackingToolsLevel * hackingToolsLevel * 5000)}
              </div>
            </div>
          </div>
          
          <button
            onClick={upgradeHackingTools}
            disabled={dollars < hackingToolsLevel * hackingToolsLevel * 5000}
            className="w-full web3-button text-white py-2 px-4 rounded-lg font-mono font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            UPGRADE_TOOLS
          </button>
        </div>
      </div>

      {/* Reputation Building */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-6 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">REPUTATION_BUILDING</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/40 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-semibold text-white mb-3 font-mono">🎯 COMPLETE_OPERATIONS</h4>
            <p className="text-sm text-gray-400 mb-3 font-mono">
              {'>'} Successfully completing MEV operations increases reputation
            </p>
            <div className="text-green-400 text-sm font-mono">
              REWARD: +10 reputation per success
            </div>
          </div>
          
          <div className="bg-black/40 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-semibold text-white mb-3 font-mono">💰 FUND_UNDERGROUND</h4>
            <p className="text-sm text-gray-400 mb-3 font-mono">
              {'>'} Fund underground operations to gain respect
            </p>
            <button
              onClick={donateToUnderground}
              disabled={dollars < 5000}
              className="w-full bg-purple-600/80 hover:bg-purple-700/80 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-mono text-sm transition-all disabled:cursor-not-allowed border border-purple-500/30"
            >
              DONATE_$5000 (+5_REP)
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-br from-black/50 to-gray-900/50 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">SYSTEM_STATUS</h3>
        
        <div className="bg-black/80 border border-cyan-500/20 rounded-lg p-4 font-mono text-sm backdrop-blur-sm">
          <div className="text-green-400 mb-2">{'>'} Initializing MEV extraction terminal...</div>
          <div className="text-green-400 mb-2">{'>'} Loading mempool monitoring protocols...</div>
          <div className="text-green-400 mb-2">{'>'} Establishing sandwich attack vectors...</div>
          <div className="text-yellow-400 mb-2">{'>'} WARNING: All MEV activities monitored</div>
          <div className="text-red-400 mb-2">{'>'} RISK_LEVEL: {riskMeter.toFixed(1)}%</div>
          <div className="text-green-400">{'>'} System ready. Welcome, MEV searcher.</div>
        </div>
      </div>
    </div>
  );
};

export default MEVPanel;