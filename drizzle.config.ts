import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/database/schema/*",
  out: "./.migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_POSTGRES_URL!,
  },
});
