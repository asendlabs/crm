import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const oAuthTypeEnum = pgEnum("oAuthTypeEnum", ["google", "apple"]);

export const userTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  isOAuth: boolean("oauth").notNull().default(false),
  googleOAuthId: varchar("google_oauth_id"),
  verifyCode: varchar("verify_code"),
  verifyCodeGeneratedAt: timestamp("verify_code_generated_at"),
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
