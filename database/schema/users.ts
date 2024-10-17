import {
  boolean,
  jsonb,
  pgSchema,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "./_schemas";
import { identityProviderEnum } from "./_enums";

const { table } = users;

export const userTable = table("users", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  encryptedPassword: varchar("encrypted_password"),
  verificationCode: varchar("verification_code"),
  verificationCodeSentAt: timestamp("verification_code_sent_at")
    .notNull()
    .defaultNow(),
  verifiedAt: timestamp("verified_at"),
  onboardedAt: timestamp("onboarded_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  metadata: jsonb("metadata"),
});

export const profileTable = table("profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  marketingConsent: boolean("marketing_consent").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const identityTable = table("identities", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  provider: identityProviderEnum("provider").notNull(),
  providerUserId: varchar("provider_user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const sessionTable = table("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
