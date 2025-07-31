import React, { useState, useEffect } from 'react';
import Navigation from './components/Layout/Navigation';
import ValidatorPanel from './components/Panels/ValidatorPanel';
import NetworkPanel from './components/Panels/NetworkPanel';
import MarketPanel from './components/Panels/MarketPanel';
import TokenLabPanel from './components/Panels/TokenLabPanel';
import DarkPoolPanel from './components/Panels/DarkPoolPanel';
import MEVPanel from './components/Panels/MEVPanel';
import DAOPanel from './components/Panels/DAOPanel';
import GameLoop from './components/GameLoop';
import MatrixBackground from './components/UI/MatrixBackground';

function App() {
  const [activePanel, setActivePanel] = useState('validator');

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'validator':
        return <ValidatorPanel />;
      case 'network':
        return <NetworkPanel />;
      case 'market':
        return <MarketPanel />;
      case 'dao':
        return <DAOPanel />;
      case 'tokenlab':
        return <TokenLabPanel />;
      case 'darkpool':
        return <DarkPoolPanel />;
      case 'mev':
        return <MEVPanel />;
      default:
        return <ValidatorPanel />;
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <MatrixBackground />
      <GameLoop />
      <Navigation activePanel={activePanel} setActivePanel={setActivePanel} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {renderActivePanel()}
      </main>
      
      {/* Web3 Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse blockchain-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse blockchain-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-blue-500/5 rounded-full blur-3xl animate-pulse blockchain-pulse" style={{ animationDelay: '4s' }} />
        
        {/* Hexagon grid overlay */}
        <div className="absolute inset-0 hex-pattern opacity-20" />
      </div>
    </div>
  );
}

export default App;