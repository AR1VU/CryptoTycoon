import React from 'react';
import { useState } from 'react';
import { 
  Shield, 
  Network, 
  TrendingUp, 
  Users,
  Coins, 
  Eye, 
  Terminal,
  Save,
  RotateCcw
} from 'lucide-react';
import { useGameStore } from '../../store';
import ResetModal from '../UI/ResetModal';
import { formatNumber } from '../../utils/formatters';

interface NavigationProps {
  activePanel: string;
  setActivePanel: (panel: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activePanel, setActivePanel }) => {
  const { bitbux, dollars, marketPrice, powerUsed, powerCapacity, riskMeter, saveGame, resetGame } = useGameStore();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showArrestModal, setShowArrestModal] = useState(false);
  const [arrestPrestigePoints, setArrestPrestigePoints] = useState(0);
  
  // Listen for arrest modal trigger
  React.useEffect(() => {
    const handleArrestModal = (event: CustomEvent) => {
      setArrestPrestigePoints(event.detail.prestigePoints);
      setShowArrestModal(true);
    };
    
    window.addEventListener('showArrestModal', handleArrestModal as EventListener);
    return () => window.removeEventListener('showArrestModal', handleArrestModal as EventListener);
  }, []);
  
  const navigationItems = [
    { id: 'validator', label: 'Validators', icon: Shield, color: 'bg-cyan-600' },
    { id: 'network', label: 'Network', icon: Network, color: 'bg-blue-600' },
    { id: 'market', label: 'DEX', icon: TrendingUp, color: 'bg-green-600' },
    { id: 'dao', label: 'DAO', icon: Users, color: 'bg-purple-600' },
    { id: 'tokenlab', label: 'Token Lab', icon: Coins, color: 'bg-yellow-600' },
    { id: 'darkpool', label: 'Dark Pools', icon: Eye, color: 'bg-red-600' },
    { id: 'mev', label: 'MEV', icon: Terminal, color: 'bg-orange-600' },
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900/90 to-blue-900/90 border-b border-cyan-500/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-3 py-4">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-cyan-400 neon-text font-mono">
                ⟐ DeFi Empire ⟐
              </h1>
            </div>

            {/* Save Button */}
            <button
              onClick={saveGame}
              className="p-2 text-cyan-400 hover:text-white hover:bg-cyan-700/30 rounded-md transition-colors neon-glow"
              title="Save Game"
            >
              <Save size={16} />
            </button>

            {/* Reset Button */}
            <button
              onClick={() => setShowResetModal(true)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-md transition-colors"
              title="Reset Game"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Status Bar */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="text-green-400 font-medium">
              💰 ${formatNumber(dollars)} USDC
            </div>
            <div className="text-cyan-400 font-medium">
              ⟐ {formatNumber(bitbux)} ETH
            </div>
            <div className="text-purple-400 font-medium">
              📈 ${formatNumber(marketPrice)} /ETH
            </div>
            <div className={`font-medium ${powerUsed > powerCapacity ? 'text-red-400' : 'text-blue-400'}`}>
              ⚡ {formatNumber(powerUsed)}/{formatNumber(powerCapacity)} TPS
            </div>
            <div className={`font-medium ${riskMeter > 70 ? 'text-red-400' : riskMeter > 40 ? 'text-yellow-400' : 'text-green-400'}`}>
              🛡️ {riskMeter.toFixed(0)}% Risk
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePanel(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-all transform hover:scale-105 ${
                      activePanel === item.id
                        ? `${item.color} text-white neon-glow`
                        : 'text-gray-300 hover:bg-cyan-700/30 hover:text-cyan-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/90 backdrop-blur-md">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3 transition-all ${
                  activePanel === item.id
                    ? `${item.color} text-white neon-glow`
                    : 'text-gray-300 hover:bg-cyan-700/30 hover:text-cyan-300'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Reset Modal */}
      <ResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={resetGame}
        type="manual"
      />
      
      {/* Arrest Modal */}
      <ResetModal
        isOpen={showArrestModal}
        onClose={() => setShowArrestModal(false)}
        onConfirm={() => {}}
        type="arrest"
        prestigePoints={arrestPrestigePoints}
      />
    </nav>
  );
};

export default Navigation;