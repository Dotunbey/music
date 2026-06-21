import type { Config } from "drizzle-kit";

const databaseUrl =
  process.env.DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL;

if (!databaseUrl) {
  console.warn(
    "DATABASE_URL or SUPABASE_DATABASE_URL is not set; migration commands cannot run without credentials.",
  );
}

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl ?? "",
  },
  strict: true,
} satisfies Config;
