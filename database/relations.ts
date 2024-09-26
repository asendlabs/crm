import { relations } from "drizzle-orm";
import { workspaceTable, workspaceUserTable } from "./schema/workspaces";
import { profileTable, userTable } from "./schema/users";
import { accountTable, contactTable } from "./tables";

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

export const accountTableRelations = relations(accountTable, ({ one, many }) => ({
  workspace: one(workspaceTable, {
    fields: [accountTable.workspaceId],
    references: [workspaceTable.id],
  }),
  contacts: many(contactTable)
}));

export const contactTableRelations = relations(contactTable, ({ one }) => ({
  workspace: one(workspaceTable, {
    fields: [contactTable.workspaceId],
    references: [workspaceTable.id],
  }),
  account: one(accountTable, {
    fields: [contactTable.accountId],
    references: [accountTable.id],
  }),
}));
