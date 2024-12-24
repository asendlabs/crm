import {
  boolean,
  jsonb,
  pgSchema,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { emails } from "./_schemas";
import { emailMessageTypeEnum, providerEnum } from "./_enums";
import { workspaceTable } from "./workspaces";
import { userTable } from "./users";
import { metadata } from "@/app/layout";
import { accountTable } from "./entities";

const { table } = emails;

export const workspaceEmailIntegrationsTable = table(
  "workspace_email_integrations",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaceTable.id),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id),
    provider: providerEnum("provider").notNull().default("google"),
    providerId: varchar("provider_id", { length: 255 }).notNull(),

    accessToken: varchar("access_token", { length: 255 }).notNull(),
    refreshToken: varchar("refresh_token", { length: 255 }).notNull(),
    accessTokenExpiresAt: timestamp("access_token_expires_at").notNull(),

    connectedAt: timestamp("connected_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),

    email: varchar("email", { length: 255 }).notNull().unique(),
    metadata: jsonb("metadata"),
  },
);

export const emailMessageTable = table("email_messages", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id),
  accountId: text("account_id")
    .notNull()
    .references(() => accountTable.id),
  toEmail: varchar("to_email", { length: 255 }).notNull(),
  fromEmail: varchar("from_email", { length: 255 }).notNull(),
  fromName: varchar("from_name", { length: 255 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  snippet: text("snippet").notNull(),
  type: emailMessageTypeEnum("type").notNull(),
  emailTimestamp: timestamp("email_timestamp"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  metadata: jsonb("metadata"),
});
