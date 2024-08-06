"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getContactsByLeadId } from "@/server/contact.action";

interface DataTableContactFieldProps {
  row: any;
}

export function DataTableContactField({ row }: DataTableContactFieldProps) {
  const initialValue = row.original.id;
  const [value, setValue] = React.useState<any>({});
  const [moreText, setMoreText] = React.useState<string>("");
  const onMount = async () => {
    const res = await getContactsByLeadId(initialValue);
    if (res && res.length > 0) {
      setValue(res[0]);
      setMoreText(res.length > 1 ? ` + ${res.length - 1} more` : "");
    } else {
      setValue({});
      setMoreText("");
    }
  };

  React.useEffect(() => {
    onMount();
  }, [initialValue]);

  return (
    <Link
      href={(value.contactName && `/lead/${value.lead.id.toString()}`) || ""}
      className="min-w-36 max-w-30 h-9 flex px-2.5 flex-row items-center gap-1 group rounded-md"
    >
      <span className="truncate group-hover:underline">
        {value.contactName}
      </span>
      <span>{moreText}</span>
    </Link>
  );
}
