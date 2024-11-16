import React from "react";
import { SidebarTrigger } from "./ui/sidebar";

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-lg font-medium !lowercase">
      <SidebarTrigger className="size-4" />
      {children}
    </span>
  );
}
