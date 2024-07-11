import * as schema from "./schema";

import { drizzle } from "drizzle-orm/postgres-js";
// import { Client } from "pg";
import postgres from "postgres";

// import { drizzle } from "drizzle-orm/node-postgres";

// const client = new Client({
//   connectionString: process.env.DATABASE_URL!,
// });

// client.connect();

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema});

export { db };