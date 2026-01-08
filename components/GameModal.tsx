
import React, { useState } from 'react';
import { GameMetadata, GameStatus } from '../types';
import { ModuleMatch } from './games/ModuleMatch';
import { ERPFlow } from './games/ERPFlow';
import { FastTap } from './games/FastTap';
import { ErrorSpot } from './games/ErrorSpot';
import { FoundersQuiz } from './games/FoundersQuiz';

interface GameModalProps {
  game: GameMetadata;
  currentStatus: GameStatus;
  onClose: () => void;
  onComplete: (win: boolean) => void;
}

export const GameModal: React.FC<GameModalProps> = ({ game, currentStatus, onClose, onComplete }) => {
  const [gameState, setGameState] = useState<'playing' | 'result'>('playing');
  const [isWin, setIsWin] = useState(false);
  const [showStamp, setShowStamp] = useState(false);

  const handleFinish = (won: boolean) => {
    setIsWin(won);
    setGameState('result');
    onComplete(won);
    
    // Trigger stamp animation after a small delay
    setTimeout(() => {
      setShowStamp(true);
    }, 500);
  };

  const renderGame = () => {
    switch (game.type) {
      case 'match': return <ModuleMatch onFinish={handleFinish} />;
      case 'flow': return <ERPFlow onFinish={handleFinish} />;
      case 'tap': return <FastTap onFinish={handleFinish} />;
      case 'error': return <ErrorSpot onFinish={handleFinish} />;
      case 'quiz': return <FoundersQuiz onFinish={handleFinish} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col relative min-h-[500px]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{game.icon}</span>
            <div>
              <h3 className="font-bold text-gray-800">{game.title}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Mission #{game.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          {gameState === 'playing' ? (
            renderGame()
          ) : (
            <div className="text-center space-y-6 flex flex-col items-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {showStamp && (
                  <div className={`
                    absolute inset-0 rounded-full border-8 animate-stamp flex flex-col items-center justify-center passport-font
                    ${isWin ? 'border-blue-600 text-blue-600' : 'border-gray-400 text-gray-400'}
                  `}>
                    <span className="text-4xl mb-2">{isWin ? 'WINNER' : 'VISITOR'}</span>
                    <span className="text-sm font-bold tracking-widest">{new Date().toLocaleDateString()}</span>
                    <span className="text-xs mt-1">SAP VOYAGER - AUTH</span>
                  </div>
                )}
              </div>

              <div className="z-10">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isWin ? 'Mission Accomplished!' : 'Good Effort!'}
                </h2>
                <p className="text-gray-500 mt-2">
                  {isWin 
                    ? "You've earned the Winner's Stamp for your passport." 
                    : "You've earned a Participation Stamp. Try again for the gold!"}
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  Continue Journey
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
