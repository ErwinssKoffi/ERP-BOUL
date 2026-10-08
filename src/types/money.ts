/**
 * Exact Financial Money Value Object (XOF / Franc CFA)
 * Prevents IEEE-754 floating-point rounding bugs in finance, POS, and recipe costing.
 * Stored internally as integer cents (1 FCFA = 100 cents) for ultra-precise costing,
 * or rounded cleanly to nearest legal FCFA for cash transactions.
 */

export interface Money {
  /** Valeur exacte en centièmes de FCFA (1 FCFA = 100 centièmes) */
  cents: bigint;
  currency: "XOF";
}

export type RoundingMode = "HALF_UP" | "FLOOR" | "CEIL" | "TRUNCATE";
