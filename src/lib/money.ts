import { Money, RoundingMode } from "@/types/money";
import { CURRENCY_CONFIG } from "@/config/currency";

const SCALE = 100n; // 1 FCFA = 100 centièmes internes

/**
 * Crée un objet Money à partir d'un montant entier de FCFA
 */
export function moneyFromFCFA(amount: number | bigint): Money {
  const bigintAmount = typeof amount === "bigint" ? amount : BigInt(Math.round(amount));
  return {
    cents: bigintAmount * SCALE,
    currency: "XOF",
  };
}

/**
 * Crée un objet Money à partir d'un montant précis en FCFA (pouvant avoir des décimales, ex: 14.75 FCFA)
 */
export function moneyFromDecimalFCFA(amount: number): Money {
  // Convertir le montant décimal en centièmes avec un arrondi sûr
  const cents = BigInt(Math.round(amount * 100));
  return {
    cents,
    currency: "XOF",
  };
}

/**
 * Crée un objet Money directement depuis ses centièmes internes
 */
export function moneyFromCents(cents: bigint | number): Money {
  return {
    cents: typeof cents === "bigint" ? cents : BigInt(cents),
    currency: "XOF",
  };
}

/**
 * Addition financière exacte
 */
export function addMoney(a: Money, b: Money): Money {
  return {
    cents: a.cents + b.cents,
    currency: "XOF",
  };
}

/**
 * Soustraction financière exacte
 */
export function subMoney(a: Money, b: Money): Money {
  return {
    cents: a.cents - b.cents,
    currency: "XOF",
  };
}

/**
 * Multiplication exacte par un facteur (quantité ou coefficient)
 */
export function multiplyMoney(m: Money, factor: number | bigint, rounding: RoundingMode = "HALF_UP"): Money {
  if (typeof factor === "bigint") {
    return {
      cents: m.cents * factor,
      currency: "XOF",
    };
  }

  // Éviter les imprécisions flottantes en multipliant par 10000 puis division
  const scaledFactor = BigInt(Math.round(factor * 10000));
  const rawProduct = m.cents * scaledFactor;
  
  let result: bigint;
  if (rounding === "HALF_UP") {
    const remainder = rawProduct % 10000n;
    const quotient = rawProduct / 10000n;
    if (remainder >= 5000n || remainder <= -5000n) {
      result = quotient + (rawProduct > 0n ? 1n : -1n);
    } else {
      result = quotient;
    }
  } else {
    result = rawProduct / 10000n;
  }

  return {
    cents: result,
    currency: "XOF",
  };
}

/**
 * Division financière avec mode d'arrondi
 */
export function divideMoney(m: Money, divisor: number | bigint): Money {
  const bigDivisor = typeof divisor === "bigint" ? divisor : BigInt(Math.round(divisor));
  if (bigDivisor === 0n) {
    throw new Error("Division financière par zéro impossible");
  }
  return {
    cents: m.cents / bigDivisor,
    currency: "XOF",
  };
}

/**
 * Convertit en entier FCFA pour affichage ou encaissement caisse
 */
export function toFCFA(m: Money): number {
  return Number(m.cents / SCALE);
}

/**
 * Convertit en nombre décimal précis (pour analyse de coût de revient unitaire)
 */
export function toDecimalFCFA(m: Money): number {
  return Number(m.cents) / 100;
}

/**
 * Formate le montant selon les normes ivoiriennes et de l'espace UEMOA
 * Exemple: "1 250 FCFA" ou "14,75 FCFA"
 */
export function formatFCFA(
  money: Money,
  options?: {
    showDecimals?: boolean;
    symbol?: string;
  }
): string {
  const symbol = options?.symbol ?? CURRENCY_CONFIG.symbol;
  const isDecimalNeeded = options?.showDecimals ?? (money.cents % SCALE !== 0n);

  if (isDecimalNeeded) {
    const value = toDecimalFCFA(money);
    const fixed = value.toFixed(2);
    const [intPart, decPart] = fixed.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${formattedInt},${decPart} ${symbol}`;
  }

  const value = toFCFA(money);
  const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} ${symbol}`;
}
