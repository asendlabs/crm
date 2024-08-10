import { pgSchema } from "drizzle-orm/pg-core";

export const authenticationSchema = pgSchema("auth");
export const multiUserSchema = pgSchema("multi_user");
