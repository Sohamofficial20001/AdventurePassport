
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (code: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6 && /^\d+$/.test(code)) {
      onLogin(code);
    } else {
      setError('Please enter a valid 6-digit code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001e46] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border-t-8 border-[#008fd3]">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✈️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">SAP Voyager</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your travel code to begin your enterprise journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              placeholder="0 0 0 0 0 0"
              className="w-full text-center text-3xl tracking-widest py-4 border-2 border-gray-200 rounded-xl focus:border-[#008fd3] focus:outline-none transition-colors"
            />
            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#008fd3] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 active:scale-95 transition-all shadow-lg"
          >
            Open Passport
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <span className="text-xs text-gray-400 uppercase tracking-widest barcode-font text-2xl">
            SCANNER COMING SOON
          </span>
        </div>
      </div>
    </div>
  );
};
