"use client";

import React, { useEffect, useRef, useState } from "react";

interface PrimaryFieldProps {
  getValue: () => any;
}

export function PrimaryField({ getValue }: PrimaryFieldProps) {
  const initialValue = getValue();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="min-w-full max-w-36 select-none  p-2">
      {value}
    </div>
  );
}
