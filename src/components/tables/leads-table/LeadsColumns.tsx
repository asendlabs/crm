"use client";

import { Lead, leadStatusEnum } from "@/db/schema";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckbox } from "@/components/data-table/DataTableCheckbox";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DataTableContactField } from "@/components/data-table/custom-fields/DataTableContactsField";
import { DataTableDescriptionField } from "@/components/data-table/custom-fields/DataTableDescriptionField";
import { DataTableEmailField } from "@/components/data-table/custom-fields/DataTableEmailField";
import { DataTableField } from "@/components/data-table/custom-fields/DataTableField";
import { DataTableHeaderCheckbox } from "@/components/data-table/DataTableHeaderCheckbox";
import { DataTablePhoneField } from "@/components/data-table/custom-fields/DataTablePhone";
import { DataTablePrimaryField } from "@/components/data-table/custom-fields/DataTablePrimaryField";
import { DataTableStatusField } from "@/components/data-table/custom-fields/DataTableStatusField";
import { DataTableWebsiteField } from "@/components/data-table/custom-fields/DataTableWebsiteField";

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
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue, row, column, table }) => (
      <DataTableStatusField
        statusEnum={leadStatusEnum}
        getValue={getValue}
        row={row}
        column={column}
        table={table}
      />
    ),
  },
  {
    accessorKey: "contacts",
    header: "Contacts",
    cell: DataTableContactField,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: DataTableDescriptionField,
  },
];
