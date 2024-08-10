import { customType } from "drizzle-orm/pg-core";
import { userTable } from "./db-user";
import { workspaceTable } from "./db-workspace";

// Inferred Types
type Workspace = typeof workspaceTable.$inferSelect;
type User = typeof userTable.$inferSelect;

// Custom Types

interface WorkspaceTableMetadata {
  displayName: string;
  leadStatusTypes?: string[];
  dealStageTypes?: string[];
  logoUrl?: string;
  consents: {
    analytics: boolean;
  };
  creationComplete: boolean;
}

interface UserTableMetadata {
  fullName?: string;
  theme: "light" | "dark";
  avatarUrl?: string;
  consents: {
    marketing: boolean;
    notifications: boolean;
  };
  creationComplete: boolean;
}

// Exports
export type { WorkspaceTableMetadata, UserTableMetadata };
export { workspaceTable, userTable };

export type { Workspace, User };
