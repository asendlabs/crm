import { boolean, customType, text, timestamp } from "drizzle-orm/pg-core";

import { type UserTableMetadata } from "./types";
import { authenticationSchema } from "./db-schemas";
const metadataCustomType = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return "jsonb";
    },
    toDriver(value: TData): string {
      return JSON.stringify(value);
    },
  })(name);

export const userTable = authenticationSchema.table("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  isOAuth: boolean("oauth").notNull().default(false),
  googleOAuthId: text("google_oauth_id").unique(),
  verifyCode: text("verify_code"),
  verifyCodeGeneratedAt: timestamp("verify_code_generated_at"),
  metadata: metadataCustomType<UserTableMetadata>("metadata")
    .notNull()
    .default({
      fullName: "",
      theme: "system",
      avatarUrl: "",
      consents: {
        marketing: false,
        notifications: true,
      },
      creationComplete: false,
    }),
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
