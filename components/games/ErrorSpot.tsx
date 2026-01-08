
import React, { useState } from 'react';

const ERRORS = [
  { id: 'currency', description: 'Wrong Currency Symbol' },
  { id: 'qty', description: 'Impossible Quantity' },
  { id: 'vendor', description: 'Missing Vendor ID' },
];

export const ErrorSpot: React.FC<{ onFinish: (win: boolean) => void }> = ({ onFinish }) => {
  const [found, setFound] = useState<string[]>([]);

  const handleSpot = (errorId: string) => {
    if (found.includes(errorId)) return;
    setFound([...found, errorId]);
  };

  const handleSubmit = () => {
    onFinish(found.length === 3);
  };

  return (
    <div className="w-full space-y-6">
      <p className="text-xs text-center text-gray-500 italic">Tap the 3 incorrect fields in this Purchase Order</p>
      
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 font-mono text-[10px] shadow-sm space-y-3 relative overflow-hidden">
        <div className="border-b pb-2 flex justify-between font-bold">
          <span>SAP PO: 45000123</span>
          <span className="text-blue-600">INTERNAL DOC</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="block text-gray-400 uppercase">Vendor</span>
            <button 
              onClick={() => handleSpot('vendor')}
              className={`block w-full text-left p-1 border ${found.includes('vendor') ? 'bg-red-100 border-red-500 text-red-700' : 'bg-gray-50 border-gray-200'}`}
            >
              [ EMPTY ]
            </button>
          </div>
          <div className="space-y-1">
            <span className="block text-gray-400 uppercase">Currency</span>
            <button 
              onClick={() => handleSpot('currency')}
              className={`block w-full text-left p-1 border ${found.includes('currency') ? 'bg-red-100 border-red-500 text-red-700' : 'bg-gray-50 border-gray-200'}`}
            >
              ¥ (Expected: USD)
            </button>
          </div>
        </div>

        <div className="space-y-1 mt-4">
          <span className="block text-gray-400 uppercase border-b border-gray-100">Item Details</span>
          <div className="flex justify-between py-1 bg-gray-50 px-2 rounded">
            <span>Server Chassis R1</span>
            <button 
              onClick={() => handleSpot('qty')}
              className={`p-1 border ${found.includes('qty') ? 'bg-red-100 border-red-500 text-red-700' : 'bg-transparent border-transparent'}`}
            >
              QTY: 9,999,999
            </button>
          </div>
          <div className="flex justify-between py-1 px-2">
            <span>Memory Module 32GB</span>
            <span>QTY: 50</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
        <span>Errors Found: {found.length}/3</span>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full ${found.length >= i ? 'bg-green-500' : 'bg-gray-200'}`}></div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all"
      >
        Finalize Audit
      </button>
    </div>
  );
};
