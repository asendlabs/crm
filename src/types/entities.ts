import {
  Account,
  Activity,
  Contact,
  ContactEmail,
  ContactPhone,
  Deal,
  Task,
  Workspace,
} from "@database/types";

export interface ContactWithDetails extends Contact {
  account: Account | null;
  contactEmail: ContactEmail | null;
  contactPhone: ContactPhone | null;
}

export interface DealWithPrimaryContact extends Deal {
  stage: DealStage;
  primaryContact: ContactWithDetails | null;
  account: Account | null;
}

export interface ActivityWithContact extends Activity {
  associatedContact: Contact | null;
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
  contacts: ContactWithDetails[];
  deals: DealWithPrimaryContact[];
  activities: ActivityWithContact[];
  tasks: Task[];
  workspace: WorkspaceWithChooseables;
}

export type ActivityType = "call" | "message" | "comment" | "email" | undefined;
