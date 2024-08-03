"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { StatusBadge } from "@/components/ui/statusbagde";
import { Textarea } from "@/components/ui/textarea";

interface DataTableDescriptionFieldProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}

export function DataTableDescriptionField({
  getValue,
  row,
  column,
  table,
}: DataTableDescriptionFieldProps) {
  const initialValue = getValue();
  const [value, setValue] = React.useState(initialValue);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = React.useState(false);

  const onChange = (newValue: string) => {
    setValue(newValue);

    table.options.meta?.updateData({
      rowIndex: row.index,
      itemId: row.original.id || "",
      columnId: column.id,
      newValue: value,
    });
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="flex flex-row items-center gap-2 w-36">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="w-full px-2.5 truncate h-9 flex flex-row items-center justify-start">
          <span>{initialValue}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Textarea
            ref={inputRef}
            value={value || ""}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => onChange(value)}
          />
          <Button
            variant={"outline"}
            onClick={() => {
              onChange(value);
              setOpen(false);
            }}
            className="w-full mt-1"
          >
            Done
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
