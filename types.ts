
export enum GameStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  PARTICIPATED = 'PARTICIPATED',
  WON = 'WON'
}

export interface UserProgress {
  userId: string;
  name: string;
  isAdmin?: boolean;
  games: Record<number, GameStatus>;
}

export interface GameMetadata {
  id: number;
  title: string;
  description: string;
  icon: string;
  type: 'match' | 'flow' | 'tap' | 'error' | 'quiz' | 'ar' | 'astrology' | 'maze';
}

export const GAMES_DATA: GameMetadata[] = [
  { id: 1, title: 'Module Match', description: 'Match business scenarios to SAP modules.', icon: '🏢', type: 'match' },
  // { id: 2, title: 'ERP Flow Builder', description: 'Sequence the sales-to-cash process.', icon: '🔄', type: 'flow' },
  // { id: 3, title: 'Term Fast Tap', description: 'Tap SAP terms quickly!', icon: '⚡', type: 'tap' },
  { id: 4, title: 'Anomaly Detective', description: 'Spot data errors in documents.', icon: '🔍', type: 'error' },
  // { id: 5, title: 'Founder Quest', description: 'A final trivia challenge.', icon: '👑', type: 'quiz' },
  { id: 7, title: 'SAP Astrology', description: 'SAP Astrology Wheel.', icon: '🔮', type: 'astrology' },
  { id: 6, title: 'AR Throw', description: 'AR ball throw.', icon: '🎯', type: 'ar' },  
  { id: 8, title: 'Project Design Maze', description: 'Navigate the airplane through a maze.', icon: '✈️', type: 'maze' },
  { id: 9, title: '', description: '', icon: '', type: 'maze' },
  { id: 10, title: '', description: '', icon: '', type: 'maze' },
];
