"use client";

import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

export function CheckboxField({ row }: { row: any }) {
  return (
    <div
      className="flex w-1 min-w-1 max-w-1 cursor-pointer items-center"
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
