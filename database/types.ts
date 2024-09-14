import { accountTable, contactTable } from "./tables";
import { workspaceTable, userTable } from "./tables";

// Auth Models
type User = typeof userTable.$inferSelect;
type Workspace = typeof workspaceTable.$inferSelect;
type Account = typeof accountTable.$inferSelect;
type Contact = typeof contactTable.$inferSelect;

export type { User, Workspace, Account, Contact };
