
import React, { useState } from 'react';

const STEPS = [
  { id: 1, text: 'Create Sales Order' },
  { id: 2, text: 'Delivery / Shipping' },
  { id: 3, text: 'Billing / Invoice' },
  { id: 4, text: 'Payment Receipt' },
];

export const ERPFlow: React.FC<{ onFinish: (win: boolean) => void }> = ({ onFinish }) => {
  const [shuffled, setShuffled] = useState([...STEPS].sort(() => Math.random() - 0.5));
  const [userOrder, setUserOrder] = useState<typeof STEPS>([]);

  const handleSelect = (step: typeof STEPS[0]) => {
    if (userOrder.find(s => s.id === step.id)) return;
    setUserOrder([...userOrder, step]);
    setShuffled(shuffled.filter(s => s.id !== step.id));
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
      <div className="bg-gray-50 p-4 rounded-xl min-h-[160px] border-2 border-dashed border-gray-200 space-y-2">
        {userOrder.map((step, idx) => (
          <div key={step.id} className="bg-white p-3 rounded shadow-sm border border-gray-100 flex items-center gap-3">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
              {idx + 1}
            </span>
            <span className="text-sm font-medium">{step.text}</span>
          </div>
        ))}
        {userOrder.length === 0 && (
          <div className="h-28 flex items-center justify-center text-gray-400 text-xs italic">
            Select steps below in the correct order...
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {shuffled.map(step => (
          <button
            key={step.id}
            onClick={() => handleSelect(step)}
            className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-400 active:bg-blue-50 transition-all"
          >
            {step.text}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleReset}
          className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-600"
        >
          Reset
        </button>
        <button
          onClick={handleSubmit}
          disabled={userOrder.length < 4}
          className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 shadow-lg"
        >
          Verify Process
        </button>
      </div>
    </div>
  );
};
