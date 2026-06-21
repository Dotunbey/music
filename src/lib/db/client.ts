import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { logger } from "@/lib/logger";

type DbClient = ReturnType<typeof drizzle>;

let dbClient: DbClient | null = null;
let connectionPool: ReturnType<typeof postgres> | null = null;

const MAX_RETRIES = 2;

function getDatabaseUrl(): string {
  const defaultUrl = process.env.DATABASE_URL;
  const explicitSupabaseUrl = process.env.SUPABASE_DATABASE_URL;
  const databaseUrl = defaultUrl ?? explicitSupabaseUrl;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL or SUPABASE_DATABASE_URL must be set before submitting inquiries.",
    );
  }

  return databaseUrl;
}

async function healthCheck(): Promise<boolean> {
  if (!connectionPool) return false;
  try {
    const start = Date.now();
    await connectionPool`SELECT 1`;
    const elapsed = Date.now() - start;
    if (elapsed > 500) {
      logger.warn({
        message: "Slow database health check",
        context: "db-client",
        elapsedMs: elapsed,
      });
    }
    return true;
  } catch {
    return false;
  }
}

export async function getDbClient(): Promise<DbClient> {
  if (dbClient && connectionPool) {
    const healthy = await healthCheck();
    if (healthy) return dbClient;
    logger.warn({
      message: "Database connection unhealthy, reconnecting",
      context: "db-client",
    });
    dbClient = null;
    connectionPool = null;
  }

  const databaseUrl = getDatabaseUrl();
  connectionPool = postgres(databaseUrl, {
    prepare: false,
    max: 3,
    idle_timeout: 30,
    connect_timeout: 10,
  });

  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await connectionPool`SELECT 1`;
      logger.info({
        message: "Database connected",
        context: "db-client",
        attempt,
      });
      break;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn({
        message: "Database connection attempt failed",
        context: "db-client",
        attempt,
        error: lastError,
      });
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  if (lastError && !connectionPool) {
    throw lastError;
  }

  dbClient = drizzle(connectionPool, { schema, logger: false });
  return dbClient;
}
