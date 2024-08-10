import { multiUserSchema } from "./db-schemas";

export const workspaceMemberTypeEnum = multiUserSchema.enum(
  "workspace_member_type",
  ["owner", "member"],
);
