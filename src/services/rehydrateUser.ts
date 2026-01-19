import { supabase } from '../lib/supabase';
import { GameStatus, UserProgress, GAMES_DATA } from '../../types';

export const rehydrateUser = async (
  email: string
): Promise<UserProgress | null> => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1️⃣ Fetch user
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, name')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (error || !user) return null;

  // 2️⃣ Fetch progress
  const { data: progress } = await supabase
    .from('game_progress')
    .select('game_id, status')
    .eq('user_id', user.id);

  const games: Record<number, GameStatus> = Object.fromEntries(
    GAMES_DATA.map((g) => {
      const row = progress?.find((p) => p.game_id === g.id);
      return [g.id, row?.status ?? GameStatus.UNLOCKED];
    })
  );

  return {
    userId: user.email,
    name: user.name,
    games
  };
};
