import {
  jsonb,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { workspaces } from "./_schemas";
import { userTable } from "./users";

const { table } = workspaces;

export const workspaceTable = table("workspaces", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  primaryOwnerId: text("primary_owner_id")
    .notNull()
    .references(() => userTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id")
    .notNull()
    .references(() => userTable.id),
  metadata: jsonb("metadata"),
  dealStages: jsonb("deal_stages").default(
    JSON.stringify([
      {
        stage: "Proposal",
        color: "1e40af", // Dark blue for "Proposal"
      },
      {
        stage: "Negotiation",
        color: "c2410c", // Dark orange for "Negotiation"
      },
      {
        stage: "On Hold",
        color: "a16207", // Dark yellow for "On Hold"
      },
      {
        stage: "Lost Deal",
        color: "991b1b", // Dark red for "Lost Deal"
      },
      {
        stage: "Closed",
        color: "15803d", // Dark green for "Closed"
      },
    ]),
  ),
  leadStatuses: jsonb("lead_statuses").default(
    JSON.stringify([
      {
        color: "7e22ce", // !text-purple-800 for "New"
        status: "New",
      },
      {
        color: "a16207", // !text-yellow-800 for "Contacted"
        status: "Contacted",
      },
      {
        color: "1d4ed8", // !text-blue-800 for "Qualified"
        status: "Qualified",
      },
      {
        color: "991b1b", // !text-red-800 for "Unqualified"
        status: "Unqualified",
      },
      {
        color: "6b7280", // !text-gray-500 for "Waste"
        status: "Waste",
      },
      {
        color: "15803d", // !text-green-800 for "Won"
        status: "Won",
      },
    ]),
  ),
});

export const workspaceUserTable = table(
  "workspace_users",
  {
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaceTable.id),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id),
    role: varchar("role", { length: 255 }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.workspaceId, t.userId] }),
  }),
);
