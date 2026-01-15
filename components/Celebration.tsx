import React, { useEffect } from "react";
import confetti from "canvas-confetti";

export const Celebration = () => {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 6,
        spread: 80,
        startVelocity: 40,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-[999] bg-black/70 backdrop-blur">
      <h1 className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg">
        🎉 Congratulations! 🎉
      </h1>
      <p className="mt-4 text-white text-lg">
        You completed all missions successfully!
      </p>
    </div>
  );
};
