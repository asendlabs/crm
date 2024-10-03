import {
  Account,
  Activity,
  Contact,
  ContactEmail,
  ContactPhone,
  Deal,
  Workspace,
} from "@database/types";

export interface ContactWithDetails extends Contact {
  contactEmail: ContactEmail | null;
  contactPhone: ContactPhone | null;
}

export interface DealWithPrimaryContact extends Deal {
  primaryContact: ContactWithDetails | null;
}

export interface ActivityWithContact extends Activity {
  associatedContact: Contact | null;
}

export interface AccountFull extends Account {
  contacts: ContactWithDetails[];
  deals: DealWithPrimaryContact[];
  activities: ActivityWithContact[];
}
