import { userTable, userSessionTable } from "./schema/auth";
import { workspaceTable, workspaceUserTable } from "./schema/workspace";
import {
  leadTable,
  contactTable,
  contactEmailTable,
  contactPhoneTable,
} from "./schema/entities";

// Exporting the tables
export { userTable, userSessionTable };
export { leadTable, contactTable, contactEmailTable, contactPhoneTable };
export { workspaceTable, workspaceUserTable };
