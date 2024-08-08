import { appSchema } from "./db-schemas";

export const workspaceMemberTypeEnum = appSchema.enum("workspace_member_type", [
  "owner",
  "member",
]);
