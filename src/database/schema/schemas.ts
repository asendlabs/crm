import { pgSchema } from "drizzle-orm/pg-core";

export const authenticationSchema = pgSchema("authentication");
export const workspaceSchema = pgSchema("workspace");
export const authSchema = pgSchema("auth");
