import {
  WorkspaceTablePrivateMetadata,
  WorskpaceTablePublicMetadata,
} from "./types";
import {
  boolean,
  customType,
  jsonb,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { multiUserSchema } from "./db-schemas";
import { userTable } from "./db-user";

const privateMetadataCustomType = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return "jsonb";
    },
    toDriver(value: TData): string {
      return JSON.stringify(value);
    },
  })(name);

const publicMetadataCustomType = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return "jsonb";
    },
    toDriver(value: TData): string {
      return JSON.stringify(value);
    },
  })(name);

export const workspaceTable = multiUserSchema.table("workspace", {
  id: text("id").primaryKey(),
  name: text("name"),
  primaryOwnerUserId: text("primary_owner_user_id")
    .notNull()
    .references(() => userTable.id),
  personalAccount: boolean("personal_account").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdByUserId: text("created_by_user_id"),
  updatedByUserId: text("updated_by_user_id"),
  privateMetadata:
    privateMetadataCustomType<WorkspaceTablePrivateMetadata>(
      "private_metadata",
    ),
  publicMetadata:
    publicMetadataCustomType<WorskpaceTablePublicMetadata>("public_metadata"),
});

export const workspaceMemberTable = multiUserSchema.table(
  "workspace_member",
  {
    userId: text("user_id").references(() => userTable.id),
    workspaceId: text("workspace_id").references(() => workspaceTable.id),
    role: text("role").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.workspaceId] }),
      pkWithCustomName: primaryKey({
        name: "workspace_member_composite_id",
        columns: [table.userId, table.workspaceId],
      }),
    };
  },
);
