import {
  userTable,
  sessionTable,
  profileTable,
  identityTable,
} from "./schema/users";
import { workspaceTable, workspaceUserTable } from "./schema/workspaces";
import {
  accountTable,
  contactTable,
  activityTable,
  contactEmailTable,
  contactPhoneTable,
  dealTable,
  taskTable,
} from "./schema/entities";
// Exporting the tables
export { userTable, sessionTable, profileTable, identityTable };
export { workspaceTable, workspaceUserTable };
export {
  accountTable,
  contactTable,
  activityTable,
  contactEmailTable,
  contactPhoneTable,
  dealTable,
  taskTable,
};
