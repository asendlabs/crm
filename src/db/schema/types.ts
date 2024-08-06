import { contactTable, leadTable, userTable } from "./tables";

export type Contact = typeof contactTable.$inferSelect;
export type Lead = typeof leadTable.$inferSelect;
export type User = typeof userTable.$inferSelect;