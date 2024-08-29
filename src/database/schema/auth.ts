import { boolean, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { authSchema } from "./schemas";

export const userTable = authSchema.table("users", {
  id: text("id").primaryKey(),
  email: varchar("email").unique(),
  encryptedPassword: varchar("encrypted_password"),
  // Verification
  verificationCodeCreatedAt: timestamp("verification_code_created_at"),
  verificationCode: varchar("verification_code"),
  verifiedAt: timestamp("verified_at"),
  // Onboarding
  onboardedAt: timestamp("onboarded_at"),
  // OAuth
  oAuthProvider: varchar("o_auth_provider"),
  oAuthId: text("oauth_id"),
  // Metatadata
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
export type User = typeof userTable.$inferSelect;
