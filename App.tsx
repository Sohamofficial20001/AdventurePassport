
// import React, { useState, useEffect } from 'react';
// import { Auth } from './components/Auth';
// import { Passport } from './components/Passport';
// import { GameModal } from './components/GameModal';
// import { UserProgress, GameStatus, GAMES_DATA, GameMetadata } from './types';

// const App: React.FC = () => {
//   const [user, setUser] = useState<UserProgress | null>(null);
//   const [activeGame, setActiveGame] = useState<GameMetadata | null>(null);

//   useEffect(() => {
//     const saved = localStorage.getItem('sap_voyager_user');
//     if (saved) {
//       setUser(JSON.parse(saved));
//     }
//   }, []);

//   const handleLogin = (code: string) => {
//     const newUser: UserProgress = {
//       userId: code,
//       games: {
//         1: GameStatus.UNLOCKED,
//         2: GameStatus.UNLOCKED,
//         3: GameStatus.UNLOCKED,
//         4: GameStatus.UNLOCKED,
//         5: GameStatus.UNLOCKED,
//       }
//     };
//     setUser(newUser);
//     localStorage.setItem('sap_voyager_user', JSON.stringify(newUser));
//   };

//   const updateProgress = (gameId: number, status: GameStatus) => {
//     if (!user) return;

//     // Once won, don't downgrade to participated
//     const currentStatus = user.games[gameId];
//     if (currentStatus === GameStatus.WON && status === GameStatus.PARTICIPATED) return;

//     const newUser = {
//       ...user,
//       games: {
//         ...user.games,
//         [gameId]: status
//       }
//     };
//     setUser(newUser);
//     localStorage.setItem('sap_voyager_user', JSON.stringify(newUser));
//   };

//   const logout = () => {
//     localStorage.removeItem('sap_voyager_user');
//     setUser(null);
//   };

//   // 🔥 check if ALL games are WON now
//   const allWon = Object.values(newUser.games).every(
//     (s) => s === GameStatus.WON
//   );

//   if (allWon) {
//     console.log("ALL GAMES WON — sending badge email");
//     sendWinnerEmail(newUser.userId);
//   }
// };

// const sendWinnerEmail = async (email: string) => {
//   try {
//     await fetch('http://localhost:4000/api/send-winner-badge', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         email,
//         userId: email
//       })
//     });
//   } catch (err) {
//     console.error('Failed to send winner email', err);
//   }
// };

// if (!user) {
//   return <Auth onLogin={handleLogin} />;
// }

// return (
//   <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
//     <div className="max-w-md w-full space-y-6">
//       <Passport
//         user={user}
//         onOpenGame={(g) => setActiveGame(g)}
//         onLogout={logout}
//       />
//     </div>

//     {activeGame && (
//       <GameModal
//         game={activeGame}
//         currentStatus={user.games[activeGame.id]}
//         onClose={() => setActiveGame(null)}
//         onComplete={(win) => {
//           updateProgress(activeGame.id, win ? GameStatus.WON : GameStatus.PARTICIPATED);
//         }}
//       />
//     )}
//   </div>
// );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Passport } from './components/Passport';
import { GameModal } from './components/GameModal';
import { UserProgress, GameStatus, GameMetadata } from './types';
import { Celebration } from './components/Celebration';
import { FinalBadge } from './components/FinalBadge';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProgress | null>(null);
  const [activeGame, setActiveGame] = useState<GameMetadata | null>(null);

  // ⭐ NEW STATES ⭐
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFinalBadge, setShowFinalBadge] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sap_voyager_user');
    if (saved) {
      const parsed = JSON.parse(saved);

      setUser(parsed);

      // if user already completed earlier, show final badge directly
      const allWon = Object.values(parsed.games).every(
        (s: GameStatus) => s === GameStatus.WON
      );
      if (allWon) {
        setShowFinalBadge(true);
      }
    }
  }, []);

  const handleLogin = (email: string, name: string) => {
    const newUser: UserProgress = {
      userId: email,
      name: name,   
      games: {
        1: GameStatus.UNLOCKED,
        2: GameStatus.UNLOCKED,
        3: GameStatus.UNLOCKED,
        4: GameStatus.UNLOCKED,
        5: GameStatus.UNLOCKED,
        6: GameStatus.UNLOCKED,
      }
    };

    setUser(newUser);
    localStorage.setItem('sap_voyager_user', JSON.stringify(newUser));
  };

  const sendWinnerEmail = async (email: string) => {
    try {
      await fetch('http://localhost:4000/api/send-winner-badge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userId: email })
      });

      console.log("Winner email API triggered");
    } catch (err) {
      console.error('Failed to send winner email', err);
    }
  };

  const updateProgress = (gameId: number, status: GameStatus) => {
    if (!user) return;

    const currentStatus = user.games[gameId];
    if (currentStatus === GameStatus.WON && status === GameStatus.PARTICIPATED) return;

    const newUser: UserProgress = {
      ...user,
      games: {
        ...user.games,
        [gameId]: status
      }
    };

    setUser(newUser);
    localStorage.setItem('sap_voyager_user', JSON.stringify(newUser));

    // ⭐ CHECK ALL WON ⭐
    const allWon = Object.values(newUser.games).every(
      (s) => s === GameStatus.WON
    );

    if (allWon) {
      console.log("ALL GAMES WON 🎉 Sending Email + Celebration");

      sendWinnerEmail(newUser.userId);

      setShowCelebration(true);   // show confetti
      setTimeout(() => {
        setShowCelebration(false);
        setShowFinalBadge(true);  // move to badge page
      }, 2500); // waits 4.5 sec then go to final page
    }
  };

  const logout = () => {
    localStorage.removeItem('sap_voyager_user');
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  if (showFinalBadge) {
    return <FinalBadge user={user} onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      {showCelebration && <Celebration />}

      <div className="max-w-md w-full space-y-6">
        <Passport
          user={user}
          onOpenGame={(g) => setActiveGame(g)}
          onLogout={logout}
        />
      </div>

      {activeGame && (
        <GameModal
          game={activeGame}
          currentStatus={user.games[activeGame.id]}
          onClose={() => setActiveGame(null)}
          onComplete={(win) => {
            updateProgress(
              activeGame.id,
              win ? GameStatus.WON : GameStatus.PARTICIPATED
            );
          }}
        />
      )}
    </div>
  );
};

export default App;


// import React, { useState, useEffect } from 'react';
// import { Auth } from './components/Auth';
// import { Passport } from './components/Passport';
// import { GameModal } from './components/GameModal';
// import { UserProgress, GameStatus, GameMetadata } from './types';
// import { Celebration } from './components/Celebration';
// import { FinalBadge } from './components/FinalBadge';


// const App: React.FC = () => {
//   const [user, setUser] = useState<UserProgress | null>(null);
//   const [activeGame, setActiveGame] = useState<GameMetadata | null>(null);
//   const [showCelebration, setShowCelebration] = useState(false);
//   const [showFinalBadge, setShowFinalBadge] = useState(false);


//   // ----------------------------
//   // Load saved progress if exists
//   // ----------------------------
//   useEffect(() => {
//     const saved = localStorage.getItem('sap_voyager_user');
//     if (saved) {
//       setUser(JSON.parse(saved));
//     }
//   }, []);

//   // ----------------------------
//   // Login creates fresh profile
//   // ----------------------------
//   const handleLogin = (email: string) => {
//     const newUser: UserProgress = {
//       userId: email,
//       games: {
//         1: GameStatus.UNLOCKED,
//         2: GameStatus.UNLOCKED,
//         3: GameStatus.UNLOCKED,
//         4: GameStatus.UNLOCKED,
//         5: GameStatus.UNLOCKED,
//         6: GameStatus.UNLOCKED,
//       }
//     };

//     setUser(newUser);
//     localStorage.setItem('sap_voyager_user', JSON.stringify(newUser));
//   };

//   // ----------------------------
//   // Backend call to send winner badge email
//   // ----------------------------
//   const sendWinnerEmail = async (email: string) => {
//     try {
//       await fetch('http://localhost:4000/api/send-winner-badge', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email,
//           userId: email
//         })
//       });

//       console.log("Winner email API triggered");
//     } catch (err) {
//       console.error('Failed to send winner email', err);
//     }
//   };

//   // ----------------------------
//   // Update progress for games
//   // ----------------------------
//   const updateProgress = (gameId: number, status: GameStatus) => {
//     if (!user) return;

//     // don't downgrade WON -> PARTICIPATED
//     const currentStatus = user.games[gameId];
//     if (currentStatus === GameStatus.WON && status === GameStatus.PARTICIPATED) return;

//     const newUser: UserProgress = {
//       ...user,
//       games: {
//         ...user.games,
//         [gameId]: status
//       }
//     };

//     setUser(newUser);
//     localStorage.setItem('sap_voyager_user', JSON.stringify(newUser));

//     // ----------------------------
//     // WINNER CHECK (🔥 email trigger)
//     // ----------------------------


//     // const allWon = Object.values(newUser.games).every(
//     //   (s) => s === GameStatus.WON
//     // );

//     // if (allWon) {
//     //   console.log("ALL GAMES WON — sending badge email 🎉");
//     //   sendWinnerEmail(newUser.userId);
//     // }

//     const allWon = Object.values(newUser.games).every(
//       (s) => s === GameStatus.WON
//     );

//     if (allWon) {
//       console.log("ALL GAMES WON 🎉 Sending Email + Celebration");

//       sendWinnerEmail(newUser.userId);

//       setShowCelebration(true);   // show confetti
//       setTimeout(() => {
//         setShowCelebration(false);
//         setShowFinalBadge(true);  // move to badge page
//       }, 4500); // waits 4.5 sec then go to final page
//     }
//   };

//   };

//   // ----------------------------
//   // Logout - clear local storage
//   // ----------------------------
//   const logout = () => {
//     localStorage.removeItem('sap_voyager_user');
//     setUser(null);
//   };

//   // ----------------------------
//   // If user not logged in
//   // ----------------------------
//   if (!user) {
//     return <Auth onLogin={handleLogin} />;
//   }

//   // ----------------------------
//   // Main App UI
//   // ----------------------------
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
//       <div className="max-w-md w-full space-y-6">
//         <Passport
//           user={user}
//           onOpenGame={(g) => setActiveGame(g)}
//           onLogout={logout}
//         />
//       </div>

//       {activeGame && (
//         <GameModal
//           game={activeGame}
//           currentStatus={user.games[activeGame.id]}
//           onClose={() => setActiveGame(null)}
//           onComplete={(win) => {
//             updateProgress(
//               activeGame.id,
//               win ? GameStatus.WON : GameStatus.PARTICIPATED
//             );
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default App;
