import { boolean, text, timestamp } from "drizzle-orm/pg-core";
import { authenticationSchema } from "./schemas";

export const userTable = authenticationSchema.table("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password"),
  isVerified: boolean("is_verified").notNull().default(false),
  verificationToken: text("verification_token"),
  isOAuth: boolean("is_oauth").notNull().default(false),
  oAuthId: text("oauth_id"),
});

export const userSessionTable = authenticationSchema.table("sessions", {
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
