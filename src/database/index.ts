import * as schema from "./schemas";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_POSTGRES_URL!);

const db = drizzle(client, { schema });

export { db };
