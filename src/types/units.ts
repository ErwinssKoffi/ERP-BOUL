export type UnitDimension = "mass" | "volume" | "count" | "packaging";

export type BaseUnitCode = "kg" | "g" | "L" | "mL" | "piece";

export type ConfigurableUnitCode =
  | "kg"
  | "g"
  | "mg"
  | "L"
  | "mL"
  | "cl"
  | "sac" // e.g. sac de farine 50kg ou sac de sucre 50kg
  | "carton" // e.g. carton de levure 10kg, carton d'huile 15L
  | "paquet" // e.g. paquet de sel 1kg, paquet d'améliorant 500g
  | "piece" // pièce unitaire (pain, croissant, sachet)
  | "plaque" // plaque de cuisson (e.g. 24 baguettes)
  | "tournee"; // tournée de pétrin (e.g. 150 kg de pâte)

export interface UnitDefinition {
  code: ConfigurableUnitCode;
  name: string; // Nom lisible (e.g. "Sac de Farine 50kg")
  dimension: UnitDimension;
  baseUnit: BaseUnitCode;
  conversionFactorToBase: number; // e.g. sac -> 50 pour base kg
  isPackaging: boolean;
  defaultPackageSize?: number;
}

export interface UnitConversionResult {
  fromUnit: ConfigurableUnitCode;
  toUnit: ConfigurableUnitCode;
  fromQuantity: number;
  toQuantity: number;
  exactFactor: number;
}
