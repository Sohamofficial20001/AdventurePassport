import React, { useMemo } from 'react';
import { UserProgress, GAMES_DATA, GameMetadata } from '../types';
import { Stamp } from './Stamp';
import Avatar from 'boring-avatars';

interface PassportProps {
  user: UserProgress;
  onOpenGame: (game: GameMetadata) => void;
  onLogout: () => void;
}

const generateEmailId6 = (email: string): string => {
  let hash = 2166136261;
  for (let i = 0; i < email.length; i++) {
    hash ^= email.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash % 1_000_000).toString().padStart(6, '0');
};

const getCurrentIssueDate = () => {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, '0')} ${d
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase()} ${d.getFullYear()}`;
};

export const Passport: React.FC<PassportProps> = ({
  user,
  onOpenGame,
  onLogout,
}) => {
  const passportId = useMemo(() => generateEmailId6(user.userId), [user.userId]);
  const issueDate = useMemo(() => getCurrentIssueDate(), []);

  return (
    <div className="relative w-full max-w-2xl mx-auto px-2 sm:px-4">
      <div className="bg-[#fdfaf1] rounded-lg shadow-2xl border border-gray-300 p-6 relative overflow-hidden flex flex-col">

        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        {/* Header */}
        <div className="flex justify-between items-center mb-5 border-b border-blue-900/20 pb-2 z-10">
          <span className="text-[10px] font-bold text-blue-900/40 tracking-[0.3em] uppercase">
            Official Digital Pass
          </span>

          <button
            onClick={onLogout}
            className="p-1 flex items-center justify-center text-[#c5a059] hover:text-amber-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 stroke-current"
              fill="none"
              strokeWidth={1.8}
            >
              <path d="M3 12a9 9 0 1 1 9 9" />
              <path d="M3 12l-2 2m2-2l2 2" />
            </svg>
          </button>
        </div>

        {/* Identity */}
        <div className="flex gap-6 mb-6 z-10">
          <div className="flex-shrink-0">
            <div className="w-20 h-28 bg-[#fdfaf1] flex items-center justify-center border border-gray-200 shadow-inner">
              <Avatar
                size={70}
                name={user.userId}
                variant="beam"
                colors={['#F94144', '#F3722C', '#F9C74F', '#90BE6D', '#577590']}
              />
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-2">
            <div className="col-span-2">
              <label className="block text-[9px] uppercase font-bold text-blue-900/60">
                Name / Nom
              </label>
              <span className="text-md font-mono font-bold uppercase">
                {user.name}
              </span>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-blue-900/60">
                ID Code
              </label>
              <span className="text-sm font-mono font-bold tracking-widest">
                {passportId}
              </span>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-blue-900/60">
                Nationality
              </label>
              <span className="text-sm font-mono font-bold uppercase">
                Cloud Native
              </span>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-blue-900/60">
                Date of Issue
              </label>
              <span className="text-sm font-mono font-bold uppercase">
                {issueDate}
              </span>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-blue-900/60">
                Authority
              </label>
              <span className="text-sm font-mono font-bold uppercase">
                SAP BTP
              </span>
            </div>
          </div>
        </div>

        {/* Visas */}
        <div className="z-10">
          <h3 className="text-center font-bold uppercase tracking-[0.35em] text-gray-400 text-[10px] mb-4 border-y border-dashed border-gray-300 py-1">
            Visas & Endorsements
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {GAMES_DATA.slice(0, 6).map((game) => (
              <Stamp
                key={game.id}
                game={game}
                status={user.games[game.id]}
                onClick={() => onOpenGame(game)}
              />
            ))}
          </div>
        </div>

        {/* MRZ */}
        <div className="mt-6 pt-4 border-t-2 border-gray-200 select-none z-10">
          <div
            className="font-mono uppercase text-gray-600 opacity-80 whitespace-nowrap"
            style={{ fontSize: 'clamp(10px, 1.2vw, 13px)', letterSpacing: '0.12em' }}
          >
            <p>P&lt;CLOUDVOYAGER&lt;&lt;SAP&lt;ENTHUSIAST&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
            <p>{user.userId.toUpperCase().slice(0, 20)}7&lt;&lt;8USA9001011M&lt;&lt;&lt;&lt;06</p>
          </div>
        </div>

      </div>
    </div>
  );
};
