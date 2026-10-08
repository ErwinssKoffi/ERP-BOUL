import { ConfigurableUnitCode, UnitConversionResult, UnitDefinition } from "@/types/units";
import { DEFAULT_BAKERY_UNITS } from "@/config/units";

export class UnitConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnitConversionError";
  }
}

/**
 * Moteur de conversion d'unités de mesure pour les boulangeries
 */
export function convertUnit(
  quantity: number,
  fromUnit: ConfigurableUnitCode,
  toUnit: ConfigurableUnitCode,
  customRegistry: Record<ConfigurableUnitCode, UnitDefinition> = DEFAULT_BAKERY_UNITS
): UnitConversionResult {
  if (fromUnit === toUnit) {
    return {
      fromUnit,
      toUnit,
      fromQuantity: quantity,
      toQuantity: quantity,
      exactFactor: 1,
    };
  }

  const fromDef = customRegistry[fromUnit];
  const toDef = customRegistry[toUnit];

  if (!fromDef) {
    throw new UnitConversionError(`Unité d'origine non reconnue : ${fromUnit}`);
  }
  if (!toDef) {
    throw new UnitConversionError(`Unité cible non reconnue : ${toUnit}`);
  }

  // Vérifier la compatibilité des dimensions (masse vers masse, volume vers volume, etc.)
  if (fromDef.dimension !== toDef.dimension && fromDef.baseUnit !== toDef.baseUnit) {
    throw new UnitConversionError(
      `Incompatibilité de dimension : Impossible de convertir ${fromDef.dimension} (${fromUnit}) en ${toDef.dimension} (${toUnit}) sans masse volumique spécifique.`
    );
  }

  // Convertir d'abord vers l'unité de base
  const quantityInBase = quantity * fromDef.conversionFactorToBase;

  // Convertir ensuite de la base vers l'unité cible
  const toQuantity = quantityInBase / toDef.conversionFactorToBase;
  const exactFactor = fromDef.conversionFactorToBase / toDef.conversionFactorToBase;

  return {
    fromUnit,
    toUnit,
    fromQuantity: quantity,
    toQuantity: Math.round(toQuantity * 100000) / 100000, // Précision 5 décimales
    exactFactor,
  };
}

/**
 * Formate une quantité avec son unité
 * Exemple : "5 sacs (250 kg)" ou "250 g"
 */
export function formatQuantityWithUnit(
  quantity: number,
  unitCode: ConfigurableUnitCode,
  options?: { showBaseEquivalent?: boolean }
): string {
  const unitDef = DEFAULT_BAKERY_UNITS[unitCode];
  const unitLabel = unitDef ? unitDef.code : unitCode;

  if (options?.showBaseEquivalent && unitDef?.isPackaging) {
    const baseQuantity = quantity * unitDef.conversionFactorToBase;
    return `${quantity} ${unitLabel} (${baseQuantity} ${unitDef.baseUnit})`;
  }

  return `${quantity} ${unitLabel}`;
}
