import { contactTable, leadTable, profileTable, userTable } from "./tables";

import { relations } from "drizzle-orm";

export const userRelations = relations(userTable, ({ one, many }) => ({
  profileInfo: one(profileTable), // One user can have only one profile
  leads: many(leadTable), // One user can have many leads
  contacts: many(contactTable), // One user can have many contacts
}));

export const profileRelations = relations(profileTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [profileTable.userId],
    references: [userTable.id],
  }), // One profile can have only one user and the profile.userId is the linker
}));

export const leadRelations = relations(leadTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [leadTable.userId],
    references: [userTable.id],
  }), // One lead can have only one user and the lead.userId is the linker
  contacts: many(contactTable), // One lead can have many contacts
}));

export const contactRelations = relations(contactTable, ({ one, many }) => ({
  lead: one(leadTable, {
    fields: [contactTable.leadId],
    references: [leadTable.id],
  }), // One contact can have only one lead and the contact.leadId is the linker`
  user: one(userTable, {
    fields: [contactTable.userId],
    references: [userTable.id],
  }), // One contact can have only one user and the contact.userId is the linker
}));
