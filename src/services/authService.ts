// import { supabase } from '../lib/supabase';
// import { GameStatus, UserProgress, GAMES_DATA } from '../../types';

// // reuse your existing function (move it here if needed)
// const generateEmailId6 = (email: string): string => {
//     let hash = 2166136261;

//     for (let i = 0; i < email.length; i++) {
//         hash ^= email.charCodeAt(i);
//         hash +=
//             (hash << 1) +
//             (hash << 4) +
//             (hash << 7) +
//             (hash << 8) +
//             (hash << 24);
//     }

//     const sixDigit = Math.abs(hash % 1000000);
//     return sixDigit.toString().padStart(6, '0');
// };

// export const loginWithEmail = async (
//     email: string,
//     name: string
// ): Promise<UserProgress> => {
//     const normalizedEmail = email.trim().toLowerCase();

//     // 1️⃣ Try to fetch existing user
//     const { data: existingUser, error: fetchError } = await supabase
//         .from('users')
//         .select('*')
//         .eq('email', normalizedEmail)
//         .maybeSingle();

//     if (fetchError) {
//         throw fetchError;
//     }

//     let user = existingUser;

//     // 2️⃣ If not found, create new user
//     if (!user) {
//         const { data: newUser, error: insertError } = await supabase
//             .from('users')
//             .insert({
//                 email: normalizedEmail,
//                 name,
//                 passport_id: generateEmailId6(normalizedEmail)
//             })
//             .select()
//             .single();

//         if (insertError || !newUser) {
//             throw insertError;
//         }

//         user = newUser;
//     }

//     // 3️⃣ Fetch game progress
//     const { data: progress, error: progressError } = await supabase
//         .from('game_progress')
//         .select('game_id, status')
//         .eq('user_id', user.id);

//     if (progressError) {
//         throw progressError;
//     }

//     // 4️⃣ Normalize games map
//     const games: Record<number, GameStatus> = Object.fromEntries(
//         GAMES_DATA.map((g) => {
//             const row = progress?.find((p) => p.game_id === g.id);
//             return [g.id, row?.status ?? GameStatus.UNLOCKED];
//         })
//     );

//     return {
//         userId: user.email,
//         name: user.name,
//         games
//     };
// };

import { supabase } from '../lib/supabase';
import { GameStatus, UserProgress, GAMES_DATA } from '../../types';

const generateEmailId6 = (email: string): string => {
  let hash = 2166136261;

  for (let i = 0; i < email.length; i++) {
    hash ^= email.charCodeAt(i);
    hash +=
      (hash << 1) +
      (hash << 4) +
      (hash << 7) +
      (hash << 8) +
      (hash << 24);
  }

  const sixDigit = Math.abs(hash % 1000000);
  return sixDigit.toString().padStart(6, '0');
};

export const loginWithEmail = async (
  email: string,
  name: string
): Promise<UserProgress> => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1️⃣ Fetch or create user
  const { data: user, error } = await supabase
    .from('users')
    .upsert(
      {
        email: normalizedEmail,
        name,
        passport_id: generateEmailId6(normalizedEmail)
      },
      { onConflict: 'email' }
    )
    .select()
    .single();

  if (error || !user) {
    throw error;
  }

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
    isAdmin: user.is_admin,
    games
  };
};
