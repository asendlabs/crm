"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface PrimaryFieldProps {
  getValue: () => any;
  row: any;
  isAccount?: boolean;
}

export function PrimaryField({ getValue, row, isAccount }: PrimaryFieldProps) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [routerPath, setRouterPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    setValue(initialValue);
    if (isAccount) {
      setRouterPath(`/app/account/${row.original.id.toLowerCase()}`);
    } else {
      setRouterPath(
        `/app/account/${row.original.account?.id?.toLowerCase() ?? ""}`,
      );
    }
  }, [initialValue]);

  return (
    <div
      onClick={() => router.push(routerPath)}
      className="ml-2 flex h-8 w-full cursor-pointer select-none items-center hover:underline"
    >
      {value}
    </div>
  );
}
