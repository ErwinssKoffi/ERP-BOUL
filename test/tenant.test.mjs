import test from "node:test";
import assert from "node:assert/strict";

function checkTenantIsolation(userTenantId, requestedResourceTenantId) {
  if (userTenantId !== requestedResourceTenantId) {
    throw new Error(`Isolation Multi-Tenant Violation : tenant [${userTenantId}] cannot access [${requestedResourceTenantId}]`);
  }
  return true;
}

test("Multi-Tenancy - Autorise l'accès aux ressources du même tenant", () => {
  const allowed = checkTenantIsolation("ten_abidjan_01", "ten_abidjan_01");
  assert.equal(allowed, true);
});

test("Multi-Tenancy - Bloque formellement toute fuite inter-tenant", () => {
  assert.throws(() => {
    checkTenantIsolation("ten_abidjan_01", "ten_bouake_02");
  }, /Isolation Multi-Tenant Violation/);
});
