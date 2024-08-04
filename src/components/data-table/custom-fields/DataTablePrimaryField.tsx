"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useRef } from "react";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DataTablePrimaryFieldProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}

export function DataTablePrimaryField({
  getValue,
  row,
  column,
  table,
}: DataTablePrimaryFieldProps) {
  const initialValue = getValue();
  const [active, setActive] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const onBlur = () => {
    table.options.meta?.updateData({
      rowIndex: row.index,
      itemId: row.original.id || "",
      columnId: column.id,
      newValue: value,
    });
    setValue(initialValue);
    setActive(false);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (active) {
      inputRef.current?.focus();
    }
  }, [active]);

  const initials: string = row.original[column.id]
    .toString()
    .charAt(0)
    .toUpperCase();

  return (
    <div
      className="relative ml-0 flex-1 md:grow-0"
      onClick={() => setActive(true)}
    >
      <input
        ref={inputRef}
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        readOnly={!active}
        className="w-full h-9 bg-background pl-3 pr-8 truncate focus:no-underline hover:underline cursor-pointer outline-black" // Ensure padding-right for space
      />
      <Link
        href={`mailto:${value || ""}`}
        className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
        tabIndex={-1}
      >
        <ArrowUpRight
          className={`${
            active
              ? "opacity-100 bg-muted-foreground/20 text-black"
              : "opacity-0 bg-muted-foreground/20"
          } h-6 w-6 text-muted-foreground duration-200 p-1 hover:opacity-100 hover:bg-muted-foreground/20 hover:text-black rounded-full`}
        />
      </Link>
    </div>
  );
}
