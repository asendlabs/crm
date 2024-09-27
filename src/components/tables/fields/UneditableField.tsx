"use client";

import React, { useEffect, useState } from "react";

interface UneditableFieldProps {
  getValue: () => any;
}

export function UneditableField({ getValue }: UneditableFieldProps) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="min-w-full max-w-36 select-none px-2 py-1 border-l border-gray-200">{value}</div>
  );
}
