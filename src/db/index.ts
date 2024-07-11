import * as schema from "./schema";

import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});

client.connect();

const db = drizzle(client, { schema});

export { db };