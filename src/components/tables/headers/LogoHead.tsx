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
    <div className="flex select-none items-center gap-2 border-l border-gray-200 p-2 font-medium">
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </div>
  );
};
