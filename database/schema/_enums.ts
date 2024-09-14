import { pgEnum } from "drizzle-orm/pg-core";

const accountTypeValues = ["lead", "customer"] as const;
export const accountTypeEnum = pgEnum("account_type", accountTypeValues);
