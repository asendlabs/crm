import { boolean, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

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
  "Closed (Won)",
  "Closed (Lost)",
]);

export const leadsTable = schema.table("leads", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  name: text("name").notNull(),
  description: text("description"),
  email: text("email"),
  phone: text("phone"),
  urls: text("urls"),
  adrress: text("adrress"),
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
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  jobTitle: text("job_title"),
  email: text("email").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export type Lead = typeof leadsTable.$inferSelect;
export type User = typeof userTable.$inferSelect;
