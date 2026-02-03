import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { GameMetadata, GameStatus } from '../types';
import { ModuleMatch } from './games/ModuleMatch';
import { ERPFlow } from './games/ERPFlow';
import { FastTap } from './games/FastTap';
import { ErrorSpot } from './games/ErrorSpot';
import { FoundersQuiz } from './games/FoundersQuiz';
import { ArThrowGame } from './games/ArThrowGame';
import { MazeAirplaneGame } from '../public/games/MazeAirplane/MazeAirplaneGame';
import { SAPAstrology } from './games/SapAstrologyWheel';
import Certification from './games/Certification';

import sapAstrologyData from './games/data/SapAstro.json';
import erpFlowData from './games/data/ERPFlow.json';
import fastTapData from './games/data/FastTap.json';
import errorSpotData from './games/data/ErrorSpot.json';
import foundersQuizData from './games/data/FoundersQuiz.json';
import mazeData from './games/data/maze.json';
import certification from './games/data/Certification.json';
import portfolioPicker from './games/data/ModuleMatch.json';

import { GuideModal } from './GuideModal';
import { saveGameSession } from '../src/services/gameSessionService';

interface GameModalProps {
  game: GameMetadata;
  currentStatus: GameStatus;
  userId: string;
  onClose: () => void;
  onComplete: (win: boolean, metadata?: Record<string, any>) => void;
}

/** Static guide mapping (JSON-driven) */
const GAME_GUIDES: Record<string, any> = {
  flow: erpFlowData.howToPlay,
  tap: fastTapData.howToPlay,
  error: errorSpotData.howToPlay,
  quiz: foundersQuizData.howToPlay,
  astrology: sapAstrologyData.howToPlay,
  certification: certification.howToPlay,
  maze: mazeData.howToPlay,
  match: portfolioPicker.howToPlay,
};

export const GameModal: React.FC<GameModalProps> = ({
  game,
  currentStatus,
  userId,
  onClose,
  onComplete,
}) => {
  const [gameState, setGameState] = useState<'playing' | 'result'>('playing');
  const [isWin, setIsWin] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  /** Resolve guide content for current game */
  const guideContent = useMemo(() => {
    return GAME_GUIDES[game.type] ?? null;
  }, [game.type]);

  const handleFinish = async (
    won: boolean,
    metadata: Record<string, any> = {}
  ) => {
    setIsWin(won);
    setGameState('result');

    // 1️⃣ Update passport progress
    onComplete(won, metadata);

    // 2️⃣ Save session (non-blocking)
    try {
      await saveGameSession(
        userId,
        game.id,
        won ? 'WON' : 'PARTICIPATED',
        {
          gameType: game.type,
          ...metadata,
        }
      );
    } catch (err) {
      console.warn('Game session save failed', err);
    }

    // 3️⃣ Stamp animation
    setTimeout(() => {
      setShowStamp(true);
    }, 500);

    if (won) {
        const duration = 2000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 6,
            spread: 80,
            startVelocity: 40,
            origin: { x: Math.random(), y: Math.random() - 0.2 }
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };

        frame();
      }
  };

  const dynamicContent = useMemo(() => {
    switch (game.type) {
      case 'flow':
        return erpFlowData.detail;
      case 'tap':
        return fastTapData.detail;
      case 'error':
        return errorSpotData.detail;
      case 'quiz':
        return foundersQuizData.detail;
      case 'astrology':
        return sapAstrologyData.detail;
      case 'maze':
        return mazeData.detail;
      case 'certification':
        return certification.detail;
      default:
        return '';
    }
  }, [game.type]);

  const renderGame = () => {
    switch (game.type) {
      case 'match':
        return <ModuleMatch onFinish={handleFinish} />;
      case 'flow':
        return <ERPFlow onFinish={handleFinish} />;
      case 'tap':
        return <FastTap onFinish={handleFinish} />;
      case 'error':
        return <ErrorSpot onFinish={handleFinish} />;
      case 'quiz':
        return <FoundersQuiz onFinish={handleFinish} />;
      case 'maze':
        return <MazeAirplaneGame onComplete={handleFinish} />;
      case 'ar':
        return <ArThrowGame onFinish={handleFinish} />;
      case 'astrology':
        return (
          <SAPAstrology
            onFinish={(win, metadata) => handleFinish(win, metadata)}
          />
        );
      case 'certification':
        return <Certification onComplete={(win, metadata) => handleFinish(win, metadata)} />
      // return <Certification onComplete={handleFinish} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col relative min-h-[500px]">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{game.icon}</span>
              <div>
                <h3 className="font-bold text-gray-800">{game.title}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Mission #{game.id}
                </p>
              </div>
            </div>

            {/* Guide + Close */}
            <div className="flex items-center gap-2">
              {guideContent && (
                <button
                  onClick={() => setShowGuide(true)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  title="How to play"
                >
                  ℹ️
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center">
            {gameState === 'playing' ? (
              renderGame()
            ) : (
              <div className="text-center space-y-6 flex flex-col items-center">
                <p className="text-sm text-gray-600 max-w-xs">
                  {dynamicContent}
                </p>

                <div className="relative w-36 h-36 flex items-center justify-center">
                  {showStamp && (
                    <div
                      className={`
                        absolute inset-0 rounded-full border-8 animate-stamp flex flex-col items-center justify-center passport-font
                        ${isWin
                          ? 'border-blue-600 text-blue-600'
                          : 'border-gray-400 text-gray-400'
                        }
                      `}
                    >
                      <span className="text-2xl mb-1">
                        {isWin ? 'WINNER' : 'VISITOR'}
                      </span>
                      <span className="text-xs font-bold tracking-widest">
                        {new Date().toLocaleDateString()}
                      </span>
                      <span className="text-[9px] mt-1">
                        SAP VOYAGER - AUTH
                      </span>
                    </div>
                  )}
                </div>

                <div>
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
                    className="mt-6 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    Continue Journey
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guide Modal */}
      {showGuide && guideContent && (
        <GuideModal
          title={game.title}
          guide={guideContent}
          onClose={() => setShowGuide(false)}
        />
      )}
    </>
  );
};
