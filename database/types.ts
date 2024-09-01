import { workspaceTable, userTable } from "./tables";

// Auth Models
type User = typeof userTable.$inferSelect;
type Workspace = typeof workspaceTable.$inferSelect;

export type { User, Workspace };
