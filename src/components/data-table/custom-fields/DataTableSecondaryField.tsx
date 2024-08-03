import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useRef } from "react";

import { ArrowUpRight } from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";
import { Lead } from "@/db/schema";
import Link from "next/link";
import { getLeadById } from "@/app/(crm)/leads/_lib/lead.action";

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
  const [value, setValue] = React.useState<any>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = React.useState(false);
  const onMount = async () => {
    await getLeadById(initialValue).then((data) => setValue(data));
  };

  React.useEffect(() => {
    onMount();
  }, [initialValue]);

  return (
    <Link
      href=""
      className="w-36 h-9 flex px-2.5 flex-row items-center gap-2 group"
    >
      <div className="flex flex-row min-w-4 min-h-4">
        <Avatar className="h-4 w-4 text-muted-foreground rounded-full">
          <AvatarImage src={value.avatarUrl} />
          <AvatarFallback>
            {value.leadName?.charAt(0).toUpperCase() || ""}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        <span>{value.leadName}</span>
        <ArrowUpRight className="h-6 w-6 p-1 text-muted-foreground duration-200 hidden group-hover:block  group-hover:bg-muted-foreground/20 rounded-full" tableValues={-1}/>
      </div>  
    </Link>
  );
}
