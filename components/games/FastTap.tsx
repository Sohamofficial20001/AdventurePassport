
import React, { useState, useEffect, useRef } from 'react';

const SAP_TERMS = ['BAPI', 'ABAP', 'HANA', 'FIORI', 'OData', 'Module', 'Basis', 'Cloud', 'ERP'];
const DUMMY_TERMS = ['Pizza', 'Table', 'Moon', 'Forest', 'Cloud-9', 'Java', 'React', 'Swift'];

export const FastTap: React.FC<{ onFinish: (win: boolean) => void }> = ({ onFinish }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [currentTerm, setCurrentTerm] = useState<{ text: string, isSAP: boolean } | null>(null);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  const nextTerm = () => {
    const isSAP = Math.random() > 0.4;
    const pool = isSAP ? SAP_TERMS : DUMMY_TERMS;
    const text = pool[Math.floor(Math.random() * pool.length)];
    setCurrentTerm({ text, isSAP });
  };

  const handleTap = (tapped: boolean) => {
    if (!currentTerm) return;
    
    if (tapped === currentTerm.isSAP) {
      setScore(s => s + 10);
    } else {
      setScore(s => Math.max(0, s - 5));
    }
    nextTerm();
  };

  const startGame = () => {
    setPlaying(true);
    setScore(0);
    setTimeLeft(15);
    nextTerm();
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (timeLeft === 0 && playing) {
      setPlaying(false);
      onFinish(score >= 80);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timeLeft, playing, score, onFinish]);

  if (!playing && timeLeft === 15) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">Tap only the terms related to SAP. Speed is key!</p>
        <div className="text-5xl my-8">⚡</div>
        <button 
          onClick={startGame}
          className="px-10 py-4 bg-yellow-500 text-white rounded-2xl font-bold shadow-lg text-xl"
        >
          START CHALLENGE
        </button>
      </div>
    );
  }

  return (
    <div className="w-full text-center space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-xs uppercase font-bold text-gray-400">Time: <span className="text-blue-600">{timeLeft}s</span></div>
        <div className="text-xs uppercase font-bold text-gray-400">Score: <span className="text-green-600">{score}</span></div>
      </div>

      <div className="h-32 flex items-center justify-center">
        <div className="text-4xl font-black text-gray-800 animate-pulse tracking-tight">
          {currentTerm?.text}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleTap(true)}
          className="py-12 bg-green-500 text-white rounded-2xl font-bold shadow-lg hover:bg-green-600 active:scale-95 transition-all"
        >
          SAP TERM
        </button>
        <button
          onClick={() => handleTap(false)}
          className="py-12 bg-red-500 text-white rounded-2xl font-bold shadow-lg hover:bg-red-600 active:scale-95 transition-all"
        >
          NOT SAP
        </button>
      </div>
    </div>
  );
};
