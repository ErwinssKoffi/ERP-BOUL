export type AppEnvironment = "development" | "test" | "staging" | "production";

export interface AppConfig {
  env: AppEnvironment;
  appName: string;
  appUrl: string;
  defaultCurrency: "XOF";
  defaultLocale: string;
  sessionExpirySeconds: number;
  auditRetentionDays: number;
  features: {
    multiTenant: boolean;
    auditLog: boolean;
    rbacEnforcement: boolean;
    mfaSupport: boolean;
    offlineSync: boolean;
  };
}

export const env: AppConfig = {
  env: (process.env.NEXT_PUBLIC_APP_ENV as AppEnvironment) || "development",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "ERP-BOUL",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  defaultCurrency: "XOF",
  defaultLocale: "fr-CI",
  sessionExpirySeconds: 8 * 60 * 60, // 8 heures (durée d'un shift de boulangerie)
  auditRetentionDays: 365 * 10, // 10 ans selon les obligations fiscales et SYSCOHADA en CI
  features: {
    multiTenant: true,
    auditLog: true,
    rbacEnforcement: true,
    mfaSupport: true,
    offlineSync: true,
  },
};
