// export interface ErrorSpotConfig {
//   errors: {
//     id: string;
//     description: string;
//   }[];
//   ui: {
//     title: string;
//     instruction: string;
//     submitLabel: string;
//   };
//   document: {
//     poNumber: string;
//     currencyShown: string;
//     currencyExpected: string;
//     qtyWrong: string;
//     item1: string;
//     item2: string;
//   };
// }


export interface ErrorSpotConfig {
  ui: {
    title: string;
    instruction: string;
    submitLabel: string;
  };
  scenarios: ErrorSpotScenario[];
}

export interface ErrorSpotScenario {
  id: string;
  errors: string[];
  document: {
    poNumber: string;
    vendor?: string | null;
    currencyShown: string;
    currencyExpected: string;
    items: {
      id: string;
      name: string;
      qty: string;
      errorId?: string;
    }[];
  };
}
