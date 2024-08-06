"use client";

import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

export function DataTableCheckbox({ row }: { row: any }) {
  return (
    <div
      className="flex items-center justify-center w-11 h-9 cursor-pointer"
      onClick={() => row.toggleSelected()}
    >
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  );
}
