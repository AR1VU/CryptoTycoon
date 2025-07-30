import React from 'react';
import { Terminal, Zap, Shield, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../../store';

const HackerPanel: React.FC = () => {
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
    if (num >= 1e306) return `${(num / 1e306).toFixed(2)} Centillion`;
    if (num >= 1e303) return `${(num / 1e303).toFixed(2)} Uncentillion`;
    if (num >= 1e300) return `${(num / 1e300).toFixed(2)} Novemnonagintillion`;
    if (num >= 1e297) return `${(num / 1e297).toFixed(2)} Octononagintillion`;
    if (num >= 1e294) return `${(num / 1e294).toFixed(2)} Septennonagintillion`;
    if (num >= 1e291) return `${(num / 1e291).toFixed(2)} Sexnonagintillion`;
    if (num >= 1e288) return `${(num / 1e288).toFixed(2)} Quinnonagintillion`;
    if (num >= 1e285) return `${(num / 1e285).toFixed(2)} Quattuornonagintillion`;
    if (num >= 1e282) return `${(num / 1e282).toFixed(2)} Trenonagintillion`;
    if (num >= 1e279) return `${(num / 1e279).toFixed(2)} Duononagintillion`;
    if (num >= 1e276) return `${(num / 1e276).toFixed(2)} Unnonagintillion`;
    if (num >= 1e273) return `${(num / 1e273).toFixed(2)} Nonagintillion`;
    if (num >= 1e270) return `${(num / 1e270).toFixed(2)} Novemoctogintillion`;
    if (num >= 1e267) return `${(num / 1e267).toFixed(2)} Octooctogintillion`;
    if (num >= 1e264) return `${(num / 1e264).toFixed(2)} Septenoctogintillion`;
    if (num >= 1e261) return `${(num / 1e261).toFixed(2)} Sexoctogintillion`;
    if (num >= 1e258) return `${(num / 1e258).toFixed(2)} Quinoctogintillion`;
    if (num >= 1e255) return `${(num / 1e255).toFixed(2)} Quattuoroctogintillion`;
    if (num >= 1e252) return `${(num / 1e252).toFixed(2)} Treoctogintillion`;
    if (num >= 1e249) return `${(num / 1e249).toFixed(2)} Duooctogintillion`;
    if (num >= 1e246) return `${(num / 1e246).toFixed(2)} Unoctogintillion`;
    if (num >= 1e243) return `${(num / 1e243).toFixed(2)} Octogintillion`;
    if (num >= 1e240) return `${(num / 1e240).toFixed(2)} Novemseptuagintillion`;
    if (num >= 1e237) return `${(num / 1e237).toFixed(2)} Octoseptuagintillion`;
    if (num >= 1e234) return `${(num / 1e234).toFixed(2)} Septenseptuagintillion`;
    if (num >= 1e231) return `${(num / 1e231).toFixed(2)} Sexseptuagintillion`;
    if (num >= 1e228) return `${(num / 1e228).toFixed(2)} Quinseptuagintillion`;
    if (num >= 1e225) return `${(num / 1e225).toFixed(2)} Quattuorseptuagintillion`;
    if (num >= 1e222) return `${(num / 1e222).toFixed(2)} Treseptuagintillion`;
    if (num >= 1e219) return `${(num / 1e219).toFixed(2)} Duoseptuagintillion`;
    if (num >= 1e216) return `${(num / 1e216).toFixed(2)} Unseptuagintillion`;
    if (num >= 1e213) return `${(num / 1e213).toFixed(2)} Septuagintillion`;
    if (num >= 1e210) return `${(num / 1e210).toFixed(2)} Novemsexagintillion`;
    if (num >= 1e207) return `${(num / 1e207).toFixed(2)} Octosexagintillion`;
    if (num >= 1e204) return `${(num / 1e204).toFixed(2)} Septensexagintillion`;
    if (num >= 1e201) return `${(num / 1e201).toFixed(2)} Sexsexagintillion`;
    if (num >= 1e198) return `${(num / 1e198).toFixed(2)} Quinsexagintillion`;
    if (num >= 1e195) return `${(num / 1e195).toFixed(2)} Quattuorsexagintillion`;
    if (num >= 1e192) return `${(num / 1e192).toFixed(2)} Tresexagintillion`;
    if (num >= 1e189) return `${(num / 1e189).toFixed(2)} Duosexagintillion`;
    if (num >= 1e186) return `${(num / 1e186).toFixed(2)} Unsexagintillion`;
    if (num >= 1e183) return `${(num / 1e183).toFixed(2)} Sexagintillion`;
    if (num >= 1e180) return `${(num / 1e180).toFixed(2)} Novemquinquagintillion`;
    if (num >= 1e177) return `${(num / 1e177).toFixed(2)} Octoquinquagintillion`;
    if (num >= 1e174) return `${(num / 1e174).toFixed(2)} Septenquinquagintillion`;
    if (num >= 1e171) return `${(num / 1e171).toFixed(2)} Sexquinquagintillion`;
    if (num >= 1e168) return `${(num / 1e168).toFixed(2)} Quinquinquagintillion`;
    if (num >= 1e165) return `${(num / 1e165).toFixed(2)} Quattuorquinquagintillion`;
    if (num >= 1e162) return `${(num / 1e162).toFixed(2)} Trequinquagintillion`;
    if (num >= 1e159) return `${(num / 1e159).toFixed(2)} Duoquinquagintillion`;
    if (num >= 1e156) return `${(num / 1e156).toFixed(2)} Unquinquagintillion`;
    if (num >= 1e153) return `${(num / 1e153).toFixed(2)} Quinquagintillion`;
    if (num >= 1e150) return `${(num / 1e150).toFixed(2)} Novemquadragintillion`;
    if (num >= 1e147) return `${(num / 1e147).toFixed(2)} Octoquadragintillion`;
    if (num >= 1e144) return `${(num / 1e144).toFixed(2)} Septenquadragintillion`;
    if (num >= 1e141) return `${(num / 1e141).toFixed(2)} Sexquadragintillion`;
    if (num >= 1e138) return `${(num / 1e138).toFixed(2)} Quinquadragintillion`;
    if (num >= 1e135) return `${(num / 1e135).toFixed(2)} Quattuorquadragintillion`;
    if (num >= 1e132) return `${(num / 1e132).toFixed(2)} Trequadragintillion`;
    if (num >= 1e129) return `${(num / 1e129).toFixed(2)} Duoquadragintillion`;
    if (num >= 1e126) return `${(num / 1e126).toFixed(2)} Unquadragintillion`;
    if (num >= 1e123) return `${(num / 1e123).toFixed(2)} Quadragintillion`;
    if (num >= 1e120) return `${(num / 1e120).toFixed(2)} Novemtrigintillion`;
    if (num >= 1e117) return `${(num / 1e117).toFixed(2)} Octotrigintillion`;
    if (num >= 1e114) return `${(num / 1e114).toFixed(2)} Septentrigintillion`;
    if (num >= 1e111) return `${(num / 1e111).toFixed(2)} Sextrigintillion`;
    if (num >= 1e108) return `${(num / 1e108).toFixed(2)} Quintrigintillion`;
    if (num >= 1e105) return `${(num / 1e105).toFixed(2)} Quattuortrigintillion`;
    if (num >= 1e102) return `${(num / 1e102).toFixed(2)} Tretrigintillion`;
    if (num >= 1e99) return `${(num / 1e99).toFixed(2)} Duotrigintillion`;
    if (num >= 1e96) return `${(num / 1e96).toFixed(2)} Untrigintillion`;
    if (num >= 1e93) return `${(num / 1e93).toFixed(2)} Trigintillion`;
    if (num >= 1e90) return `${(num / 1e90).toFixed(2)} Novemvigintillion`;
    if (num >= 1e87) return `${(num / 1e87).toFixed(2)} Octovigintillion`;
    if (num >= 1e84) return `${(num / 1e84).toFixed(2)} Septenvigintillion`;
    if (num >= 1e81) return `${(num / 1e81).toFixed(2)} Sexvigintillion`;
    if (num >= 1e78) return `${(num / 1e78).toFixed(2)} Quinvigintillion`;
    if (num >= 1e75) return `${(num / 1e75).toFixed(2)} Quattuorvigintillion`;
    if (num >= 1e72) return `${(num / 1e72).toFixed(2)} Trevigintillion`;
    if (num >= 1e69) return `${(num / 1e69).toFixed(2)} Duovigintillion`;
    if (num >= 1e66) return `${(num / 1e66).toFixed(2)} Unvigintillion`;
    if (num >= 1e63) return `${(num / 1e63).toFixed(2)} Vigintillion`;
    if (num >= 1e60) return `${(num / 1e60).toFixed(2)} Novemdecillion`;
    if (num >= 1e57) return `${(num / 1e57).toFixed(2)} Octodecillion`;
    if (num >= 1e54) return `${(num / 1e54).toFixed(2)} Septendecillion`;
    if (num >= 1e51) return `${(num / 1e51).toFixed(2)} Sexdecillion`;
    if (num >= 1e48) return `${(num / 1e48).toFixed(2)} Quindecillion`;
    if (num >= 1e45) return `${(num / 1e45).toFixed(2)} Quattuordecillion`;
    if (num >= 1e42) return `${(num / 1e42).toFixed(2)} Tredecillion`;
    if (num >= 1e39) return `${(num / 1e39).toFixed(2)} Duodecillion`;
    if (num >= 1e36) return `${(num / 1e36).toFixed(2)} Undecillion`;
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
      {/* Hacker Header */}
      <div className="bg-gray-900 border border-green-500 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Terminal className="mr-3 text-green-400" />
          <h2 className="text-2xl font-bold text-white font-mono">H4CK3R T3RM1N4L</h2>
          <div className="ml-auto text-xs text-green-400 animate-pulse font-mono">
            &gt; SYSTEM_BREACH_ACTIVE
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-green-600">
            <div className="text-gray-400 text-sm font-mono">REPUTATION</div>
            <div className={`text-2xl font-bold font-mono ${getReputationColor()}`}>
              {reputation}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {reputation > 100 ? 'LEGENDARY' : 
               reputation > 50 ? 'ELITE' : 
               reputation > 0 ? 'SKILLED' : 
               reputation > -50 ? 'AMATEUR' : 'BLACKLISTED'}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-blue-600">
            <div className="text-gray-400 text-sm font-mono">TOOLS_LVL</div>
            <div className="text-2xl font-bold text-blue-400 font-mono">
              {hackingToolsLevel}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Upgrade Cost: ${formatNumber(hackingToolsLevel * hackingToolsLevel * 5000)}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-yellow-600">
            <div className="text-gray-400 text-sm font-mono">FUNDS</div>
            <div className="text-2xl font-bold text-yellow-400 font-mono">
              ${formatNumber(dollars)}
            </div>
          </div>
        </div>
      </div>

      {/* Active Mission */}
      {activeMission && (
        <div className="bg-gray-800 border border-red-500 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4 font-mono flex items-center">
            <Zap className="mr-2 text-red-400" />
            ACTIVE_MISSION: {activeMission.name.toUpperCase()}
          </h3>
          
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <div className="text-green-400 font-mono text-sm mb-2">
              &gt; {activeMission.description}
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 font-mono">PROGRESS:</span>
              <span className="text-white font-mono">{activeMission.progress.toFixed(1)}%</span>
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
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-mono transition-colors"
            >
              EXECUTE_HACK
            </button>
            <button
              onClick={completeCurrentMission}
              disabled={activeMission.progress < 100}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-mono transition-colors disabled:cursor-not-allowed"
            >
              COMPLETE_MISSION
            </button>
          </div>
        </div>
      )}

      {/* Available Missions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">AVAILABLE_MISSIONS</h3>
        
        <div className="space-y-4">
          {hackingMissions.map((mission) => {
            const isActive = mission.id === currentMission;
            const onCooldown = mission.cooldown > 0;
            const canStart = !isActive && !onCooldown && !currentMission;
            
            return (
              <div key={mission.id} className={`bg-gray-700 rounded-lg p-4 border ${
                isActive ? 'border-red-500' : canStart ? 'border-gray-600' : 'border-gray-800'
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
                      &gt; {mission.description}
                    </p>
                  </div>
                  <div className="text-red-400 text-lg">
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
                  className={`w-full mt-4 py-2 px-4 rounded-lg font-mono font-medium transition-colors ${
                    canStart
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isActive ? 'MISSION_ACTIVE' :
                   onCooldown ? 'ON_COOLDOWN' :
                   currentMission ? 'COMPLETE_CURRENT_FIRST' : 'START_MISSION'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hacking Tools */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono flex items-center">
          <Shield className="mr-2" />
          HACKING_TOOLS
        </h3>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white font-mono">CURRENT_LEVEL: {hackingToolsLevel}</div>
              <div className="text-gray-400 text-sm font-mono">
                Mission speed: +{hackingToolsLevel * 10}% per tick
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
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-mono font-medium transition-colors disabled:cursor-not-allowed"
          >
            UPGRADE_TOOLS
          </button>
        </div>
      </div>

      {/* Reputation Building */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">REPUTATION_BUILDING</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3 font-mono">🎯 COMPLETE_MISSIONS</h4>
            <p className="text-sm text-gray-400 mb-3 font-mono">
              &gt; Successfully completing hacking missions increases reputation
            </p>
            <div className="text-green-400 text-sm font-mono">
              REWARD: +10 reputation per success
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3 font-mono">💰 DONATE_TO_UNDERGROUND</h4>
            <p className="text-sm text-gray-400 mb-3 font-mono">
              &gt; Fund underground operations to gain respect
            </p>
            <button
              onClick={donateToUnderground}
              disabled={dollars < 5000}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-mono text-sm transition-colors disabled:cursor-not-allowed"
            >
              DONATE_$5000 (+5_REP)
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 font-mono">SYSTEM_STATUS</h3>
        
        <div className="bg-black rounded-lg p-4 font-mono text-sm">
          <div className="text-green-400 mb-2">&gt; Initializing hacker terminal...</div>
          <div className="text-green-400 mb-2">&gt; Loading encryption protocols...</div>
          <div className="text-green-400 mb-2">&gt; Establishing secure connection...</div>
          <div className="text-yellow-400 mb-2">&gt; WARNING: All activities monitored</div>
          <div className="text-red-400 mb-2">&gt; RISK_LEVEL: {riskMeter.toFixed(1)}%</div>
          <div className="text-green-400">&gt; System ready. Welcome, hacker.</div>
        </div>
      </div>
    </div>
  );
};

export default HackerPanel;