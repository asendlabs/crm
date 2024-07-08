import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});