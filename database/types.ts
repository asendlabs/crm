import { accountTable } from "./schema/entities";
import { workspaceTable, userTable } from "./tables";

// Auth Models
type User = typeof userTable.$inferSelect;
type Workspace = typeof workspaceTable.$inferSelect;
type Account = typeof accountTable.$inferSelect;

export type { User, Workspace, Account };
