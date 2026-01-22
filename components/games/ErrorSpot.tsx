import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import GameMetadata from './data/ErrorSpot.json';
import { ErrorSpotConfig } from './types/ErrorSpot';

const config = GameMetadata as ErrorSpotConfig;

// Pick one scenario randomly
const getRandomScenario = () => {
  return config.scenarios[Math.floor(Math.random() * config.scenarios.length)];
};

export const ErrorSpot: React.FC<{
  onFinish: (win: boolean, metadata?: Record<string, any>) => void;
}> = ({ onFinish }) => {
  const scenario = useMemo(() => getRandomScenario(), []);
  const [found, setFound] = useState<string[]>([]);
  const [shakeField, setShakeField] = useState<string | null>(null);

  const handleSpot = (fieldId: string) => {
    // Correct error
    if (scenario.errors.includes(fieldId)) {
      if (found.includes(fieldId)) return;
      setFound((prev) => [...prev, fieldId]);
      return;
    }

    // Incorrect field → shake feedback
    setShakeField(fieldId);
    setTimeout(() => setShakeField(null), 350);
  };

  const handleSubmit = () => {
    const success = found.length === scenario.errors.length;

    const metadata = {
      scenarioId: scenario.id,
      poNumber: scenario.document.poNumber,
      totalErrors: scenario.errors.length,
      errorsFound: found.length,
      foundErrorIds: found,
      missedErrorIds: scenario.errors.filter((e) => !found.includes(e)),
    };

    onFinish(success, metadata);
  };

  const shakeAnimation = (id: string) =>
    shakeField === id
      ? { x: [-4, 4, -4, 4, 0] }
      : { x: 0 };

  return (
    <div className="w-full space-y-6">
      <p className="text-xs text-center text-gray-500 italic">
        {config.ui.instruction}
      </p>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 font-mono text-[10px] shadow-sm space-y-3">
        <div className="border-b pb-2 flex justify-between font-bold">
          <span>SAP PO: {scenario.document.poNumber}</span>
          <span className="text-blue-600">INTERNAL DOC</span>
        </div>

        {/* Header Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="block text-gray-400 uppercase">Vendor</span>
            <motion.button
              onClick={() => handleSpot('vendor')}
              animate={shakeAnimation('vendor')}
              transition={{ duration: 0.3 }}
              className={`block w-full text-left p-1 border ${
                found.includes('vendor')
                  ? 'bg-red-100 border-red-500 text-red-700'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {scenario.document.vendor ?? '[ EMPTY ]'}
            </motion.button>
          </div>

          <div className="space-y-1">
            <span className="block text-gray-400 uppercase">Currency</span>
            <motion.button
              onClick={() => handleSpot('currency')}
              animate={shakeAnimation('currency')}
              transition={{ duration: 0.3 }}
              className={`block w-full text-left p-1 border ${
                found.includes('currency')
                  ? 'bg-red-100 border-red-500 text-red-700'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {scenario.document.currencyShown} (Expected:{' '}
              {scenario.document.currencyExpected})
            </motion.button>
          </div>
        </div>

        {/* Item Details */}
        <div className="space-y-1 mt-4">
          <span className="block text-gray-400 uppercase border-b border-gray-100">
            Item Details
          </span>

          {scenario.document.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between py-1 bg-gray-50 px-2 rounded"
            >
              <span>{item.name}</span>

              {item.errorId ? (
                <motion.button
                  onClick={() => handleSpot(item.errorId)}
                  animate={shakeAnimation(item.errorId)}
                  transition={{ duration: 0.3 }}
                  className={`p-1 border ${
                    found.includes(item.errorId)
                      ? 'bg-red-100 border-red-500 text-red-700'
                      : 'bg-transparent border-transparent'
                  }`}
                >
                  QTY: {item.qty}
                </motion.button>
              ) : (
                <motion.span
                  onClick={() => handleSpot(item.id)}
                  animate={shakeAnimation(item.id)}
                  transition={{ duration: 0.3 }}
                  className="cursor-pointer"
                >
                  QTY: {item.qty}
                </motion.span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
        <span>
          Errors Found: {found.length}/{scenario.errors.length}
        </span>
        <div className="flex gap-1">
          {scenario.errors.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                found.length > i ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all"
      >
        {config.ui.submitLabel}
      </button>
    </div>
  );
};
