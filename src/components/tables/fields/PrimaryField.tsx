"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface PrimaryFieldProps {
  getValue: () => any;
  row: any;
}

export function PrimaryField({ getValue, row }: PrimaryFieldProps) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  const id = row.original.id;

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div
      onClick={() => router.push(`/app/leads/${id.toLowerCase()}`)}
      className="ml-2 flex h-8 w-full cursor-pointer select-none items-center hover:underline"
    >
      {value}
    </div>
  );
}
