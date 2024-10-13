import { defineConfig } from "drizzle-kit";
import { env } from "@/env";

export default defineConfig({
  schema: ["./database/schema/*"],
  out: "./.migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_POSTGRES_URL,
  },
});