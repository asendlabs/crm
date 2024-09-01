import { relations } from "drizzle-orm";
import { workspaceTable, workspaceUserTable } from "./workspace";
import { userTable } from "./auth";

export const userTableRelations = relations(userTable, ({ many }) => ({
  workspaceUserTable: many(workspaceUserTable),
}));

export const workspaceTableRelations = relations(workspaceTable, ({ many }) => ({
  workspaceUserTable: many(workspaceUserTable),
}));

export const workspaceUserTableRelations = relations(workspaceUserTable, ({ one }) => ({
  workspace: one(workspaceTable, {
    fields: [workspaceUserTable.workspaceId],
    references: [workspaceTable.id],
  }),
  user: one(userTable, {
    fields: [workspaceUserTable.userId],
    references: [userTable.id],
  }),
}));