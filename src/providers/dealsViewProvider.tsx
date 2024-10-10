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
  Task,
} from "@database/types";
import { createContext } from "react";

export type Views = "board" | "grid";

export interface State {
  view: Views;
}

export const DealViewContext = createContext<State>({
  view: "grid",
});

export function DealViewProvider({
  children,
  view,
}: {
  children: React.ReactNode;
} & State) {
  return (
    <DealViewContext.Provider
      value={{
        view,
      }}
    >
      {children}
    </DealViewContext.Provider>
  );
}
