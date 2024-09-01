import { boolean, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { authSchema } from "./_schemas";

export const userTable = authSchema.table("users", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique(),
  encryptedPassword: varchar("encrypted_password"),
  name: varchar("name", { length: 255 }),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  verificationCodeCreatedAt: timestamp("verification_code_created_at"),
  verificationCode: varchar("verification_code", { length: 255 }),
  verifiedAt: timestamp("verified_at"),
  onboardingStep: varchar("onboarding_step", { length: 50 })
    .notNull()
    .default("not_started"),
  onboardingCompletedAt: timestamp("onboarding_completed_at"),
  oAuthProvider: varchar("o_auth_provider", { length: 255 }),
  oAuthId: text("oauth_id").unique(),
  marketingConsent: boolean("marketing_consent").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const userSessionTable = authSchema.table("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
