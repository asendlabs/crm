"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckbox } from "@/components/data-table/DataTableCheckbox";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DataTableEmailField } from "@/components/data-table/custom-fields/DataTableEmailField";
import { DataTableField } from "@/components/data-table/custom-fields/DataTableField";
import { DataTableHeaderCheckbox } from "@/components/data-table/DataTableHeaderCheckbox";
import { DataTablePhoneField } from "@/components/data-table/custom-fields/DataTablePhone";
import { DataTablePrimaryField } from "@/components/data-table/custom-fields/DataTablePrimaryField";
import { DataTableWebsiteField } from "@/components/data-table/custom-fields/DataTableWebsiteField";
import { Lead } from "@/db/schema";

export const LeadsColumns: ColumnDef<Lead>[] = [
  {
    id: "select",
    header: DataTableHeaderCheckbox,
    cell: DataTableCheckbox,
  },
  {
    accessorKey: "leadName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lead Name" />
    ),
    cell: DataTablePrimaryField,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: DataTableEmailField,
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: DataTableWebsiteField,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: DataTablePhoneField,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: DataTableField,
  },
];
