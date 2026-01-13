
import React, { useState } from 'react';
import GameMetadata from './data/FoundersQuiz.json';
import { FoundersQuizConfig } from './types/FoundersQuiz';

const config = GameMetadata as FoundersQuizConfig;

export const FoundersQuiz: React.FC<{ onFinish: (win: boolean) => void }> = ({ onFinish }) => {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish(answer.trim() === config.correctAnswer);
  };

  return (
    <div className="w-full space-y-8 text-center">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 leading-tight">
          "{config.question}"
        </h3>
        <p className="text-sm text-gray-500">{config.ui.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter a number"
          className="w-full text-center text-4xl py-6 border-b-4 border-gray-200 focus:border-blue-600 focus:outline-none transition-all"
        />

        <div className="space-y-2">
          {!showHint ? (
            <button 
              type="button"
              onClick={() => setShowHint(true)}
              className="text-xs text-blue-600 underline font-bold"
            >
              {config.ui.hintButton}
            </button>
          ) : (
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-sm text-yellow-800 italic">
                "{config.ui.hintText}."
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-xl hover:bg-blue-700 transition-all"
        >
          {config.ui.submitLabel}
        </button>
      </form>
    </div>
  );
};
