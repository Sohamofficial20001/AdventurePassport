
import React from 'react';
import { UserProgress, GameStatus, GAMES_DATA, GameMetadata } from '../types';
import { Stamp } from './Stamp';

interface PassportProps {
  user: UserProgress;
  onOpenGame: (game: GameMetadata) => void;
  onLogout: () => void;
}

export const Passport: React.FC<PassportProps> = ({ user, onOpenGame, onLogout }) => {
  return (
    <div className="relative">
      {/* Passport Cover */}
      <div className="bg-[#1e3a5f] rounded-xl shadow-2xl overflow-hidden border-4 border-[#c5a059] relative aspect-[3/4] flex flex-col items-center justify-between p-8">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]"></div>
        
        <div className="text-center z-10">
          <div className="text-[#c5a059] border-2 border-[#c5a059] p-2 inline-block mb-4 rounded">
            <h2 className="text-lg font-bold tracking-[0.2em] uppercase">Enterprise</h2>
          </div>
          <h1 className="text-4xl font-bold text-[#c5a059] tracking-widest uppercase mb-1">Passport</h1>
          <div className="h-1 bg-[#c5a059] w-full mt-2"></div>
        </div>

        <div className="z-10 w-32 h-32 border-4 border-[#c5a059] rounded-full flex items-center justify-center">
          <span className="text-6xl grayscale opacity-70">🌍</span>
        </div>

        <div className="text-center z-10 w-full">
          <p className="text-[#c5a059] text-xs font-bold tracking-widest uppercase mb-4 opacity-50">SAP Voyager Program</p>
          <div className="barcode-font text-5xl text-[#c5a059] mb-4">
            {user.userId.split('').join(' ')}
          </div>
          <button 
            onClick={onLogout}
            className="text-[#c5a059] text-xs underline opacity-50 hover:opacity-100"
          >
            Reset Session
          </button>
        </div>
      </div>

      {/* Inside Passport Page */}
      <div className="mt-8 bg-[#fdfaf1] rounded-lg shadow-xl border-2 border-gray-300 p-6 relative">
        <div className="flex items-start gap-4 pb-4 border-b-2 border-gray-300 border-dashed mb-6">
          <div className="w-24 h-32 bg-gray-200 border-2 border-gray-400 flex items-center justify-center overflow-hidden">
             <img src={`https://picsum.photos/seed/${user.userId}/200/300`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="passport-font space-y-1 text-sm text-blue-900 flex-1">
            <p><span className="opacity-50 text-[10px] block uppercase">Surname</span> VOYAGER</p>
            <p><span className="opacity-50 text-[10px] block uppercase">Given Name</span> SAP ENTHUSIAST</p>
            <p><span className="opacity-50 text-[10px] block uppercase">ID Code</span> {user.userId}</p>
            <p><span className="opacity-50 text-[10px] block uppercase">Nationality</span> CLOUD NATIVE</p>
          </div>
        </div>

        <h3 className="text-center font-bold uppercase tracking-widest text-gray-500 text-xs mb-6">Visas & Endorsements</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {GAMES_DATA.map((game) => (
            <Stamp 
              key={game.id} 
              game={game} 
              status={user.games[game.id]} 
              onClick={() => onOpenGame(game)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
