import {
  Account,
  Activity,
  Contact,
  ContactEmail,
  ContactPhone,
  Deal,
  Email,
  Profile,
  Task,
  User,
  Workspace,
} from "@database/types";

export interface ContactWithDetails extends Contact {
  account: Account | null;
  contactEmail: ContactEmail | null;
  contactPhone: ContactPhone | null;
}

export interface DealWithPrimaryContact extends Deal {
  account: Account | null;
  workspace: Workspace | null;
  stage: DealStage;
  primaryContact: ContactWithDetails | null;
}

export interface ActivityWithContact extends Activity {
  associatedContact: Contact | null;
}

export interface UserWithWorkspaceAndProfile extends User {
  workspaces: Workspace[];
  profile: Profile;
}

export interface DealStage {
  stage: string;
  color: string;
}

export interface AccountStatus {
  status: string;
  color: string;
}

export interface WorkspaceWithChooseables extends Workspace {
  dealStages: DealStage[];
  accountStatuses: AccountStatus[];
}

export interface AccountFull extends Account {
  status: AccountStatus;
  emails: Email[];
  contacts: ContactWithDetails[];
  deals: DealWithPrimaryContact[];
  activities: ActivityWithContact[];
  tasks: Task[];
  workspace: WorkspaceWithChooseables;
}

export type ActivityType = "call" | "message" | "comment" | "email" | undefined;
