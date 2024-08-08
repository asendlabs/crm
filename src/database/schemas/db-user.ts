import { boolean, text, timestamp } from "drizzle-orm/pg-core";

import { appSchema } from "./db-schemas";
import { workspaceTable } from "./db-workspace";

export const userTable = appSchema.table("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  isOAuth: boolean("oauth").notNull().default(false),
  googleOAuthId: text("google_oauth_id"),
  verifyCode: text("verify_code"),
  verifyCodeGeneratedAt: timestamp("verify_code_generated_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  workspaceId: text("workspace_id").references(() => workspaceTable.id),
});

export const userSessionTable = appSchema.table("user_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
