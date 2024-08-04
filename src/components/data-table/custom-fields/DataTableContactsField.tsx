"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface DataTableContactFieldProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}

export function DataTableContactField({
  getValue,
  row,
  column,
  table,
}: DataTableContactFieldProps) {
  const contacts = row.original.contacts;
  const contactName =
    contacts && contacts.length > 0 ? contacts[0].contactName : "";

  const moreText =
    contacts && contacts.length > 1 ? ` + ${contacts.length - 1} more` : "";

  return (
    <Link
      href={contactName && `/leads/${row.original.id}`}
      className="w-30 h-9 flex px-2.5 flex-row items-center gap-2 group hover:underline border-red-500 border-2 rounded-md"
    >
      <span className="truncate ">
        {contactName}
        {moreText}
      </span>
    </Link>
  );
}
