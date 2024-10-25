"use client";

import Link from "@/components/performance-link";
import { useRouter } from "@/hooks/use-performance-router";
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
      setRouterPath(
        `/app/${row.original.type}s/${row.original.id.toLowerCase()}`,
      );
    } else {
      setRouterPath(
        `/app/${row.original.account?.type ?? ""}s/${row.original.account?.id?.toLowerCase() ?? ""}`,
      );
    }
    router.prefetch(routerPath);
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
