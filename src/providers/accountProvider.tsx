"use client";
import {
  AccountFull,
  ActivityWithContact,
  ContactWithDetails,
  DealWithPrimaryContact,
} from "@/types/entities";
import { Email, Task } from "@database/types";
import { createContext } from "react";

export interface State {
  account: AccountFull | undefined;
  contacts: ContactWithDetails[] | undefined;
  deals: DealWithPrimaryContact[] | undefined;
  activities: ActivityWithContact[] | undefined;
  tasks: Task[] | undefined;
  emails: Email[] | undefined;
}

export interface Actions {}

export const AccountContext = createContext<State & Actions>({
  account: undefined,
  contacts: undefined,
  activities: undefined,
  deals: undefined,
  tasks: undefined,
  emails: undefined,
});

export function AccountProvider({
  children,
  account,
  contacts,
  activities,
  deals,
  emails,
  tasks,
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
        emails,
        deals,
        tasks,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
