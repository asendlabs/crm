import { pgSchema } from "drizzle-orm/pg-core";

export const workspaceSchema = pgSchema("workspace");
export const authSchema = pgSchema("auth");
export const entitySchema = pgSchema("entities");