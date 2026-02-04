// import React, { useEffect } from "react";

// export const ArThrowGame: React.FC<{ onFinish: (win: boolean) => void }> = ({ onFinish }) => {

//   useEffect(() => {
//     // open AR game
//     window.open("/games/ARThrow.html", "_blank");

//     // listen for AR result
//     const handler = (event: MessageEvent) => {
//       if (event.data?.type === "AR_GAME_RESULT") {
//         onFinish(event.data.win);
//       }
//     };

//     window.addEventListener("message", handler);
//     return () => window.removeEventListener("message", handler);
//   }, [onFinish]);

//   return (
//     <div className="text-center text-gray-600">
//       The AR game opened in a new tab. Complete it to continue.
//     </div>
//   );
// };


import React, { useEffect } from "react";

export const ArThrowGame: React.FC<{
  onFinish: (win: boolean, metadata?: Record<string, any>) => void;
}> = ({ onFinish }) => {

  useEffect(() => {
    window.open("/games/ARThrow.html", "_blank");

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "AR_GAME_RESULT") {
        onFinish(event.data.win, {
          gameType: "ar",
          ...event.data.metadata,
        });
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div className="text-center text-gray-600">
      The AR game opened in a new tab. Complete it to continue.
    </div>
  );
};
