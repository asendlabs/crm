import {
  jsonb,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { workspaceSchema } from "./schemas";
import { userTable } from "./auth";

export const workspaceTable = workspaceSchema.table("workspaces", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  primaryOwnerId: text("primary_owner_id")
    .notNull()
    .references(() => userTable.id),
  logoUrl: varchar("logo_url", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id")
    .notNull()
    .references(() => userTable.id),
  metadata: jsonb("metadata"),
});

export const workspaceUserTable = workspaceSchema.table(
  "workspace_users",
  {
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaceTable.id),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id),
    role: varchar("role", { length: 255 }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.workspaceId, table.userId] }),
      pkWithCustomName: primaryKey({
        name: "workspace_users_pk",
        columns: [table.workspaceId, table.userId],
      }),
    };
  },
);
