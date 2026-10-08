export const CURRENCY_CONFIG = {
  code: "XOF",
  name: "Franc CFA BCEAO",
  symbol: "FCFA",
  locale: "fr-CI",
  minorUnitFactor: 100n, // 1 FCFA = 100 centièmes internes pour calculs exacts
  cashRoundingUnit: 5, // Arrondi de caisse pour rendu de monnaie usuel en Côte d'Ivoire (5 ou 1 FCFA)
  allowDecimalsInPos: false, // En caisse réelle à Abidjan, les pièces sont des entiers (5, 10, 25, 50, 100, 200, 500 FCFA)
  allowDecimalsInCosting: true, // Dans le costing de recette, 1g de sel ou 1g de levure coûte une fraction de FCFA
};
