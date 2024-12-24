import {
  json,
  jsonb,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { workspaces } from "./_schemas";
import { userTable } from "./users";
import { accountStatusesDefault, dealStagesDefault } from "./_defaults";

const { table } = workspaces;

export const workspaceTable = table("workspaces", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  primaryOwnerId: text("primary_owner_id")
    .notNull()
    .references(() => userTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id")
    .notNull()
    .references(() => userTable.id),
  metadata: jsonb("metadata"),
  dealStages: jsonb("deal_stages").default(JSON.stringify(dealStagesDefault)),
  accountStatuses: jsonb("account_statuses").default(
    JSON.stringify(accountStatusesDefault),
  ),
});

export const workspaceUserTable = table(
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
  (t) => ({
    pk: primaryKey({ columns: [t.workspaceId, t.userId] }),
  }),
);
