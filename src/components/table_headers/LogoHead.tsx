import { LucideIcon } from "lucide-react";
import React from "react";

export const LogoHead = ({
  title,
  Icon,
}: {
  title: string;
  Icon: LucideIcon;
}) => {
  return (
    <div className="flex select-none items-center gap-1.5 border-l border-border px-2 py-1.5 font-medium">
      <Icon className="size-4" />
      <span>{title}</span>
    </div>
  );
};
