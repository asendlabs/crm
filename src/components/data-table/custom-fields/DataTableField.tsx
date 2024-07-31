"use client";

import React, { useEffect, useRef } from "react";

import { Field } from "@/components/ui/field";

interface DataTableFieldProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}

export function DataTableField({
  getValue,
  row,
  column,
  table,
}: DataTableFieldProps) {
  const initialValue = getValue();
  const [active, setActive] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const onBlur = () => {
    table.options.meta?.updateData({
      rowIndex: row.index,
      itemId: row.original.id || "",
      columnId: column.id,
      newValue: value,
    });
    setValue(initialValue);
    setActive(false);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (active) {
      inputRef.current?.focus();
    }
  }, [active]);

  return (
    <div onDoubleClick={() => setActive(true)}>
      <Field
        ref={inputRef}
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        readOnly={!active}
      />
    </div>
  );
}
