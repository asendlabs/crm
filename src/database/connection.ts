import * as schema from "./schema";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const sql = postgres(process.env.DATABASE_POSTGRES_URL!);

export const db = drizzle(sql, { schema });
