"use client";

import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

export function CheckboxField({ row }: { row: any }) {
  return (
    <div
      className="flex w-2 min-w-2 max-w-2 cursor-pointer items-center"
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
