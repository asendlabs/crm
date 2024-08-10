import { type WorkspaceTableMetadata } from "./types";
import {
  boolean,
  customType,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { multiUserSchema } from "./db-schemas";
import { userTable } from "./db-user";

const metadataCustomType = <TData>(name: string) =>
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
  metadata: metadataCustomType<WorkspaceTableMetadata>("metadata")
    .notNull()
    .default({
      displayName: "",
      leadStatusTypes: [],
      dealStageTypes: [],
      logoUrl: "",
      consents: {
        analytics: false,
      },
      creationComplete: false,
    }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdByUserId: text("created_by_user_id"),
  updatedByUserId: text("updated_by_user_id"),
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
