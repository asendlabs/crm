import { boolean, text, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { workspaceSchema } from "./schemas";

export const workspaceTable = workspaceSchema.table("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => userTable.id),
  logoUTKey: text("logo_ut_key"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const workspaceMemberTable = workspaceSchema.table("workspace_members", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  isOwner: boolean("is_owner").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});
