import React, { useMemo, useState, TouchEvent } from 'react';
import { UserProgress, GAMES_DATA, GameMetadata } from '../types';
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
  // -- Pagination State --
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 4;

  // Calculate total pages
  const totalPages = Math.ceil(GAMES_DATA.length / ITEMS_PER_PAGE);

  // Get current games slice
  const currentGames = useMemo(() => {
    const start = page * ITEMS_PER_PAGE;
    return GAMES_DATA.slice(start, start + ITEMS_PER_PAGE);
  }, [page]);

  // -- Swipe Logic State --
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && page < totalPages - 1) {
      setPage(p => p + 1); // Next
    }
    if (isRightSwipe && page > 0) {
      setPage(p => p - 1); // Prev
    }
  };

  // -- Existing Memoization --
  const passportId = useMemo(
    () => generateEmailId6(user.userId),
    [user.userId]
  );

  const issueDate = useMemo(
    () => getCurrentIssueDate(),
    []
  );

  return (
    <div className="relative w-full max-w-2xl mx-auto px-2 sm:px-4">
      {/* Inside Passport Page */}
      <div className="bg-[#fdfaf1] rounded-lg shadow-2xl border border-gray-300 p-8 relative overflow-hidden flex flex-col min-h-[600px]">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        {/* Header / Reset Button */}
        <div className="flex justify-between items-center mb-6 border-b border-blue-900/20 pb-2 z-10">
          <span className="text-[10px] font-bold text-blue-900/40 tracking-[0.3em] uppercase">
            Official Digital Pass
          </span>

          <button
            onClick={onLogout}
            className="p-1 -mr-1 flex items-center justify-center text-[#c5a059] hover:text-amber-700"
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


        {/* Identity Section (Static) */}
        <div className="flex gap-8 mb-6 z-10">
          {/* Passport Photo */}
          <div className="flex-shrink-0">
            <div className="w-18 h-24 bg-[#fdfaf1] flex items-center justify-center relative overflow-hidden border border-gray-200 shadow-inner">
              <Avatar
                size={80}
                name={user.userId}
                variant="beam"
                colors={["#F94144", "#F3722C", "#F9C74F", "#90BE6D", "#577590"]}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50"></div>
            </div>
          </div>

          {/* Data Fields */}
          <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-2">
            <div className="col-span-2">
              <label className="block text-[9px] uppercase font-bold text-blue-900/60 tracking-tighter">Name / Nom</label>
              <span className="text-md font-mono font-bold text-gray-800 tracking-tight uppercase">{user.name}</span>
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-blue-900/60 tracking-tighter">ID Code / Code d'identification</label>
              <span className="text-sm font-mono font-bold text-gray-800 tracking-widest">{passportId}</span>
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-blue-900/60 tracking-tighter">Nationality / Nationalité</label>
              <span className="text-sm font-mono font-bold text-gray-800 tracking-tight uppercase">CLOUD NATIVE</span>
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-blue-900/60 tracking-tighter">Date of Issue / Date de délivrance</label>
              <span className="text-sm font-mono font-bold text-gray-800 tracking-tight uppercase">{issueDate}</span>
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-blue-900/60 tracking-tighter">Authority / Autorité</label>
              <span className="text-sm font-mono font-bold text-gray-800 tracking-tight uppercase">SAP BTP</span>
            </div>
          </div>
        </div>

        {/* Visa Section (Paginated & Swipeable) */}
        <div className="flex-1 z-10 flex flex-col">
          <h3 className="text-center font-bold uppercase tracking-[0.4em] text-gray-400 text-[10px] mb-4 border-y border-dashed border-gray-300 py-1">
            Visas & Endorsements {page + 1}/{totalPages}
          </h3>

          {/* Stamp Grid Container with Swipe Handlers */}
          <div
            className="flex-1 relative min-h-[220px]"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Changed to grid-cols-2 to comfortably fit 4 items. 
                Using min-h to ensure layout doesn't jump.
             */}
            <div className="grid grid-cols-2 gap-4 animate-fadeIn transition-all duration-300">
              {currentGames.map((game) => (
                <Stamp
                  key={game.id}
                  game={game}
                  status={user.games[game.id]}
                  onClick={() => onOpenGame(game)}
                />
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-4 mb-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className={`p-2 rounded-full transition-colors ${page === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-blue-900/5 text-blue-900'}`}
            >
              {/* Left Arrow */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${idx === page ? 'bg-blue-900/60' : 'bg-gray-300'}`}
                />
              ))}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className={`p-2 rounded-full transition-colors ${page === totalPages - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-blue-900/5 text-blue-900'}`}
            >
              {/* Right Arrow */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Machine Readable Zone (MRZ) - Kept at bottom */}
        <div className="mt-4 pt-4 border-t-2 border-gray-200 select-none z-10">
          <div className="mx-auto w-full lg:max-w-[680px]">
            <div
              className="w-full font-mono uppercase text-gray-600 opacity-80 leading-tight whitespace-nowrap text-justify"
              style={{
                fontSize: "clamp(10px, 1.2vw, 13px)",
                letterSpacing: "0.12em",
                fontVariantNumeric: "tabular-nums"
              }}
            >
              <p className="w-full">
                P&lt;CLOUDVOYAGER&lt;&lt;SAP&lt;ENTHUSIAST&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
              </p>
              <p className="w-full">
                {user.userId.toUpperCase().substring(0, 20)}7&lt;&lt;8USA9001011M&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};