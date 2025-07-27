import React from 'react';
import { 
  Pickaxe, 
  Zap, 
  TrendingUp, 
  Coins, 
  Shield, 
  Terminal,
  Settings,
  Save
} from 'lucide-react';
import { useGameStore } from '../../store';

interface NavigationProps {
  activePanel: string;
  setActivePanel: (panel: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activePanel, setActivePanel }) => {
  const { bitbux, dollars, marketPrice, powerUsed, powerCapacity, riskMeter, saveGame } = useGameStore();
  
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

  const navigationItems = [
    { id: 'mining', label: 'Mining', icon: Pickaxe, color: 'bg-yellow-600' },
    { id: 'power', label: 'Power', icon: Zap, color: 'bg-blue-600' },
    { id: 'market', label: 'Market', icon: TrendingUp, color: 'bg-green-600' },
    { id: 'coinlab', label: 'Coin Lab', icon: Coins, color: 'bg-purple-600' },
    { id: 'darkweb', label: 'Dark Web', icon: Shield, color: 'bg-red-600' },
    { id: 'hacker', label: 'Hacker', icon: Terminal, color: 'bg-gray-600' },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-purple-400">Crypto Tycoon</h1>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePanel(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors ${
                      activePanel === item.id
                        ? `${item.color} text-white`
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-green-400 font-medium">
              💵 ${formatNumber(dollars)}
            </div>
            <div className="text-yellow-400 font-medium">
              💰 {formatNumber(bitbux)} BB
            </div>
            <div className="text-blue-400 font-medium">
              📈 ${formatNumber(marketPrice)}
            </div>
            <div className={`font-medium ${powerUsed > powerCapacity ? 'text-red-400' : 'text-cyan-400'}`}>
              ⚡ {formatNumber(powerUsed)}/{formatNumber(powerCapacity)}
            </div>
            <div className={`font-medium ${riskMeter > 70 ? 'text-red-400' : riskMeter > 40 ? 'text-yellow-400' : 'text-green-400'}`}>
              🚨 {riskMeter.toFixed(0)}%
            </div>
            <button
              onClick={saveGame}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              title="Save Game"
            >
              <Save size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3 transition-colors ${
                  activePanel === item.id
                    ? `${item.color} text-white`
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;