
import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Passport } from './components/Passport';
import { GameModal } from './components/GameModal';
import { UserProgress, GameStatus, GAMES_DATA, GameMetadata } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProgress | null>(null);
  const [activeGame, setActiveGame] = useState<GameMetadata | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sap_voyager_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (code: string) => {
    const newUser: UserProgress = {
      userId: code,
      games: {
        1: GameStatus.UNLOCKED,
        2: GameStatus.UNLOCKED,
        3: GameStatus.UNLOCKED,
        4: GameStatus.UNLOCKED,
        5: GameStatus.UNLOCKED,
      }
    };
    setUser(newUser);
    localStorage.setItem('sap_voyager_user', JSON.stringify(newUser));
  };

  const updateProgress = (gameId: number, status: GameStatus) => {
    if (!user) return;
    
    // Once won, don't downgrade to participated
    const currentStatus = user.games[gameId];
    if (currentStatus === GameStatus.WON && status === GameStatus.PARTICIPATED) return;

    const newUser = {
      ...user,
      games: {
        ...user.games,
        [gameId]: status
      }
    };
    setUser(newUser);
    localStorage.setItem('sap_voyager_user', JSON.stringify(newUser));
  };

  const logout = () => {
    localStorage.removeItem('sap_voyager_user');
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
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
            updateProgress(activeGame.id, win ? GameStatus.WON : GameStatus.PARTICIPATED);
          }}
        />
      )}
    </div>
  );
};

export default App;
