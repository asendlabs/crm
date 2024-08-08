import { jsonb, text, timestamp } from "drizzle-orm/pg-core";

import { appSchema } from "./db-schemas";

export const workspaceTable = appSchema.table("workspace", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  primaryOwnerId: text("primary_owner_id").notNull(),
});
