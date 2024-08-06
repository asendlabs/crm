import * as relations from "./schema/relations";
import * as tables from "./schema/tables";
import * as types from "./schema/types";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_POSTGRES_URL!);

const db = drizzle(client, { schema: {...tables, ...relations, ...types} });

export { db };