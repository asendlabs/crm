"use client";
import { deleteContact } from "@/data-access/contacts";
import {
  AccountFull,
  ActivityType,
  ActivityWithContact,
  ContactWithDetails,
  DealWithPrimaryContact,
} from "@/types/entities";
import {
  Account,
  Activity,
  Contact,
  ContactEmail,
  ContactPhone,
  Deal,
} from "@database/types";
import { createContext } from "react";

export interface State {
  account: AccountFull | undefined;
  contacts: ContactWithDetails[] | undefined;
  deals: DealWithPrimaryContact[] | undefined;
  activities: ActivityWithContact[] | undefined;
}

export interface Actions {}

export const AccountContext = createContext<State & Actions>({
  account: undefined,
  contacts: undefined,
  activities: undefined,
  deals: undefined,
});

export function AccountProvider({
  children,
  account,
  contacts,
  activities,
  deals,
}: {
  children: React.ReactNode;
} & State &
  Actions) {
  return (
    <AccountContext.Provider
      value={{
        account,
        contacts,
        activities,
        deals,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
