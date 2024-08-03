import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lead, contactsTable, leadsTable } from "@/db/schema";
import React, { useEffect, useRef } from "react";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { eq } from "drizzle-orm";

interface DataTableSecondaryFieldProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}

export function DataTableSecondaryField({
  getValue,
  row,
  column,
  table,
}: DataTableSecondaryFieldProps) {
  const initialValue = getValue();
  const [value, setValue] = React.useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = React.useState(false);

  return (
    <div className="relative ml-0 flex-1 w-48" onClick={() => setActive(true)}>
      <input
        ref={inputRef}
        value={value || ""}
        readOnly={false}
        className="w-full h-9 bg-background pl-2.5 pr-10   truncate cursor-pointer outline-black"
      />
      <Link
        href={`#`}
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
