
import React, { useState, useEffect, useRef } from 'react';
import GameMetadata from './data/FastTap.json';
import { FastTapConfig } from './types/FastTap';

const gameConfig = GameMetadata as FastTapConfig;

const SAP_TERMS = gameConfig.sapTerms;
const DUMMY_TERMS = gameConfig.dummyTerms;
const WIN_THRESHOLD = gameConfig.winThreshold;

export const FastTap: React.FC<{ onFinish: (win: boolean) => void }> = ({ onFinish }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameConfig.timerSeconds);
  const [currentTerm, setCurrentTerm] = useState<{ text: string, isSAP: boolean } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);


  const nextTerm = () => {
    const isSAP = Math.random() > 0.5;
    const pool = isSAP ? SAP_TERMS : DUMMY_TERMS;
    const text = pool[Math.floor(Math.random() * pool.length)];
    setCurrentTerm({ text, isSAP });
  };

  const handleTap = (tappedAsSAP: boolean) => {
    if (!playing || !currentTerm) return;

    if (tappedAsSAP === currentTerm.isSAP) {
      setScore(s => s + gameConfig.pointsCorrect);
    } else {
      setScore(s => Math.max(0, s - gameConfig.pointsWrong));
    }
    nextTerm();
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(gameConfig.timerSeconds);
    setPlaying(true);
    setHasFinished(false);
    nextTerm();

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
  };

  useEffect(() => {
    if (timeLeft <= 0 && playing && !hasFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      setPlaying(false);
      setHasFinished(true);
      // Small delay to let the user see the final score
      setTimeout(() => {
        onFinish(score >= WIN_THRESHOLD);
      }, 500);
    }
  }, [timeLeft, playing, score, onFinish, hasFinished]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!playing && !hasFinished) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-800">{gameConfig.ui.missionTitle}</h3>
          <p className="text-sm text-gray-600 px-4">
            Tap <span className="font-bold text-green-600">{gameConfig.ui.sapButtonLabel}</span> if it belongs to the ecosystem, or <span className="font-bold text-red-600">{gameConfig.ui.notSapButtonLabel}</span> otherwise.
          </p>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Goal: {WIN_THRESHOLD} Points in {gameConfig.timerSeconds}s
          </p>
        </div>
        <div className="text-6xl animate-bounce py-4">⚡</div>
        <button
          onClick={startGame}
          className="w-full py-4 bg-[#008fd3] text-white rounded-2xl font-bold shadow-lg text-xl hover:bg-blue-600 transition-all active:scale-95"
        >
          {gameConfig.ui.startLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full text-center space-y-8">
      <div className="flex justify-between items-center px-2">
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase font-bold text-gray-400">Time Left</span>
          <span className={`text-2xl font-mono font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
            {Math.max(0, timeLeft)}s
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-bold text-gray-400">Current Score</span>
          <span className="text-2xl font-mono font-bold text-green-600">
            {score}<span className="text-xs text-gray-300 ml-1">/{WIN_THRESHOLD}</span>
          </span>
        </div>
      </div>

      <div className="h-40 flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center text-8xl font-black">
          {timeLeft}
        </div>
        <div className="text-4xl font-black text-gray-800 tracking-tight z-10 px-4">
          {currentTerm?.text}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleTap(true)}
          className="group relative py-10 bg-green-500 text-white rounded-2xl font-bold shadow-lg hover:bg-green-600 active:scale-95 transition-all overflow-hidden"
        >
          <span className="relative z-10">{gameConfig.ui.sapButtonLabel}</span>
          <div className="absolute inset-0 bg-white/10 scale-0 group-active:scale-150 transition-transform duration-500 rounded-full"></div>
        </button>
        <button
          onClick={() => handleTap(false)}
          className="group relative py-10 bg-red-500 text-white rounded-2xl font-bold shadow-lg hover:bg-red-600 active:scale-95 transition-all overflow-hidden"
        >
          <span className="relative z-10">{gameConfig.ui.notSapButtonLabel}</span>
          <div className="absolute inset-0 bg-white/10 scale-0 group-active:scale-150 transition-transform duration-500 rounded-full"></div>
        </button>
      </div>
    </div>
  );
};
