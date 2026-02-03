import React, { useState, useEffect } from 'react';
import gameData from './data/Certification.json';
import { CertificationData, CertificationDomain } from './types/Certification';
import ScratchCard from './ScratchCard';

interface CertificationProps {
  onComplete: (win: boolean, metadata?: Record<string, any>) => void;
}

const domainIcons: { [key: string]: string } = {
  Finance: '💰',
  Manufacturing: '🏭',
  Logistics: '🚚',
  'SAP Technical': '💻',
};

const certificationLinks: { [key: string]: string } = {
  'SAP S/4HANA Finance': 'https://learning.sap.com/certifications/sap-certified-associate-sap-s-4hana-for-financial-accounting',
  'SAP Central Finance': 'https://learning.sap.com/products/financial-management/central-finance',
  'SAP Treasury and Risk Management': 'https://learning.sap.com/products/financial-management/treasury',
  'SAP Billing and Revenue Innovation Management': 'https://learning.sap.com/certifications/sap-certified-associate-sap-billing-and-revenue-innovation-mgmt-subscription-order-management',
  'SAP S/4HANA Manufacturing': 'https://training.sap.com/course/ts421-sap-s-4hana-production-planning-and-manufacturing-i-classroom-026-in-en?',
  'SAP Digital Manufacturing Cloud': 'https://learning.sap.com/products/supply-chain-management/digital-manufacturing',
  'SAP Integrated Business Planning': 'https://learning.sap.com/products/supply-chain-management/integrated-business-planning',
  'SAP Extended Warehouse Management': 'https://learning.sap.com/certifications/sap-certified-associate-extended-warehouse-management-in-sap-s-4hana',
  'SAP S/4HANA Logistics': 'https://training.sap.com/trainingpath/Applications-Logistics+Execution+&+Warehouse+Management-SAP+S4HANA',
  'SAP Transportation Management': 'https://learning.sap.com/certifications/sap-certified-associate-transportation-management-in-sap-s-4hana',
  'SAP Global Trade Services': 'https://training.sap.com/course/gts100-sap-global-trade-services-overview-classroom-018-g-en',
  'SAP BTP Development': 'https://learning.sap.com/certifications/sap-certified-professional-solution-architect-sap-btp',
  'SAP ABAP Cloud': 'https://learning.sap.com/certifications/sap-certified-associate-back-end-developer-abap-cloud',
  'SAP Fiori Development': 'https://learning.sap.com/certifications/sap-certified-associate-sap-fiori-application-developer-1',
  'SAP Integration Suite': 'https://learning.sap.com/certifications/sap-certified-associate-integration-developer',
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

  // ⏱ Countdown controller
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      if (!selectedDomain || selectedForClaim === null) return;
      
      const claimedOffer = selectedDomain.options[selectedForClaim];
      const link = certificationLinks[claimedOffer] || '#';

      const metadata = {
        gameType: 'certification',
        domain: selectedDomain.name,

        scratched: {
          index: scratchedCard,
          offer: selectedDomain.options[scratchedCard!],
        },

        claimed: {
          index: selectedForClaim,
          offer: claimedOffer,
        },

        changedSelection: scratchedCard !== selectedForClaim,
        totalOptions: selectedDomain.options.length,
        certificationLink: link,
      };


      onComplete(true, metadata);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onComplete, selectedDomain, selectedForClaim, scratchedCard]);

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
    if (!selectedDomain || selectedForClaim === null) return;

    setGameCompleted(true);
    setCountdown(3); // 👈 visible for 3 seconds
  };

  /* ---------------- COMPLETION SCREEN ---------------- */

  if (gameCompleted) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
        <h2 className="text-2xl font-bold mb-3">Congratulations!</h2>

        <p className="mb-4">
          You are nominated to win voucher for {' '} certification.
          <strong>{selectedDomain?.options[selectedForClaim!]}</strong>.
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
                className={`rounded-lg text-center transition-all duration-300
                  ${revealed ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : ''}
                  ${selectedForClaim === index ? 'ring-4 ring-green-500' : ''}`}
              >
                {revealed ? (
                  <div
                    className={`w-full h-32 flex items-center justify-center rounded-lg
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
