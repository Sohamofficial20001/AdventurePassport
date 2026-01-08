
import React, { useState } from 'react';

export const FoundersQuiz: React.FC<{ onFinish: (win: boolean) => void }> = ({ onFinish }) => {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish(answer === '5');
  };

  return (
    <div className="w-full space-y-8 text-center">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 leading-tight">
          "How many founders does SAP have?"
        </h3>
        <p className="text-sm text-gray-500">The journey ends with the basics of SAP's origin story.</p>
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
              Need a hint?
            </button>
          ) : (
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-sm text-yellow-800 italic">
                "The answer is the same as the number of this game."
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-xl hover:bg-blue-700 transition-all"
        >
          Submit Answer
        </button>
      </form>
    </div>
  );
};
