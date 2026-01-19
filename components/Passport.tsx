import React, { useMemo } from 'react';
import { UserProgress, GameStatus, GAMES_DATA, GameMetadata } from '../types';
import { Stamp } from './Stamp';
import Avatar from 'boring-avatars';

interface PassportProps {
  user: UserProgress;
  onOpenGame: (game: GameMetadata) => void;
  onLogout: () => void;
}
const generateEmailId6 = (email: string): string => {
  // FNV-1a hash
  let hash = 2166136261;

  for (let i = 0; i < email.length; i++) {
    hash ^= email.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  // map into 000000–999999 space
  const sixDigit = Math.abs(hash % 1000000);

  // always keep leading zeros
  return sixDigit.toString().padStart(6, "0");
};


const getNameFromEmail = (email: string) => {
  if (!email) return "";
  return email.split("@")[0].trim();
};

const getCurrentIssueDate = () => {
  const d = new Date();
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};



export const Passport: React.FC<PassportProps> = ({ user, onOpenGame, onLogout }) => {
  const passportId = useMemo(
    () => generateEmailId6(user.userId),
    [user.userId]
  );
  const nameFromEmail = useMemo(() => getNameFromEmail(user.userId), [user.userId]);
  console.log("Name from email:", nameFromEmail, user, user.name);
  const issueDate = useMemo(
    () => getCurrentIssueDate(),
    []
  );

  return (
    // <div className="relative max-w-2xl mx-auto">
    <div className="relative w-full max-w-2xl mx-auto px-2 sm:px-4">
      {/* Inside Passport Page */}
      <div className="bg-[#fdfaf1] rounded-lg shadow-2xl border border-gray-300 p-8 relative overflow-hidden">
        {/* Subtle Background Pattern to mimic security paper */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        {/* Header / Reset Button */}
        <div className="flex justify-between items-start mb-6 border-b border-blue-900/20 pb-2">
          <span className="text-[10px] font-bold text-blue-900/40 tracking-[0.3em] uppercase">Official Digital Pass</span>
          <button
            onClick={onLogout}
            // className="text-[#c5a059] text-[10px] font-bold uppercase tracking-widest hover:text-amber-700 transition-colors"
            className="p-2 -mr-2 text-[#c5a059] hover:text-amber-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 stroke-[#c5a059]"
              fill="none"
              strokeWidth={1.8}
            >
              <path d="M3 12a9 9 0 1 1 9 9" />
              <path d="M3 12l-2 2m2-2l2 2" />
            </svg>
          </button>
        </div>

        <div className="flex gap-8 mb-8">
          {/* <div className="flex flex-col sm:flex-row gap-6 mb-8"> */}
          {/* Passport Photo - Adjusted to 35x45mm ratio */}
          <div className="flex-shrink-0">
            <div className="w-32 h-40 bg-[#fdfaf1] flex items-center justify-center relative overflow-hidden">

              <Avatar
                size={100}
                name={user.userId}
                variant="beam"
                colors={["#F94144", "#F3722C", "#F9C74F", "#90BE6D", "#577590"]}
              />


              {/* Overlay a subtle holographic sheen or stamp */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50"></div>
            </div>
          </div>

          {/* Data Fields */}
          <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-2">

            <div className="col-span-2">
              <label className="block text-[9px] uppercase font-bold text-blue-900/60 tracking-tighter">Name / Nom</label>
              <span className="text-lg font-mono font-bold text-gray-800 tracking-tight uppercase">{user.name}</span>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-blue-900/60 tracking-tighter">ID Code / Code d'identification</label>
              <span className="text-md font-mono font-bold text-gray-800 tracking-widest">{passportId}</span>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-blue-900/60 tracking-tighter">Nationality / Nationalité</label>
              <span className="text-md font-mono font-bold text-gray-800 tracking-tight uppercase">CLOUD NATIVE</span>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-blue-900/60 tracking-tighter">Date of Issue / Date de délivrance</label>
              <span className="text-md font-mono font-bold text-gray-800 tracking-tight uppercase">{issueDate}</span>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-blue-900/60 tracking-tighter">Authority / Autorité</label>
              <span className="text-md font-mono font-bold text-gray-800 tracking-tight uppercase">SAP BTP</span>
            </div>
          </div>
        </div>

        {/* Visa Section */}
        <div className="mt-4">
          <h3 className="text-center font-bold uppercase tracking-[0.4em] text-gray-400 text-[10px] mb-4 border-y border-dashed border-gray-300 py-1">
            Visas & Endorsements
          </h3>
          {/* <div className="grid grid-cols-3 gap-4"> */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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

        {/* Machine Readable Zone (MRZ) */}
        <div className="mt-8 pt-4 border-t-2 border-gray-200 select-none">
          <div className="mx-auto w-full max-w-full sm:max-w-full lg:max-w-[680px]">
            <div
              className="
        w-full
        font-mono
        uppercase
        text-gray-600
        opacity-80
        leading-tight
        whitespace-nowrap
        text-justify
      "
              style={{
                fontSize: "clamp(10px, 1.2vw, 13px)",
                letterSpacing: "0.12em",
                fontVariantNumeric: "tabular-nums"
              }}
            >
              <p className="w-full">
                P&lt;CLOUDVOYAGER&lt;&lt;SAP&lt;ENTHUSIAST&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
              </p>
              <p className="w-full">
                {user.userId.toUpperCase()}7&lt;&lt;8USA9001011M&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
