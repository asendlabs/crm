import * as tables from "./tables";
import * as relations from "./relations";
import { drizzle as drizzleDevelopment } from "drizzle-orm/postgres-js";
import {
  drizzle as drizzleProduction,
  NeonHttpDriver,
} from "drizzle-orm/neon-http";
import { env } from "@/env";
import postgres from "postgres";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";

// Determine the database URL based on the environment
const databaseUrl =
  env.NODE_ENV === "development"
    ? env.DATABASE_POSTGRES_URL_DEV
    : env.DATABASE_POSTGRES_URL;

// Set up the SQL client depending on the environment
const sql =
  env.NODE_ENV === "development" ? postgres(databaseUrl) : neon(databaseUrl);

// Initialize the database with the appropriate drizzle function and schema
export const db =
  env.NODE_ENV === "development"
    ? drizzleDevelopment(sql as any, { schema: { ...tables, ...relations } })
    : drizzleProduction({
        client: sql as any,
        schema: { ...tables, ...relations },
      });
