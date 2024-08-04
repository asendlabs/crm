"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const handleClick = (status: string) => {
    table.options.meta?.updateData({
      rowIndex: row.index,
      itemId: row.original.id || "",
      columnId: column.id,
      newValue: status,
    });
  };

  return (
    <div className="flex flex-row items-center gap-2 w-full ">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full px-1.5">
          <StatusBadge variant="secondary">{initialValue}</StatusBadge>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
