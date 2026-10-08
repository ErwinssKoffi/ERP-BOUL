import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { DEMO_BRANCHES, DEMO_USERS } from "@/server/auth/mock-users";

export async function GET() {
  const uptimeSeconds = process.uptime();
  const mem = process.memoryUsage();

  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "erp-boul",
    version: "0.1.0-foundation",
    environment: env.env,
    uptimeSeconds: Math.floor(uptimeSeconds),
    memory: {
      rssMb: Math.round(mem.rss / 1024 / 1024),
      heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
      heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
    },
    multiTenancy: {
      enabled: env.features.multiTenant,
      defaultCurrency: env.defaultCurrency,
      defaultLocale: env.defaultLocale,
      configuredBranches: DEMO_BRANCHES.length,
      registeredUsers: DEMO_USERS.length,
    },
    features: env.features,
  });
}
