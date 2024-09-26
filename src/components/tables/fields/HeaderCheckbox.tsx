import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { Table } from "drizzle-orm";

export function HeaderCheckbox({ table }: { table: any }) {
  return (
    <div className="flex items-center cursor-pointer z max-w-1 min-w-1 w-1" onClick={() => table.toggleAllPageRowsSelected()}>
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
