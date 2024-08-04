import { boolean, jsonb, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import { uuid } from "uuidv4";

export const schema = pgSchema("app");

export const userTable = schema.table("user", {
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
export const profileTable = schema.table("profile", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  preferences: jsonb("preferences"),
});

export const userRelations = relations(userTable, ({ one, many }) => ({
  profileInfo: one(profileTable),
}));

export const profileRelations = relations(profileTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [profileTable.userId],
    references: [userTable.id],
  }),
}));

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

export const leadTable = schema.table("lead", {
  id: text("id").primaryKey(),
  leadName: text("lead_name").notNull(),
  description: text("description"),
  url: text("url"),
  addresses: text("addresses"),
  status: statusEnum("status").notNull().default("New"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

export const contactTable = schema.table("contact", {
  id: text("id").primaryKey(),
  contactName: text("contact_name").notNull(),
  jobTitle: text("job_title"),
  email: text("email"),
  phone: text("phone"),
  url: text("url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  leadId: text("lead_id")
    .notNull()
    .references(() => leadTable.id),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

export type Contact = typeof contactTable.$inferSelect;
export type Lead = typeof leadTable.$inferSelect;
export type User = typeof userTable.$inferSelect;
