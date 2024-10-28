"use client";
import React, { createContext } from "react";

export interface Command {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CommandContext = createContext<Command>({
  open: false,
  setOpen: (value: any) => {},
});

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <CommandContext.Provider value={{ open, setOpen }}>
      {children}
    </CommandContext.Provider>
  );
}
