import * as schema from "./models";

import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@/env";
import postgres from "postgres";

export const sql = postgres(env.DATABASE_POSTGRES_URL);
export const db = drizzle(sql, { schema });
