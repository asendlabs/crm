"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import React from "react";
import { StatusBadge } from "@/components/ui/statusbagde";

interface DataTableStatusFieldProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
  statusEnum: any;
}

export function DataTableStatusField({
  getValue,
  row,
  column,
  table,
  statusEnum,
}: DataTableStatusFieldProps) {
  const initialValue = getValue();
  const [open, setOpen] = React.useState(false);

  const handleClick = (status: string) => {
    table.options.meta?.updateData({
      rowIndex: row.index,
      itemId: row.original.id || "",
      columnId: column.id,
      newValue: status,
    });
  };

  return (
    <div
      className="flex flex-row items-center gap-2 w-30 h-full cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="w-full px-1.5 select-none">
          <StatusBadge variant="secondary" className="bg-muted-foreground/20 flex flex-row items-center justify-between">
            {initialValue}
            <ChevronDown className="h-4 w-4 text-black" />
          </StatusBadge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48 ml-2 mt-1">
          {statusEnum.enumValues.map((status: any) => (
            <DropdownMenuItem key={status} onClick={() => handleClick(status)}>
              <button className="flex flex-row items-center gap-2">
                <span>{status}</span>
              </button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
