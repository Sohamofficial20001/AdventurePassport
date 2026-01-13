import React, { useState } from 'react';

interface AuthProps {
  onLogin: (email: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isValidEmail(email)) {
      onLogin(email.trim());
    } else {
      setError('Please enter a valid email address');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00152f] p-6">
      <div className="relative aspect-[3/4] w-full max-w-sm 
        flex flex-col justify-between items-center
        rounded-2xl border-4 border-[#c5a059] 
        shadow-2xl overflow-hidden bg-[#1e3a5f] p-8">

        {/* leather texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]" />

        {/* title section */}
        <div className="text-center z-10 mt-2">
          <div className="text-[#c5a059] border-2 border-[#c5a059] px-3 py-1 inline-block rounded mb-3">
            <h2 className="text-sm font-bold tracking-[0.25em] uppercase">SAP experience zone</h2>
          </div>

          <h1 className="text-3xl font-extrabold text-[#c5a059] tracking-widest uppercase">
            Passport
          </h1>

          <div className="h-1 bg-[#c5a059] w-full mt-3" />
        </div>

        {/* emblem */}
        <div className="z-10 w-28 h-28 border-4 border-[#c5a059] rounded-full flex items-center justify-center">
          <span className="text-5xl grayscale opacity-80">🌍</span>
        </div>
        <p className="text-[#c5a059] text-[10px] uppercase tracking-widest opacity-60">
          SAP Voyager Program
        </p>

        {/* login form */}
        <form onSubmit={handleSubmit} className="z-10 w-full space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="name@example.com"
            className="w-full text-center text-xl py-3 
              bg-transparent text-[#c5a059]
              border-2 border-[#c5a059] rounded-xl
              placeholder:text-[#c5a059]/40
              focus:outline-none"
          />

          {error && (
            <p className="text-red-300 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#c5a059] text-[#1e3a5f] py-3 rounded-xl 
              font-bold text-lg shadow-lg active:scale-95 transition-all"
          >
            Onboard
          </button>
        </form>

        {/* footer */}
        <div className="z-10 text-center w-full mb-1">

          <div className="text-sm text-[#c5a059] opacity-70 break-all">
            Sopra Steria India Management kick off 2026
          </div>
        </div>
      </div>
    </div>
  );
};
