"use client";
import {
  Account,
  Activity,
  Contact,
  ContactEmail,
  ContactPhone,
  Deal,
} from "@database/types";
import { createContext } from "react";

interface AccountContextProps {
  account: Account | undefined;
  contacts: Contact[] | undefined;
  activities: Activity[] | undefined;
  deals: Deal[] | undefined;
}

export const AccountContext = createContext<AccountContextProps>({
  account: undefined,
  contacts: undefined,
  activities: undefined,
  deals: undefined,
});