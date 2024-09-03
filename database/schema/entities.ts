import { jsonb, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { accountSchema } from "./_schemas";
import { userTable } from "./auth";
import { workspaceTable } from "./workspace";

export const accountTable = accountSchema.table("entities", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  status: varchar("status", { length: 255 }).notNull().default("potential"),
  assignedToId: text("assigned_to_id").references(() => userTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id").references(() => userTable.id),
  metadata: jsonb("metadata"),
});

export const contactTable = accountSchema.table("contacts", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id),
  accountId: text("account_id").references(() => accountTable.id),
  name: varchar("name", { length: 255 }).notNull(),
  jobTitle: varchar("job_title", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id").references(() => userTable.id),
  metadata: jsonb("metadata"),
});

export const contactPhoneTable = accountSchema.table("contact_phones", {
  id: text("id").primaryKey(),
  contactId: text("contact_id")
    .notNull()
    .references(() => contactTable.id),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id),
  number: varchar("number", { length: 30 }).notNull(),
  type: varchar("type", { length: 50 }).notNull().default("work"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id").references(() => userTable.id),
});

export const contactEmailTable = accountSchema.table("contact_emails", {
  id: text("id").primaryKey(),
  contactId: text("contact_id")
    .notNull()
    .references(() => contactTable.id),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id").references(() => userTable.id),
});
