"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckbox } from "@/components/data-table/DataTableCheckbox";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DataTableDescriptionField } from "@/components/data-table/custom-fields/DataTableDescriptionField";
import { DataTableDropdownField } from "@/components/data-table/custom-fields/DataTableDropdownField";
import { DataTableEmailField } from "@/components/data-table/custom-fields/DataTableEmailField";
import { DataTableField } from "@/components/data-table/custom-fields/DataTableField";
import { DataTableHeaderCheckbox } from "@/components/data-table/DataTableHeaderCheckbox";
import { DataTablePhoneField } from "@/components/data-table/custom-fields/DataTablePhone";
import { DataTablePrimaryField } from "@/components/data-table/custom-fields/DataTablePrimaryField";
import { DataTableWebsiteField } from "@/components/data-table/custom-fields/DataTableWebsiteField";
import { Lead } from "@/db/schema";
import { statusEnum } from "@/db/schema";
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
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({getValue, row, column, table}) => <DataTableDropdownField statusEnum={statusEnum} getValue={getValue} row={row} column={column} table={table} />,
  // },
  {
    accessorKey: "addresses",
    header: "Address",
    cell: DataTableField,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: DataTableDescriptionField,
  }
];
