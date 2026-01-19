
import React from 'react';
import { GameStatus, GameMetadata } from '../types';

interface StampProps {
  game: GameMetadata;
  status: GameStatus;
  onClick: () => void;
}

export const Stamp: React.FC<StampProps> = ({ game, status, onClick }) => {
  const isWon = status === GameStatus.WON;
  const isPlayed = status === GameStatus.PARTICIPATED || isWon;

  return (
    <button 
      onClick={onClick}
      className={`
        relative aspect-square rounded-full flex flex-col items-center justify-center p-2 transition-all
        ${isWon ? 'border-4 border-dashed border-red-400 rotate-[-5deg]' : 
          isPlayed ? 'border-4 border-dashed border-gray-300 grayscale opacity-60' : 
          'border-2 border-gray-200 opacity-40 hover:opacity-100'}
      `}
    >
      {isPlayed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <span className="text-3xl transform rotate-12">PASSED</span>
        </div>
      )}
      <span className="text-3xl mb-1">{game.icon}</span>
      <span className="text-[10px] font-bold uppercase text-center passport-font leading-tight">
        {game.title}
      </span>
      {isWon && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 rounded-sm rotate-12 font-bold shadow-sm">
          APPROVED
        </div>
      )}
    </button>
  );
};
 