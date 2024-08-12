import { boolean, customType, text, timestamp } from "drizzle-orm/pg-core";

import { authenticationSchema } from "./db-schemas";
import { ulid } from "ulid";

export const userTable = authenticationSchema.table("user", {
  id: text("id").primaryKey().default(ulid()),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified"),
  hashedPassword: text("hashed_password"),
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
export type User = typeof userTable.$inferSelect;
