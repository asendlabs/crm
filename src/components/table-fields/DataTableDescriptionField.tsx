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
    <div className="flex w-full min-w-[200px] max-w-[200px] items-center gap-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="flex h-9 w-[190px] items-center justify-start truncate rounded-md px-2.5">
          <span className="truncate">{initialValue}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full rounded-md p-2">
          <Textarea
            ref={inputRef}
            value={value || ""}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => onChange(value)}
            rows={7}
            placeholder="Enter a Description"
            className="w-full rounded-md border border-input"
          />
          <Button
            variant="outline"
            onClick={() => {
              onChange(value);
              setOpen(false);
            }}
            className="mt-2.5 w-full"
          >
            Done
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
