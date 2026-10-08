import test from "node:test";
import assert from "node:assert/strict";

// Implémentation testable autonome pour le runner Node natif
const SCALE = 100n;

function moneyFromFCFA(amount) {
  return { cents: BigInt(Math.round(amount)) * SCALE, currency: "XOF" };
}

function moneyFromDecimalFCFA(amount) {
  return { cents: BigInt(Math.round(amount * 100)), currency: "XOF" };
}

function addMoney(a, b) {
  return { cents: a.cents + b.cents, currency: "XOF" };
}

function subMoney(a, b) {
  return { cents: a.cents - b.cents, currency: "XOF" };
}

function multiplyMoney(m, factor) {
  const scaledFactor = BigInt(Math.round(factor * 10000));
  const rawProduct = m.cents * scaledFactor;
  const remainder = rawProduct % 10000n;
  const quotient = rawProduct / 10000n;
  const result = (remainder >= 5000n || remainder <= -5000n) ? quotient + (rawProduct > 0n ? 1n : -1n) : quotient;
  return { cents: result, currency: "XOF" };
}

function toFCFA(m) {
  return Number(m.cents / SCALE);
}

function toDecimalFCFA(m) {
  return Number(m.cents) / 100;
}

test("Money Engine - Exact Integer FCFA Addition", () => {
  const baguette = moneyFromFCFA(150); // 150 FCFA
  const croissant = moneyFromFCFA(250); // 250 FCFA
  const total = addMoney(baguette, croissant);

  assert.equal(toFCFA(total), 400);
  assert.equal(total.cents, 40000n);
});

test("Money Engine - Precision in Recipe Costing (Grams of flour)", () => {
  // 1 sac de farine 50kg = 23 500 FCFA
  // 1 kg = 470 FCFA
  // 1 gramme = 0.47 FCFA
  const flourPerGram = moneyFromDecimalFCFA(0.47); // 47 centièmes de FCFA
  // Pour une baguette de 200g contenant 140g de farine :
  const costFlourBaguette = multiplyMoney(flourPerGram, 140);

  // 140 * 0.47 = 65.8 FCFA exact
  assert.equal(toDecimalFCFA(costFlourBaguette), 65.8);
});

test("Money Engine - Soustraction et solde caisse", () => {
  const encaissement = moneyFromFCFA(5000);
  const renduMonnaie = moneyFromFCFA(1850);
  const montantNet = subMoney(encaissement, renduMonnaie);

  assert.equal(toFCFA(montantNet), 3150);
});
