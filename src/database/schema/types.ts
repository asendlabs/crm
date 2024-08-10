import { userTable } from "./db-user";
import { workspaceTable } from "./db-workspace";

// Custom Types

export interface WorkspaceTablePrivateMetadata {
  leadStatusTypes: string[];
  dealStageTypes: string[];
}
export interface WorskpaceTablePublicMetadata {
  theme: "dark" | "light";
  logoUrl?: string;
}

// Inferred Types
export type Workspace = typeof workspaceTable.$inferSelect;
export type User = typeof userTable.$inferSelect;
