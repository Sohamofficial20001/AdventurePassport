export interface ErrorSpotConfig {
  errors: {
    id: string;
    description: string;
  }[];
  ui: {
    title: string;
    instruction: string;
    submitLabel: string;
  };
  document: {
    poNumber: string;
    currencyShown: string;
    currencyExpected: string;
    qtyWrong: string;
    item1: string;
    item2: string;
  };
}
