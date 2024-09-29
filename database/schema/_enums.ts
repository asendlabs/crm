import { pgEnum } from "drizzle-orm/pg-core";

const accountTypeValues = ["lead", "customer"] as const;
export const accountTypeEnum = pgEnum("account_type", accountTypeValues);

const activityTypeValues = [
  "call",
  "meeting",
  "email",
  "note",
  "message",
] as const;
export const activityTypeEnum = pgEnum("activity_type", activityTypeValues);

const activityPriorityValues = ["low", "medium", "high"] as const;
export const activityPriorityEnum = pgEnum("priority", activityPriorityValues);

const activityStatusValues = ["due", "done", "cancelled"] as const;
export const activityStatusEnum = pgEnum("status", activityStatusValues);
