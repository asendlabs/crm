"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

interface DataTablePhoneFieldProps {
  row: any;
}

export function DataTablePhoneField({ row }: DataTablePhoneFieldProps) {
  const contacts = row.original.contacts;
  const contactPhone = contacts && contacts.length > 0 ? contacts[0].phone : "";

  return (
    <Link
      href={`mailto:${contactPhone || ""}`}
      className="group flex flex-row items-center justify-center "
      tabIndex={-1}
    >
      <Phone size={26.5} className="group-hover:bg-slate-200 rounded-md p-1" />
    </Link>
  );
}
