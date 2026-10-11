/**
 * Utilitaires de formatage déterministe pour éviter les désynchronisations d'hydratation (SSR / Client)
 */

export function formatNumber(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  const str = Math.round(num).toString();
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatFCFAValue(value: number): string {
  return `${formatNumber(value)} FCFA`;
}
