import * as schema from "./schema";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres({
  host: process.env.DATABASE_POSTRGES_HOST!,
  port: process.env.DATABASE_POSTRGES_PORT
    ? parseInt(process.env.DATABASE_POSTRGES_PORT)
    : undefined,
  database: process.env.DATABASE_POSTRGES_DB!,
  user: process.env.DATABASE_POSTRGES_USER!,
  password: process.env.DATABASE_POSTRGES_PASSWORD!,
});

const db = drizzle(client, { schema });

export { db };
