export interface SapAstrologyConfig {
  ui: {
    title: string;
    instruction: string;
    spinLabel: string;
  };
  questions: {
    id: string;
    question: string;
    options: {
      id: string;
      label: string;
      result: string;
    }[];
  }[];
}
