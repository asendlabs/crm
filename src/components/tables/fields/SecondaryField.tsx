"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface SecondaryFieldProps {
  getValue: () => any;
  row: any;
}

export function SecondaryField({ getValue, row }: SecondaryFieldProps) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  const id = row.original.id;

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div
      className="min-w-full max-w-36 select-none px-1 py-2 hover:underline flex gap-2"
      onClick={() => router.push(`/app/leads/${id}`)}
    >
      <Avatar className="h-6 w-6">
        <AvatarFallback>{value[0]?.contactName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      {value[0].contactName}
    </div>
  );
}
