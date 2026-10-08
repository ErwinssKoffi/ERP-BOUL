import test from "node:test";
import assert from "node:assert/strict";

const UNITS = {
  kg: { code: "kg", dimension: "mass", base: "kg", factor: 1 },
  g: { code: "g", dimension: "mass", base: "kg", factor: 0.001 },
  sac: { code: "sac", dimension: "mass", base: "kg", factor: 50 },
  L: { code: "L", dimension: "volume", base: "L", factor: 1 },
  mL: { code: "mL", dimension: "volume", base: "L", factor: 0.001 },
};

function convert(qty, from, to) {
  const f = UNITS[from];
  const t = UNITS[to];
  if (!f || !t) throw new Error("Unit not found");
  if (f.dimension !== t.dimension) throw new Error("Dimension mismatch");
  const inBase = qty * f.factor;
  return inBase / t.factor;
}

test("Unit Engine - Conversion 10 sacs de farine en kg", () => {
  // 10 sacs de 50kg = 500 kg
  const kg = convert(10, "sac", "kg");
  assert.equal(kg, 500);
});

test("Unit Engine - Conversion 500g de levure en kg", () => {
  const kg = convert(500, "g", "kg");
  assert.equal(kg, 0.5);
});

test("Unit Engine - Rejet conversion masse vers volume sans densité", () => {
  assert.throws(() => {
    convert(5, "kg", "L");
  }, /Dimension mismatch/);
});
