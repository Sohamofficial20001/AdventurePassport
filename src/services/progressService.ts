import { supabase } from '../lib/supabase';
import { GameStatus } from '../../types';

export const upsertGameProgress = async (
  userEmail: string,
  gameId: number,
  status: GameStatus
) => {
  // 1️⃣ Get user id
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (error || !user) {
    throw error;
  }

  // 2️⃣ Upsert with conflict resolution
  const { error: progressError } = await supabase
    .from('game_progress')
    .upsert(
      {
        user_id: user.id,
        game_id: gameId,
        status
      },
      {
        onConflict: 'user_id,game_id'
      }
    );

  if (progressError) {
    throw progressError;
  }
};
