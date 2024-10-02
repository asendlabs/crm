"use client";

import { Account, Activity, Contact, Deal } from "@database/types";
import { AccountContext } from "@/contexts/account-context";

export function AccountProvider({
  children,
  account,
  contacts,
  activities,
  deals,
}: {
  children: React.ReactNode;
  account: Account | undefined;
  contacts: Contact[] | undefined;
  activities: Activity[] | undefined;
  deals: Deal[] | undefined;
}) {
  return (
    <AccountContext.Provider value={{ account, contacts, activities, deals }}>
      {children}
    </AccountContext.Provider>
  );
}
