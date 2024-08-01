"use client";

import React, { useEffect, useRef } from "react";

import { Field } from "@/components/ui/field";
import Link from "next/link";
import { Paperclip } from "lucide-react";

interface DataTableWebsiteFieldProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}

export function DataTableWebsiteField({
  getValue,
  row,
  column,
  table,
}: DataTableWebsiteFieldProps) {
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

  const normalizeUrl = (urlString: string | null | undefined) => {
    if (urlString === null || urlString === undefined) {
      return undefined;
    }
    let url = urlString.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `http://${url}`; // Default to http if no scheme is provided
    }
    try {
      new URL(url);
      return url;
    } catch (_) {
      return undefined; // Return undefined if URL is invalid
    }
  };

  const normalizedUrl = normalizeUrl(value);

  return (
    <div
      className="relative ml-0 flex-1 md:grow-0"
      onDoubleClick={() => setActive(true)}
    >
      <input
        ref={inputRef}
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        readOnly={!active}
        className="w-full h-9 bg-background pl-3 pr-8 truncate focus:no-underline hover:underline cursor-pointer" // Ensure padding-right for space
      />
      <a
        href={normalizedUrl}
        target="_blank"
        className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
        tabIndex={-1}
      >
        <Paperclip
          className={`${
            active
              ? "opacity-100 bg-muted-foreground/20 text-black"
              : "opacity-0 bg-muted-foreground/20"
          } h-6 w-6 text-muted-foreground duration-200 p-1 hover:opacity-100 hover:bg-muted-foreground/20 hover:text-black rounded-full`}
        />
      </a>
    </div>
  );
}
