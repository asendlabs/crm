import * as tables from "./tables";
import * as relations from "./relations";

import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@/env";
import postgres from "postgres";

export const sql = postgres(env.DATABASE_POSTGRES_URL);
export const db = drizzle(sql, { schema: { ...tables, ...relations } });
