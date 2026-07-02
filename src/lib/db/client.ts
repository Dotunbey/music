import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { logger } from "@/lib/logger";

type DbClient = ReturnType<typeof drizzle>;

let dbClient: DbClient | null = null;
let connectionPool: ReturnType<typeof postgres> | null = null;
let lastHealthCheckAt = 0;

const MAX_RETRIES = 2;
const HEALTH_CHECK_INTERVAL_MS = 30_000;

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
    if (Date.now() - lastHealthCheckAt < HEALTH_CHECK_INTERVAL_MS) {
      return dbClient;
    }
    const healthy = await healthCheck();
    if (healthy) {
      lastHealthCheckAt = Date.now();
      return dbClient;
    }
    logger.warn({
      message: "Database connection unhealthy, reconnecting",
      context: "db-client",
    });
    await connectionPool.end({ timeout: 5 }).catch(() => {});
    dbClient = null;
    connectionPool = null;
  }

  const databaseUrl = getDatabaseUrl();
  const pool = postgres(databaseUrl, {
    prepare: false,
    max: 3,
    idle_timeout: 30,
    connect_timeout: 10,
  });

  let lastError: Error | null = null;
  let connected = false;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await pool`SELECT 1`;
      connected = true;
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

  if (!connected) {
    await pool.end({ timeout: 5 }).catch(() => {});
    throw lastError ?? new Error("Database connection failed.");
  }

  connectionPool = pool;
  dbClient = drizzle(pool, { schema, logger: false });
  lastHealthCheckAt = Date.now();
  return dbClient;
}
