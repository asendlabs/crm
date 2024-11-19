"use client";
import { createContext } from "react";
import React from "react";

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
