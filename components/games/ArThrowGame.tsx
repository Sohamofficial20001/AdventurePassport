import React, { useEffect } from "react";

export const ArThrowGame: React.FC<{ onFinish: (win: boolean) => void }> = ({ onFinish }) => {

  useEffect(() => {
    // open AR game
    window.open("/games/ARThrow.html", "_blank");

    // listen for AR result
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "AR_GAME_RESULT") {
        onFinish(event.data.win);   // EXACTLY like other games
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onFinish]);

  return (
    <div className="text-center text-gray-600">
      The AR game opened in a new tab. Complete it to continue.
    </div>
  );
};
