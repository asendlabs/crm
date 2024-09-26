"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface PrimaryFieldProps {
  getValue: () => any;
}

export function UneditableField({ getValue }: PrimaryFieldProps) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <div className="min-w-full max-w-36 select-none p-2">{value}</div>;
}
