"use client";
import {
  AccountFull,
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

export interface AccountContextProps {
  account: AccountFull | undefined;
  contacts: ContactWithDetails[] | undefined;
  deals: DealWithPrimaryContact[] | undefined;
  activities: ActivityWithContact[] | undefined;
}

export const AccountContext = createContext<AccountContextProps>({
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
} & AccountContextProps) {
  return (
    <AccountContext.Provider value={{ account, contacts, activities, deals }}>
      {children}
    </AccountContext.Provider>
  );
}
