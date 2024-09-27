"use client";

import { timeAgo } from "@/utils/generators";
import React, { useEffect, useState } from "react";

interface TimestampFieldProps {
  getValue: () => any;
}

export function TimestampField({ getValue }: TimestampFieldProps) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="min-w-full max-w-36 select-none border-l border-gray-200 px-2 py-1.5 font-medium text-muted-foreground">
      {(value && timeAgo(value)) || "\u3164"}
    </div>
  );
}
