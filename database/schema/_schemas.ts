import { pgSchema } from "drizzle-orm/pg-core";

export const users  = pgSchema("users");
export const workspaces = pgSchema("workspaces");
