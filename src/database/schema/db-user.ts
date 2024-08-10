import { boolean, jsonb, text, timestamp } from "drizzle-orm/pg-core";

import { authenticationSchema } from "./db-schemas";

export const userTable = authenticationSchema.table("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  isOAuth: boolean("oauth").notNull().default(false),
  googleOAuthId: text("google_oauth_id").unique(),
  verifyCode: text("verify_code"),
  verifyCodeGeneratedAt: timestamp("verify_code_generated_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const userSessionTable = authenticationSchema.table("user_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
