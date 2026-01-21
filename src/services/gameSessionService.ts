import { supabase } from '../lib/supabase';

type GameOutcome = 'WON' | 'PARTICIPATED';

export const saveGameSession = async (
  userEmail: string,
  gameId: number,
  outcome: GameOutcome,
  metadata: Record<string, any>
) => {
  // 1️⃣ Resolve user UUID from email
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', userEmail.toLowerCase())
    .single();

  if (userError || !user) {
    console.error('User lookup failed', userError);
    throw userError;
  }

  // 2️⃣ Insert session using UUID
  const { error: insertError } = await supabase
    .from('game_sessions')
    .insert({
      user_id: user.id,      // ✅ UUID ONLY
      game_id: gameId,
      outcome,
      metadata,
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error('Session insert failed', insertError);
    throw insertError;
  }

  console.log('✅ Astrology session saved');
};
