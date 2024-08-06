import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useRef } from "react";

import { ArrowUpRight } from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";
import { Lead } from "@/db/schema";
import Link from "next/link";
import { getLeadById } from "@/server/lead.action";

interface DataTableLeadFieldProps {
  getValue: () => any;
}

export function DataTableLeadField({ getValue }: DataTableLeadFieldProps) {
  const initialValue = getValue();
  const [value, setValue] = React.useState<any>({});
  const onMount = async () => {
    await getLeadById(initialValue).then((data) => setValue(data));
  };

  React.useEffect(() => {
    onMount();
  }, [initialValue]);

  return (
    <Link
      href={`/lead/${value.id}`}
      className="group flex h-9 w-48 flex-row items-center gap-2 px-2.5"
    >
      <div className="flex min-h-4 min-w-4 flex-row">
        <Avatar className="h-4 w-4 rounded-full text-muted-foreground">
          <AvatarImage src={value.avatarUrl} />
          <AvatarFallback>
            {value.leadName?.charAt(0).toUpperCase() || ""}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex w-full flex-row items-center">
        <span className="truncate underline">{value.leadName}</span>
      </div>
    </Link>
  );
}
