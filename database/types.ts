import { userTable } from "./schema/auth";

// Auth Models
type User = typeof userTable.$inferSelect;

export type { User };
