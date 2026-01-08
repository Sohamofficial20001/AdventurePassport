
export enum GameStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  PARTICIPATED = 'PARTICIPATED',
  WON = 'WON'
}

export interface UserProgress {
  userId: string;
  games: Record<number, GameStatus>;
}

export interface GameMetadata {
  id: number;
  title: string;
  description: string;
  icon: string;
  type: 'match' | 'flow' | 'tap' | 'error' | 'quiz';
}

export const GAMES_DATA: GameMetadata[] = [
  { id: 1, title: 'Module Match', description: 'Match business scenarios to SAP modules.', icon: '🏢', type: 'match' },
  { id: 2, title: 'ERP Flow Builder', description: 'Sequence the sales-to-cash process.', icon: '🔄', type: 'flow' },
  { id: 3, title: 'Term Fast Tap', description: 'Tap SAP terms quickly!', icon: '⚡', type: 'tap' },
  { id: 4, title: 'Data Detective', description: 'Spot data errors in documents.', icon: '🔍', type: 'error' },
  { id: 5, title: 'Founder Quest', description: 'A final trivia challenge.', icon: '👑', type: 'quiz' },
];
