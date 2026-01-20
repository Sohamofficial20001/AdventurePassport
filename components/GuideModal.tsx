import React from 'react';

interface GuideModalProps {
  title: string;
  guide: {
    objective: string;
    steps: string[];
    winCondition: string;
  };
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ title, guide, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-xl p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">How to play – {title}</h2>

        <div className="space-y-3 text-sm">
          <p><strong>Objective:</strong> {guide.objective}</p>

          <div>
            <strong>Steps:</strong>
            <ul className="list-disc ml-5 mt-1">
              {guide.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <p><strong>Win condition:</strong> {guide.winCondition}</p>
        </div>
      </div>
    </div>
  );
};
