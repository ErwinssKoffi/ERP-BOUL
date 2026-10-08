import test from "node:test";
import assert from "node:assert/strict";

function hasPermission(userRoles, permissionsByRole, requiredPermission) {
  if (userRoles.includes("SUPER_ADMIN")) return true;
  for (const role of userRoles) {
    const perms = permissionsByRole[role] || [];
    if (perms.includes(requiredPermission)) return true;
  }
  return false;
}

const mockRoles = {
  CAISSIER: ["pos.operate", "sales.create", "sales.view", "cash.open", "cash.close"],
  CHEF_BOULANGER: ["recipes.manage", "production.plan", "production.validate", "stock.waste"],
  GERANT_BOUTIQUE: ["pos.operate", "sales.create", "sales.cancel", "sales.refund", "cash.close", "stock.adjust"],
  SUPER_ADMIN: ["all"],
};

test("RBAC - Caissier peut opérer POS mais pas modifier une recette", () => {
  const isAllowedPos = hasPermission(["CAISSIER"], mockRoles, "pos.operate");
  const isAllowedRecipe = hasPermission(["CAISSIER"], mockRoles, "recipes.manage");

  assert.equal(isAllowedPos, true);
  assert.equal(isAllowedRecipe, false);
});

test("RBAC - Chef Boulanger peut valider la production mais pas rembourser une vente", () => {
  const isAllowedProd = hasPermission(["CHEF_BOULANGER"], mockRoles, "production.validate");
  const isAllowedRefund = hasPermission(["CHEF_BOULANGER"], mockRoles, "sales.refund");

  assert.equal(isAllowedProd, true);
  assert.equal(isAllowedRefund, false);
});

test("RBAC - Super Admin a tous les droits", () => {
  assert.equal(hasPermission(["SUPER_ADMIN"], mockRoles, "fiscal.certify"), true);
  assert.equal(hasPermission(["SUPER_ADMIN"], mockRoles, "settings.manage"), true);
});
