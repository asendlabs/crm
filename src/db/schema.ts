import { boolean, integer, jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: varchar("name").notNull(), 
  email: varchar("email").notNull(),
  hashedPassword: varchar("hashed_password").notNull(),
  avatarUrl: varchar("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isVerified: boolean("is_verified").notNull().default(false),
  preferences: jsonb("preferences"),  
  verifyCode: varchar("verify_code", {length: 56}),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// TODO: Billing Table

export const accountTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  name: varchar("name").notNull(),
  industry: varchar("industry"),
  status: varchar("status"),
  accountEmail: varchar("email"),
  accountPhone: varchar("phone"),
  accountWebsite: varchar("website"),
  accountSocialLinks: jsonb("social_links"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  notes: text("notes"),
});

export const contactTable = pgTable("contacts", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accountTable.id),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name"),
  contactPosition: varchar("position"),
  contactEmail: varchar("email"),
  contactPhone: varchar("phone"),
  contactAddress: varchar("address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  accountSocialLinks: jsonb("social_links"),
  notes: text("notes"),
});

export const dealTable = pgTable("deals", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accountTable.id),
  contactId: text("contact_id")
    .notNull()
    .references(() => contactTable.id),
  title: varchar("title").notNull(),
  value: integer("value").notNull(),
  currency: varchar("currency").notNull(),
  stage: varchar("stage"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  expectedCloseDate: timestamp("expected_close_date"),
  closedDate: timestamp("closed_date"),
  probability: varchar("probability"),
  description: text("notes"),
});