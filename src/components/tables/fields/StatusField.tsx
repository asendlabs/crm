"use client";

import { Circle, Sparkle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface StatusFieldProps {
  getValue: () => any;
  row: any;
}

export function StatusField({ getValue, row }: StatusFieldProps) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const router = useRouter();
  const id = row.original.id;
  return (
    <div className="select-none border-l border-border px-2 py-1">
      <div className="flex items-center gap-1 py-0.5">
        {value ? (
          <>
            <Circle className="mr-1 h-3 w-3" />
            <span className="capitalize underline decoration-muted-foreground decoration-2">
              {value}
            </span>
          </>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
