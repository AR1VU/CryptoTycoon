import React from 'react';
import { Terminal, Zap, Target, Clock, TrendingUp } from 'lucide-react';
import { useGameStore } from '../../store';

const HackerPanel: React.FC = () => {
  const {
    coins,
    hackingMissions,
    currentMission,
    hackingToolsLevel,
    reputation,
    riskMeter,
    startMission,
    progressMission,
    upgradeHackingTools
  } = useGameStore();

  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-400';
    if (difficulty <= 4) return 'text-yellow-400';
    if (difficulty <= 6) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSuccessRate = (difficulty: number) => {
    const baseRate = Math.max(10, 100 - (difficulty * 15));
    const toolsBonus = hackingToolsLevel * 10;
    const repBonus = Math.min(reputation / 10, 20);
    return Math.min(95, baseRate + toolsBonus + repBonus);
  };

  const activeMission = currentMission ? hackingMissions.find(m => m.id === currentMission) : null;

  return (
    <div className="space-y-6">
      {/* Hacker Dashboard */}
      <div className="bg-gray-900 border border-green-500 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Terminal className="mr-3 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Hacker Operations</h2>
          <div className="ml-auto text-xs text-green-400 animate-pulse font-mono">
            root@tycoon:~$
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Hacking Tools</div>
            <div className="text-2xl font-bold text-green-400">
              Level {hackingToolsLevel}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              +{hackingToolsLevel * 10}% success rate
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Reputation</div>
            <div className="text-2xl font-bold text-purple-400">
              {reputation}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Underground standing
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Current Risk</div>
            <div className={`text-2xl font-bold ${
              riskMeter > 70 ? 'text-red-400' : 
              riskMeter > 40 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {riskMeter.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Detection probability
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Mission Status</div>
            <div className={`text-2xl font-bold ${
              currentMission ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {currentMission ? 'ACTIVE' : 'IDLE'}
            </div>
            {activeMission && (
              <div className="text-xs text-gray-500 mt-1">
                {activeMission.progress.toFixed(1)}% complete
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Mission */}
      {activeMission && (
        <div className="bg-gray-800 border border-yellow-500 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Target className="mr-2 text-yellow-400" />
            Active Mission: {activeMission.name}
          </h3>
          
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-medium">Mission Progress</div>
              <div className="text-yellow-400 font-mono">
                {activeMission.progress.toFixed(1)}%
              </div>
            </div>
            <div className="bg-gray-700 rounded-full h-3 mb-3">
              <div
                className="bg-gradient-to-r from-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${activeMission.progress}%` }}
              />
            </div>
            <div className="text-gray-400 text-sm">{activeMission.description}</div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={progressMission}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Zap className="mr-2" size={16} />
              Execute Next Phase
            </button>
            
            <div className="text-sm text-gray-400 flex items-center">
              <Clock className="mr-1" size={14} />
              Estimated completion: {Math.ceil((100 - activeMission.progress) / 10)} phases
            </div>
          </div>
        </div>
      )}

      {/* Available Missions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Available Missions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hackingMissions.map((mission) => {
            const successRate = getSuccessRate(mission.difficulty);
            const isOnCooldown = mission.cooldown > 0;
            const canStart = !currentMission && !isOnCooldown;
            
            return (
              <div key={mission.id} className={`bg-gray-700 rounded-lg p-4 border ${
                mission.isActive ? 'border-yellow-500' : 'border-gray-600'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white flex items-center">
                      {mission.name}
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        mission.difficulty <= 2 ? 'bg-green-900 text-green-400' :
                        mission.difficulty <= 4 ? 'bg-yellow-900 text-yellow-400' :
                        mission.difficulty <= 6 ? 'bg-orange-900 text-orange-400' :
                        'bg-red-900 text-red-400'
                      }`}>
                        Difficulty: {mission.difficulty}/10
                      </span>
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {mission.description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reward:</span>
                    <span className="text-green-400">{formatNumber(mission.reward)} BB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Success Rate:</span>
                    <span className={getDifficultyColor(mission.difficulty)}>
                      {successRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Increase:</span>
                    <span className="text-red-400">+{mission.riskIncrease}%</span>
                  </div>
                  {isOnCooldown && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cooldown:</span>
                      <span className="text-blue-400">{formatTime(mission.cooldown)}</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => startMission(mission.id)}
                  disabled={!canStart}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    canStart
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {mission.isActive ? 'In Progress' :
                   isOnCooldown ? 'On Cooldown' :
                   currentMission ? 'Mission Active' : 'Start Mission'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hacking Tools Upgrade */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="mr-2" />
          Upgrade Hacking Tools
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Current Arsenal</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tools Level:</span>
                  <span className="text-green-400">Level {hackingToolsLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Success Bonus:</span>
                  <span className="text-green-400">+{hackingToolsLevel * 10}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mission Speed:</span>
                  <span className="text-green-400">+{hackingToolsLevel * 10}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Next Level Benefits</h4>
              <div className="space-y-1 text-sm text-green-400">
                <div>• +10% mission success rate</div>
                <div>• +10% mission execution speed</div>
                <div>• Access to advanced missions</div>
                {hackingToolsLevel >= 5 && <div>• Unlock stealth mode abilities</div>}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">💻</div>
                <div className="text-lg font-semibold text-white">
                  Upgrade to Level {hackingToolsLevel + 1}
                </div>
                <div className="text-gray-400 text-sm">
                  Enhanced tools for better success rates
                </div>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-yellow-400">
                  {formatNumber(hackingToolsLevel * 1000)} BB
                </div>
                <div className="text-gray-400 text-sm">Upgrade Cost</div>
              </div>
              
              <button
                onClick={upgradeHackingTools}
                disabled={coins < hackingToolsLevel * 1000}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                {coins < hackingToolsLevel * 1000 ? 'Insufficient Funds' : 'Upgrade Tools'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hacking Guide */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Hacker's Guide</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-green-400 text-lg mb-2">🎯</div>
            <h4 className="font-semibold text-white mb-2">Mission Strategy</h4>
            <p className="text-sm text-gray-400">
              Start with low-difficulty missions to build reputation and tools. 
              Higher success rates mean less risk and more consistent rewards.
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-yellow-400 text-lg mb-2">⚠️</div>
            <h4 className="font-semibold text-white mb-2">Risk Management</h4>
            <p className="text-sm text-gray-400">
              Failed missions increase risk significantly. Monitor your risk meter 
              and consider laying low when it gets too high.
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-purple-400 text-lg mb-2">🔧</div>
            <h4 className="font-semibold text-white mb-2">Tool Upgrades</h4>
            <p className="text-sm text-gray-400">
              Investing in better tools pays off long-term. Higher-level tools 
              unlock advanced missions with better rewards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackerPanel;