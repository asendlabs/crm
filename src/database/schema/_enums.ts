import { pgEnum } from "drizzle-orm/pg-core";

export const providerValues = ["google", "microsoft", "apple"] as const;
export const providerEnum = pgEnum("identity_provider", providerValues);

export const accountTypeValues = ["lead", "client"] as const;
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

export const activityPriorityValues = ["low", "medium", "high"] as const;
export const activityPriorityEnum = pgEnum("priority", activityPriorityValues);

export const activityStatusValues = ["due", "done", "cancelled"] as const;
export const activityStatusEnum = pgEnum("status", activityStatusValues);

export const entityTypeValues = ["deal", "contact", "account"] as const;
export const entityTypeEnum = pgEnum("entity_type", entityTypeValues);

export const taskStageValues = ["todo", "in_progress", "done"] as const;
export const taskStageEnum = pgEnum("task_stage", taskStageValues);

export const taskPriorityValues = ["low", "medium", "high"] as const;
export const taskPriorityEnum = pgEnum("task_prioirty", taskPriorityValues);

export const emailMessageTypeValues = ["received", "sent"] as const;
export const emailMessageTypeEnum = pgEnum(
  "email_message_type",
  emailMessageTypeValues,
);
