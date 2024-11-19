"use client";
import React, { createContext } from "react";

export interface Command {
  commandOpen: boolean;
  setCommandOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CommandContext = createContext<Command>({
  commandOpen: false,
  setCommandOpen: (value: any) => {},
});

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [commandOpen, setCommandOpen] = React.useState(false);

  return (
    <CommandContext.Provider value={{ commandOpen, setCommandOpen }}>
      {children}
    </CommandContext.Provider>
  );
}
