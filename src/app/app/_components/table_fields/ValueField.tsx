"use client";

import React, { useEffect, useState } from "react";

interface ValueFieldProps {
  getValue: () => any;
}

export function ValueField({ getValue }: ValueFieldProps) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="min-w-full max-w-36 select-none border-l border-border px-2 py-1.5">
      ${value}
    </div>
  );
}
