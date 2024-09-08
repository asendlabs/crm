import { relations } from "drizzle-orm";
import { workspaceTable, workspaceUserTable } from "./schema/workspaces";
import { profileTable, userTable } from "./schema/users";

export const userTableRelations = relations(userTable, ({ one, many }) => ({
  workspaceUserTable: many(workspaceUserTable),
  profile: one(profileTable),
}));

export const profileTableRelations = relations(profileTable, ({ one }) => ({
  user: one(userTable, {
    fields: [profileTable.userId],
    references: [userTable.id],
  }),
}));

export const workspaceTableRelations = relations(
  workspaceTable,
  ({ many }) => ({
    workspaceUserTable: many(workspaceUserTable),
  }),
);

export const workspaceUserTableRelations = relations(
  workspaceUserTable,
  ({ one }) => ({
    workspace: one(workspaceTable, {
      fields: [workspaceUserTable.workspaceId],
      references: [workspaceTable.id],
    }),
    user: one(userTable, {
      fields: [workspaceUserTable.userId],
      references: [userTable.id],
    }),
  }),
);
