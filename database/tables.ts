import { userTable, userSessionTable } from "./schema/auth";
import { workspaceTable, workspaceUserTable } from "./schema/workspace";
import {
  accountTable,
  contactTable,
  contactEmailTable,
  contactPhoneTable,
} from "./schema/entities";

// Exporting the tables
export { userTable, userSessionTable };
export { accountTable, contactTable, contactEmailTable, contactPhoneTable };
export { workspaceTable, workspaceUserTable };
