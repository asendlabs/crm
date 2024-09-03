import { db } from "@database";
import { leadTable } from "./schema/entities";
import { workspaceTable, userTable } from "./tables";

// Auth Models
type User = typeof userTable.$inferSelect;
type Workspace = typeof workspaceTable.$inferSelect;
type Lead = typeof leadTable.$inferSelect;

export type { User, Workspace, Lead };
