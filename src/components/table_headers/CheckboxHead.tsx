import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { Table } from "drizzle-orm";

export function CheckboxHead({ table }: { table: any }) {
  return (
    <div
      className="flex w-2 min-w-2 max-w-2 cursor-pointer items-center"
      onClick={() => table.toggleAllPageRowsSelected()}
    >
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  );
}
