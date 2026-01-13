export interface ModuleMatchConfig {
  modules: Array<{
    id: string;
    name: string;
    scenario: string;
  }>;
  ui: {
    feedbackSelectFirst: string;
    submitLabel: string;
  };
  rules: {
    requiredCorrectToWin: number;
  };
}
