import { boolean, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

export const schema = pgSchema("app");

export const userTable = schema.table("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  accountCompleted: boolean("account_completed").notNull().default(false),
  isOAuth: boolean("oauth").notNull().default(false),
  googleOAuthId: text("google_oauth_id"),
  verifyCode: text("verify_code"),
  verifyCodeGeneratedAt: timestamp("verify_code_generated_at"),
});

export const sessionTable = schema.table("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// CRM Functionality

export const statusEnum = schema.enum("status", [
  "New",
  "Contacted",
  "Follow Up",
  "In Progress",
  "Unqualified",
  "Future Contact",
  "Closed",
  "Lost",
]);

export const leadsTable = schema.table("leads", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  leadName: text("lead_name").notNull(),
  description: text("description"),
  email: text("email"),
  phone: text("phone"),
  address: text("adrress"),
  website: text("website"),
  status: statusEnum("status").notNull().default("New"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const contactsTable = schema.table("contacts", {
  id: text("id").primaryKey(),
  leadId: text("lead_id")
    .notNull()
    .references(() => leadsTable.id),
  userId: text("user_id").references(() => userTable.id),
  contactName: text("contact_name").notNull(),
  jobTitle: text("job_title"),
  email: text("email"),
  phone: text("phone"),
  url: text("url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const leadsRelations = relations(leadsTable, ({ one, many }) => ({
  contacts: many(contactsTable),
}));

export const contactsRelations = relations(contactsTable, ({ one, many }) => ({
  lead: one(leadsTable, {
    fields: [contactsTable.leadId],
    references: [leadsTable.id],
  }),
}));

export type Contact = typeof contactsTable.$inferSelect;
export type Lead = typeof leadsTable.$inferSelect;
export type User = typeof userTable.$inferSelect;
