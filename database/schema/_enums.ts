import { pgEnum } from "drizzle-orm/pg-core";

const accountTypeValues = ["lead", "client"] as const;
export const accountTypeEnum = pgEnum("account_type", accountTypeValues);

const activityTypeValues = [
  "call",
  "email",
  "message",
  "comment",
  "task_completion",
  "addition",
  "field_removal",
  "entity_removal",
  "field_change",
] as const;
export const activityTypeEnum = pgEnum("activity_type", activityTypeValues);

const activityPriorityValues = ["low", "medium", "high"] as const;
export const activityPriorityEnum = pgEnum("priority", activityPriorityValues);

const activityStatusValues = ["due", "done", "cancelled"] as const;
export const activityStatusEnum = pgEnum("status", activityStatusValues);
