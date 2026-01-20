import React, { useState, useEffect } from 'react';
import gameData from './data/Certification.json';
import { CertificationData, CertificationDomain } from './types/Certification';
import ScratchCard from './ScratchCard';

interface CertificationProps {
  onComplete: (win: boolean) => void;
}

const domainIcons: { [key: string]: string } = {
  Finance: '💰',
  Manufacturing: '🏭',
  Logistics: '🚚',
  'SAP Technical': '💻',
};

const Certification: React.FC<CertificationProps> = ({ onComplete }) => {
  const [selectedDomain, setSelectedDomain] = useState<CertificationDomain | null>(null);
  const [scratchedCard, setScratchedCard] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [selectedForClaim, setSelectedForClaim] = useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const { domains } = gameData as CertificationData;

  useEffect(() => {
    if (scratchedCard !== null) {
      setSelectedForClaim(scratchedCard);
    }
  }, [scratchedCard]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      onComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onComplete]);

  const handleDomainSelect = (domain: CertificationDomain) => {
    setSelectedDomain(domain);
  };

  const handleScratch = (index: number) => {
    if (scratchedCard === null) {
      setScratchedCard(index);
    }
    setRevealed(true);
  };

  const handleClaimOffer = () => {
    if (selectedForClaim === null) return;
    setGameCompleted(true);
    setCountdown(4);
  };

  /* ---------------- COMPLETION SCREEN ---------------- */

  if (gameCompleted) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
        <h2 className="text-2xl font-bold mb-3">
          Congatulations! 
        </h2>

        <p className="mb-4">
          You are nominated for voucher {' '}
          <strong>{selectedDomain?.options[selectedForClaim!]}</strong>{' '}
          .
        </p>

        {countdown !== null && (
          <div className="text-red-600 font-bold text-3xl animate-pulse">
            {countdown}s
          </div>
        )}
      </div>
    );
  }

  /* ---------------- GAME FLOW ---------------- */

  return (
    <div className="w-full max-w-md mx-auto">
      {!selectedDomain ? (
        <div>
          <h2 className="text-xl font-bold text-center mb-6">
            Choose your domain for certification
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {domains.map((domain) => (
              <button
                key={domain.name}
                onClick={() => handleDomainSelect(domain)}
                className="p-4 bg-gray-100 rounded-xl shadow-md text-lg font-semibold
                           hover:bg-blue-100 hover:shadow-lg transition-all
                           flex flex-col items-center gap-2"
              >
                <span className="text-3xl">{domainIcons[domain.name]}</span>
                <span>{domain.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-center mb-2">
            {revealed
              ? 'Confirm your choice'
              : 'Scratch a card to reveal your voucher'}
          </h2>

          {revealed && (
            <p className="text-sm text-gray-500 text-center mb-6">
              Click on a different card to change your selection, then claim your offer.
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            {selectedDomain.options.map((option, index) => (
              <div
                key={index}
                onClick={() => revealed && setSelectedForClaim(index)}
                className={`rounded-lg text-center transition-all duration-300 transform
                  ${revealed ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : ''}
                  ${selectedForClaim === index ? 'ring-4 ring-green-500' : ''}`}
              >
                {revealed ? (
                  <div
                    className={`w-full h-32 flex items-center justify-center p-2 rounded-lg
                      ${scratchedCard === index ? 'bg-yellow-200' : 'bg-gray-200'}`}
                  >
                    <span className="font-semibold">{option}</span>
                  </div>
                ) : (
                  <ScratchCard onScratch={() => handleScratch(index)}>
                    <span className="font-semibold">{option}</span>
                  </ScratchCard>
                )}
              </div>
            ))}
          </div>

          {revealed && (
            <div className="text-center mt-6">
              <button
                onClick={handleClaimOffer}
                disabled={selectedForClaim === null}
                className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg
                           shadow-lg hover:bg-green-600 transition-all
                           disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Claim Offer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Certification;
