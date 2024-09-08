"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckbox } from "@/components/table-fields/DataTableCheckbox";
import { DataTableColumnHeader } from "@/components/table-headers/DataTableColumnHeader";
import { DataTableHeaderCheckbox } from "@/components/table-headers/DataTableHeaderCheckbox";
import { DataTablePrimaryField } from "@/components/table-fields/DataTablePrimaryField";
import { Lead } from "@database/types";

export const LeadsColumns: ColumnDef<Lead>[] = [
  {
    id: "select",
    header: DataTableHeaderCheckbox,
    cell: DataTableCheckbox,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lead Name" />
    ),
    cell: DataTablePrimaryField,
  },
];
