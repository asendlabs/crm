import { pgEnum } from "drizzle-orm/pg-core";

const accountTypeValues = ["lead", "client"] as const;
export const accountTypeEnum = pgEnum("account_type", accountTypeValues);

const activityTypeValues = [
  "call",
  "email",
  "message",
  "comment",
  "task_completion",
  "entity_creation",
  "entity_deletion",
] as const;
export const activityTypeEnum = pgEnum("activity_type", activityTypeValues);

const activityPriorityValues = ["low", "medium", "high"] as const;
export const activityPriorityEnum = pgEnum("priority", activityPriorityValues);

const activityStatusValues = ["due", "done", "cancelled"] as const;
export const activityStatusEnum = pgEnum("status", activityStatusValues);

const entityTypeValues = ["deal", "contact", "account"] as const;
export const entityTypeEnum = pgEnum("entity_type", entityTypeValues);
