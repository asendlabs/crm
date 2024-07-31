"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckbox } from "@/components/data-table/DataTableCheckbox";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DataTableField } from "@/components/data-table/custom-fields/DataTableField";
import { DataTableHeaderCheckbox } from "@/components/data-table/DataTableHeaderCheckbox";
import { Lead } from "../page";

export const LeadsColumns: ColumnDef<Lead>[] = [
  {
    id: "select",
    header: DataTableHeaderCheckbox,
    cell: DataTableCheckbox,
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lead Name" />
    ),
    cell: DataTableField,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: DataTableField,
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: DataTableField,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: DataTableField,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: DataTableField,
  },
];
