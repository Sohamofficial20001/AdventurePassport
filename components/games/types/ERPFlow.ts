export interface ERPFlowConfig {
  steps: string[];
  ui: {
    title: string;
    instruction: string;
    resetLabel: string;
    submitLabel: string;
  };
}
