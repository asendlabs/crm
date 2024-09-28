import {
  boolean,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { entities } from "./_schemas";
import {
  accountTypeEnum,
  activityPriorityEnum,
  activityStatusEnum,
  activityTypeEnum,
} from "./_enums";
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
  status: varchar("status", { length: 255 }).notNull().default("new"),
  score: varchar("ai_score", { length: 50 }).notNull().default(""),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  interaction: timestamp("last_interaction", { mode: "string" }),
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id").references(() => userTable.id),
  metadata: jsonb("metadata"),
});

export const contactPhoneTable = table("contact_phones", {
  id: text("id").primaryKey(),
  contactId: text("contact_id")
    .notNull()
    .references(() => contactTable.id),
  phoneNumber: varchar("phone_number", { length: 15 }).notNull(),
  countryCode: varchar("country_code", { length: 3 }),
});

export const contactEmailTable = table("contact_emails", {
  id: text("id").primaryKey(),
  contactId: text("contact_id")
    .notNull()
    .references(() => contactTable.id),
  email: varchar("email", { length: 254 }).notNull(),
});

export const activityTable = table("activities", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accountTable.id),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id),
  activityType: activityTypeEnum("activity_type").notNull().default("email"),
  description: text("description"),
  fromTimeStamp: timestamp("from_timestamp").notNull(),
  toTimeStamp: timestamp("to_timestamp").notNull(),
  priority: activityPriorityEnum("priority").notNull().default("medium"),
  status: activityStatusEnum("status").notNull().default("due"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id").references(() => userTable.id),
  metadata: jsonb("metadata"),
});

export const opportunityTable = table("opportunities", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id),
  accountId: text("account_id")
    .notNull()
    .references(() => accountTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  value: varchar("deal_value", { length: 255 }),
  stage: varchar("stage", { length: 255 }),
  probability: integer("ai_probability"),
  expectedCloseDate: timestamp("expected_close_date"),
  assignedToId: text("assigned_to_id").references(() => userTable.id),
  primaryContactId: text("primary_contact_id").references(
    () => contactTable.id,
  ),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id").references(() => userTable.id),
  metadata: jsonb("metadata"),
});
