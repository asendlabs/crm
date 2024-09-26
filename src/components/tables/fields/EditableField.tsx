"use client";

import React, { useEffect, useRef } from "react";

interface EditableFieldProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}

export function EditableField({
  getValue,
  row,
  column,
  table,
}: EditableFieldProps) {
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
    <div
      onClick={() => setActive(true)}
      className="min-w-full max-w-36 select-none border-l border-gray-200"
    >
      <input
        ref={inputRef}
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        readOnly={!active}
        className={`w-full truncate rounded-none border-none p-2 outline-none ring-0 ${active ? "cursor-text focus:ring-1 focus:ring-primary" : "cursor-pointer"}`}
      />
    </div>
  );
}
