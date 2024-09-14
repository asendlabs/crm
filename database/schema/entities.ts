import {
  boolean,
  jsonb,
  pgSchema,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { entities } from "./_schemas";
import { accountTypeEnum } from "./_enums";
import { workspaceTable } from "./workspaces";
import { userTable } from "./users";

const { table } = entities;

export const accountTable = table("accounts", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id),
  assignedToId: text("assigned_to_id").references(() => userTable.id),
  accountName: varchar("account_name", { length: 255 }).notNull(),
  type: accountTypeEnum("type").notNull().default("lead"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id").references(() => userTable.id),
  metadata: jsonb("metadata"),
});

export const contactTable = table("contacts", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id),
  accountId: text("account_id")
    .references(() => accountTable.id)
    .notNull(),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id").references(() => userTable.id),
  metadata: jsonb("metadata"),
});
