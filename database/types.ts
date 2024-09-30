import * as tables from "./tables";

type User = typeof tables.userTable.$inferSelect;
type Workspace = typeof tables.workspaceTable.$inferSelect;
type Account = typeof tables.accountTable.$inferSelect;
type Contact = typeof tables.contactTable.$inferSelect;
type Profile = typeof tables.profileTable.$inferSelect;
type Session = typeof tables.sessionTable.$inferSelect;
type WorkspaceUser = typeof tables.workspaceUserTable.$inferSelect;
type Activity = typeof tables.activityTable.$inferSelect;
type Deal = typeof tables.dealTable.$inferSelect;
type ContactEmail = typeof tables.contactEmailTable.$inferSelect;
type ContactPhone = typeof tables.contactPhoneTable.$inferSelect;

export type {
  User,
  Workspace,
  Account,
  Contact,
  Profile,
  Session,
  WorkspaceUser,
  Activity,
  Deal,
  ContactEmail,
  ContactPhone,
};
