
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
  type: 'match' | 'flow' | 'tap' | 'error' | 'quiz' | 'ar' | 'astrology' | 'maze' | 'certification';
}

export const GAMES_DATA: GameMetadata[] = [
  { id: 1, title: 'SAP Portfolio Picker', description: 'Select the correct SAP offerings across Data, AI, and Cloud.', icon: '🧩', type: 'match' },
  // { id: 7, title: 'ERP Flow Builder', description: 'Sequence the sales-to-cash process.', icon: '🔄', type: 'flow' },
  // { id: 8, title: 'Term Fast Tap', description: 'Tap SAP terms quickly!', icon: '⚡', type: 'tap' },
  { id: 2, title: 'Anomaly Detective', description: 'Spot data errors in documents.', icon: '🔍', type: 'error' },
  // { id: 9, title: 'Founder Quest', description: 'A final trivia challenge.', icon: '👑', type: 'quiz' },
  { id: 3, title: 'SAP Astrology', description: 'SAP Astrology Wheel.', icon: '🔮', type: 'astrology' },
  { id: 4, title: 'SAP Toss', description: 'AR ball throw.', icon: '🏀', type: 'ar' },  
  { id: 5, title: 'SAP Activate Navigator', description: 'Navigate the airplane through a maze.', icon: '🧭', type: 'maze' },
  { id: 6, title: 'SAP Certification Voucher', description: 'Choose your domain and get a voucher.', icon: '📜', type: 'certification' },
];
