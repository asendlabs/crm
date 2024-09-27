"use client";

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
      className="select-none px-2 py-1 hover:underline min-w-36"
      onClick={() => router.push(`/app/leads/${id}`)}
    >
      {value}
    </div>
  );
}
