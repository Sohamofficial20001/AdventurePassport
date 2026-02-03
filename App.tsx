import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Passport } from './components/Passport';
import { GameModal } from './components/GameModal';
import { UserProgress, GameStatus, GameMetadata, GAMES_DATA } from './types';
import { Celebration } from './components/Celebration';
import { AdminDashboard } from './components/AdminDashboard';
import { FinalBadge } from './components/FinalBadge';
import { loginWithEmail } from './src/services/authService';
import { rehydrateUser } from './src/services/rehydrateUser';
import { upsertGameProgress } from './src/services/progressService';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProgress | null>(null);
  const [activeGame, setActiveGame] = useState<GameMetadata | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFinalBadge, setShowFinalBadge] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [certificationLink, setCertificationLink] = useState<string | null>(null);

  // 🔥 REHYDRATE ON LOAD
  useEffect(() => {
    const bootstrap = async () => {
      const saved = localStorage.getItem('sap_voyager_user');

      if (!saved) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const cached = JSON.parse(saved);
        const freshUser = await rehydrateUser(cached.userId);

        if (!freshUser) throw new Error('User not found');

        setUser(freshUser);
        localStorage.setItem('sap_voyager_user', JSON.stringify(freshUser));

        const allGames = Object.values(freshUser.games);
        const allWon =
          allGames.length === GAMES_DATA.length &&
          allGames.every((s) => s === GameStatus.WON);

        if (allWon) setShowFinalBadge(true);
      } catch {
        localStorage.removeItem('sap_voyager_user');
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, []);

  const handleLogin = async (email: string, name: string) => {
    const dbUser = await loginWithEmail(email, name);
    setUser(dbUser);
    localStorage.setItem('sap_voyager_user', JSON.stringify(dbUser));

    const allGames = Object.values(dbUser.games);
    const allWon =
      allGames.length === GAMES_DATA.length &&
      allGames.every((s) => s === GameStatus.WON);

    if (allWon) {
      setShowFinalBadge(true);
    }
  };

  const handleGameComplete = (win: boolean, metadata?: Record<string, any>) => {
    if (!activeGame) return;

    if (metadata?.certificationLink) {
      setCertificationLink(metadata.certificationLink);
    }

    updateProgress(
      activeGame.id,
      win ? GameStatus.WON : GameStatus.PARTICIPATED
    );
  };

  const updateProgress = (gameId: number, status: GameStatus) => {
    if (!user) return;

    if (user.games[gameId] === GameStatus.WON && status === GameStatus.PARTICIPATED) {
      return;
    }

    const newUser: UserProgress = {
      ...user,
      games: { ...user.games, [gameId]: status }
    };

    setUser(newUser);
    localStorage.setItem('sap_voyager_user', JSON.stringify(newUser));

    upsertGameProgress(user.userId, gameId, status);

    const allGames = Object.values(newUser.games);
    const allWon =
      allGames.length === GAMES_DATA.length &&
      allGames.every((s) => s === GameStatus.WON);

    if (allWon) {
      // 🚀 Send final badge email
      fetch('/api/send-winner-badge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.userId, // Assuming userId is the email
          userId: user.name,
          certificationLink: certificationLink 
        }),
      });

      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setShowFinalBadge(true);
      }, 2500);
    }
  };

  const logout = () => {
    localStorage.removeItem('sap_voyager_user');
    setUser(null);
    setShowFinalBadge(false);
  };

  if (isBootstrapping) {
    return <div className="min-h-screen flex items-center justify-center">Loading passport...</div>;
  }

  if (!user) return <Auth onLogin={handleLogin} />;
  if (user?.isAdmin) {
    return <AdminDashboard onLogout={logout} />;
  }

  if (showFinalBadge) return <FinalBadge user={user} onLogout={logout} certificationLink={certificationLink} />;

  return (
    // <div className="min-h-screen flex flex-col items-center py-8 px-4">
    <div className="min-h-screen w-full flex flex-col bg-gray-100">
      {showCelebration && <Celebration />}
      <Passport user={user} onOpenGame={setActiveGame} onLogout={logout} />
      {activeGame && (
        <GameModal
          game={activeGame}
          currentStatus={user.games[activeGame.id]}
          userId={user.userId} 
          onClose={() => setActiveGame(null)}
          onComplete={handleGameComplete}
        />
      )}
    </div>
  );
};

export default App;