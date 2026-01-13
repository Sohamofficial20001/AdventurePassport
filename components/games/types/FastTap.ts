export interface FastTapConfig {
  name: string;
  description: string;
  timerSeconds: number;
  pointsCorrect: number;
  pointsWrong: number;
  winThreshold: number;
  sapTerms: string[];
  dummyTerms: string[];
  ui: {
    startLabel: string;
    sapButtonLabel: string;
    notSapButtonLabel: string;
    missionTitle: string;
  };
}
