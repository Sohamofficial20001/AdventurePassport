import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameMetadata from './data/ERPFlow.json';
import { ERPFlowConfig } from './types/ERPFlow';

const gameConfig = GameMetadata as ERPFlowConfig;
const STEPS = gameConfig.steps.map((text, index) => ({
  id: index + 1,
  text
}));

export const ERPFlow: React.FC<{ onFinish: (win: boolean) => void }> = ({ onFinish }) => {
  const [shuffled, setShuffled] = useState([...STEPS].sort(() => Math.random() - 0.5));
  const [userOrder, setUserOrder] = useState<typeof STEPS>([]);

  const addStep = (step: typeof STEPS[0]) => {
    if (userOrder.find(s => s.id === step.id)) return;
    setUserOrder(prev => [...prev, step]);
    setShuffled(prev => prev.filter(s => s.id !== step.id));
  };

  const removeStep = (step: typeof STEPS[0]) => {
    setUserOrder(prev => prev.filter(s => s.id !== step.id));
    setShuffled(prev => [...prev, step]);
  };

  const handleReset = () => {
    setUserOrder([]);
    setShuffled([...STEPS].sort(() => Math.random() - 0.5));
  };

  const handleSubmit = () => {
    const isCorrect = userOrder.every((step, index) => step.id === STEPS[index].id);
    onFinish(isCorrect);
  };

  return (
    <div className="w-full space-y-6">
      {/* DROP ZONE */}
      <div
        className="bg-gray-50 p-4 rounded-xl min-h-[160px] border-2 border-dashed border-gray-200 space-y-2"
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          const stepId = Number(e.dataTransfer.getData('stepId'));
          const step = shuffled.find(s => s.id === stepId);
          if (step) addStep(step);
        }}
      >
        <AnimatePresence>
          {userOrder.map((step, idx) => (
            <motion.div
              key={step.id}
              layout
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              draggable
              onDragStart={e => e.dataTransfer.setData('removeId', String(step.id))}
              onDoubleClick={() => removeStep(step)}
              className="bg-white p-3 rounded shadow-sm border border-gray-100 flex items-center gap-3 cursor-move"
            >
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <span className="text-sm font-medium">{step.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {userOrder.length === 0 && (
          <div className="h-28 flex items-center justify-center text-gray-400 text-xs italic">
            {gameConfig.ui.instruction}
          </div>
        )}
      </div>

      {/* PICK AREA (DROP-OUT ZONE) */}
      <div
        className="grid grid-cols-2 gap-2"
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          const removeId = Number(e.dataTransfer.getData('removeId'));
          const step = userOrder.find(s => s.id === removeId);
          if (step) removeStep(step);
        }}
      >
        <AnimatePresence>
          {shuffled.map(step => (
            <motion.button
              key={step.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              draggable
              onDragStart={e => e.dataTransfer.setData('stepId', String(step.id))}
              onClick={() => addStep(step)}
              className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-400 active:bg-blue-50 transition-all"
            >
              {step.text}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        <button
          onClick={handleReset}
          className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-600"
        >
          {gameConfig.ui.resetLabel}
        </button>
        <button
          onClick={handleSubmit}
          disabled={userOrder.length < STEPS.length}
          className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 shadow-lg"
        >
          {gameConfig.ui.submitLabel}
        </button>
      </div>
    </div>
  );
};