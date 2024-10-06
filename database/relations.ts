import { relations } from "drizzle-orm";
import { workspaceTable, workspaceUserTable } from "./schema/workspaces";
import { profileTable, userTable } from "./schema/users";
import {
  accountTable,
  activityTable,
  contactEmailTable,
  contactPhoneTable,
  contactTable,
  dealTable,
  taskTable,
} from "./tables";

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

export const accountTableRelations = relations(
  accountTable,
  ({ one, many }) => ({
    workspace: one(workspaceTable, {
      fields: [accountTable.workspaceId],
      references: [workspaceTable.id],
    }),
    contacts: many(contactTable),
    deals: many(dealTable),
    activities: many(activityTable),
    tasks: many(taskTable),
  }),
);

export const contactTableRelations = relations(
  contactTable,
  ({ one, many }) => ({
    workspace: one(workspaceTable, {
      fields: [contactTable.workspaceId],
      references: [workspaceTable.id],
    }),
    account: one(accountTable, {
      fields: [contactTable.accountId],
      references: [accountTable.id],
    }),
    contactPhone: one(contactPhoneTable),
    contactEmail: one(contactEmailTable),
    deals: many(dealTable),
    activities: many(activityTable),
  }),
);

export const contactPhoneTableRelations = relations(
  contactPhoneTable,
  ({ one }) => ({
    contact: one(contactTable, {
      fields: [contactPhoneTable.contactId],
      references: [contactTable.id],
    }),
  }),
);

export const contactEmailTableRelations = relations(
  contactEmailTable,
  ({ one }) => ({
    contact: one(contactTable, {
      fields: [contactEmailTable.contactId],
      references: [contactTable.id],
    }),
  }),
);

export const dealTableRelations = relations(dealTable, ({ one, many }) => ({
  workspace: one(workspaceTable, {
    fields: [dealTable.workspaceId],
    references: [workspaceTable.id],
  }),
  account: one(accountTable, {
    fields: [dealTable.accountId],
    references: [accountTable.id],
  }),
  primaryContact: one(contactTable, {
    fields: [dealTable.primaryContactId],
    references: [contactTable.id],
  }),
}));

export const activityTableRelations = relations(
  activityTable,
  ({ one, many }) => ({
    workspace: one(workspaceTable, {
      fields: [activityTable.workspaceId],
      references: [workspaceTable.id],
    }),
    account: one(accountTable, {
      fields: [activityTable.accountId],
      references: [accountTable.id],
    }),
    associatedContact: one(contactTable, {
      fields: [activityTable.associatedContactId],
      references: [contactTable.id],
    }),
  }),
);

export const taskTableRelations = relations(taskTable, ({ one, many }) => ({
  workspace: one(workspaceTable, {
    fields: [taskTable.workspaceId],
    references: [workspaceTable.id],
  }),
  account: one(accountTable, {
    fields: [taskTable.accountId],
    references: [accountTable.id],
  }),
}));
