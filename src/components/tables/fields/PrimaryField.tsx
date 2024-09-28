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

  const id = row.original.id;

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Link
      href={`/app/leads/${id.toLowerCase()}`}
      replace={false}
      prefetch={true}
      className="ml-2 min-w-36 select-none underline cursor-pointer"
    >
      {value}
    </Link>
  );
}
