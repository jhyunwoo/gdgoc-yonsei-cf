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
    user: {
      additionalFields: {
        firstName: { type: "string", required: true, input: true },
        lastName: { type: "string", required: true, input: true },
        studentId: { type: "number", required: false, input: true },
        major: { type: "string", required: false, input: true },
        role: {
          type: "string",
          required: false, 
          defaultValue: "UNVERIFIED",
          input: false,
        },
      },
    },
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
  });
}
