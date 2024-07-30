import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DATABASE_POSTRGES_HOST!,
    port: process.env.DATABASE_POSTRGES_PORT
      ? parseInt(process.env.DATABASE_POSTRGES_PORT)
      : undefined,
    database: process.env.DATABASE_POSTRGES_DB!,
    user: process.env.DATABASE_POSTRGES_USER!,
    password: process.env.DATABASE_POSTRGES_PASSWORD!,
  },
});
