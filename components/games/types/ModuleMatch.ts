export interface ModuleMatchConfig {
  topics: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}
