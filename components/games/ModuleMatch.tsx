
import React, { useState } from 'react';
import GameMetadata from './data/ModuleMatch.json';
import { ModuleMatchConfig } from './types/ModuleMatch';

const config = GameMetadata as ModuleMatchConfig;

export const ModuleMatch: React.FC<{ onFinish: (win: boolean) => void }> = ({ onFinish }) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleScenarioClick = (scenarioId: string) => {
    if (!selectedModule) {
      setFeedback(config.ui.feedbackSelectFirst);
      return;
    }
    
    setMatches(prev => ({ ...prev, [scenarioId]: selectedModule }));
    setSelectedModule(null);
    setFeedback(null);
  };

  const handleSubmit = () => {
    const correctCount = config.modules.filter(m => matches[m.id] === m.id).length;
    onFinish(correctCount >= config.rules.requiredCorrectToWin);
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-5 gap-2">
        {config.modules.map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedModule(m.id)}
            className={`p-2 text-xs font-bold rounded border-2 transition-all ${selectedModule === m.id ? 'bg-blue-600 text-white border-blue-600 scale-105' : 'bg-white border-gray-200 text-gray-600'}`}
          >
            {m.id}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {config.modules.map(m => (
          <div 
            key={m.id}
            onClick={() => handleScenarioClick(m.id)}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${matches[m.id] ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 hover:border-blue-300'}`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">{m.scenario}</span>
              {matches[m.id] && (
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                  {matches[m.id]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {feedback && <p className="text-xs text-center text-orange-500 font-bold animate-bounce">{feedback}</p>}

      <button
        onClick={handleSubmit}
        disabled={Object.keys(matches).length < config.modules.length}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50"
      >
        {config.ui.submitLabel}
      </button>
    </div>
  );
};
