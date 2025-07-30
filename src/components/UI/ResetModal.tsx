import React from 'react';
import { AlertTriangle, RotateCcw, Hand as Handcuffs } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'manual' | 'arrest' | 'prestige';
  prestigePoints?: number;
  reason?: string;
}

const ResetModal: React.FC<ResetModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type, 
  prestigePoints = 0,
  reason 
}) => {
  if (!isOpen) return null;

  const getModalContent = () => {
    switch (type) {
      case 'arrest':
        return {
          icon: <Handcuffs className="w-16 h-16 text-red-400 mx-auto mb-4" />,
          title: '🚨 GAME OVER - ARRESTED! 🚨',
          message: (
            <div className="text-center space-y-3">
              <div className="text-red-400 font-bold text-lg">
                You have been ARRESTED by federal agents!
              </div>
              <div className="text-gray-300">
                All your assets have been seized and you're starting over from prison.
              </div>
              {prestigePoints > 0 && (
                <div className="text-purple-400">
                  You gained {prestigePoints} prestige points from your criminal empire!
                </div>
              )}
              <div className="text-yellow-400 text-sm">
                Be more careful next time...
              </div>
            </div>
          ),
          confirmText: 'Start Over from Prison',
          cancelText: null,
          bgColor: 'bg-red-900/90',
          borderColor: 'border-red-500'
        };
      
      case 'prestige':
        return {
          icon: <RotateCcw className="w-16 h-16 text-purple-400 mx-auto mb-4" />,
          title: '✨ PRESTIGE RESET ✨',
          message: (
            <div className="text-center space-y-3">
              <div className="text-purple-400 font-bold text-lg">
                Ready to prestige your criminal empire?
              </div>
              <div className="text-gray-300">
                You will lose all progress but gain {prestigePoints} prestige points for permanent bonuses.
              </div>
              <div className="text-yellow-400 text-sm">
                This action cannot be undone!
              </div>
            </div>
          ),
          confirmText: 'Prestige Reset',
          cancelText: 'Cancel',
          bgColor: 'bg-purple-900/90',
          borderColor: 'border-purple-500'
        };
      
      default: // manual
        return {
          icon: <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />,
          title: '⚠️ RESET GAME ⚠️',
          message: (
            <div className="text-center space-y-3">
              <div className="text-yellow-400 font-bold text-lg">
                Are you sure you want to reset the game?
              </div>
              <div className="text-gray-300">
                This will delete ALL progress including:
              </div>
              <div className="text-gray-400 text-sm space-y-1">
                <div>• All money and BitBux</div>
                <div>• All miners and power plants</div>
                <div>• All upgrades and reputation</div>
                <div>• Custom coins and black market items</div>
              </div>
              <div className="text-red-400 font-semibold">
                This action cannot be undone!
              </div>
            </div>
          ),
          confirmText: 'Reset Everything',
          cancelText: 'Cancel',
          bgColor: 'bg-gray-900/90',
          borderColor: 'border-yellow-500'
        };
    }
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className={`${content.bgColor} ${content.borderColor} border-2 rounded-lg p-6 max-w-md w-full mx-auto shadow-2xl`}>
        {content.icon}
        
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          {content.title}
        </h2>
        
        <div className="mb-6">
          {content.message}
        </div>
        
        <div className="flex space-x-3">
          {content.cancelText && (
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {content.cancelText}
            </button>
          )}
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`${content.cancelText ? 'flex-1' : 'w-full'} ${
              type === 'arrest' ? 'bg-red-600 hover:bg-red-700' :
              type === 'prestige' ? 'bg-purple-600 hover:bg-purple-700' :
              'bg-yellow-600 hover:bg-yellow-700'
            } text-white py-3 px-4 rounded-lg font-medium transition-colors`}
          >
            {content.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;