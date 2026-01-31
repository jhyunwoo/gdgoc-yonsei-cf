import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./db/schema";

/**
 * getDB() is async (needs Cloudflare context), so we cannot pass it to
 * drizzleAdapter at module load time. Create auth with the actual DB instance
 * per request to avoid "Cannot read properties of undefined (reading 'fullSchema')".
 */
export function createAuth(db: DrizzleD1Database<typeof schema>) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
  });
}
