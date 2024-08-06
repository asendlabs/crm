"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckbox } from "@/components/data-table/custom-fields/DataTableCheckbox";
import { DataTableColumnHeader } from "@/components/data-table/custom-headers/DataTableColumnHeader";
import { DataTableContactField } from "@/components/data-table/custom-fields/DataTableContactsField";
import { DataTableDescriptionField } from "@/components/data-table/custom-fields/DataTableDescriptionField";
import { DataTableEmailField } from "@/components/data-table/custom-fields/DataTableEmailField";
import DataTableEmailHeader from "@/components/data-table/custom-headers/DataTableEmailHeader";
import { DataTableField } from "@/components/data-table/custom-fields/DataTableField";
import { DataTableHeaderCheckbox } from "@/components/data-table/custom-headers/DataTableHeaderCheckbox";
import { DataTablePhoneField } from "@/components/data-table/custom-fields/DataTablePhoneField";
import DataTablePhoneHeader from "@/components/data-table/custom-headers/DataTablePhoneHeader";
import { DataTablePrimaryField } from "@/components/data-table/custom-fields/DataTablePrimaryField";
import { DataTableStatusField } from "@/components/data-table/custom-fields/DataTableStatusField";
import { DataTableWebsiteField } from "@/components/data-table/custom-fields/DataTableWebsiteField";
import { Lead } from "@/db/schema/types";
import { leadStatusEnum } from "@/db/schema/tables";

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
    accessorKey: "contacts",
    header: "Contacts",
    cell: DataTableContactField,
  },
  {
    accessorKey: "Email",
    header: DataTableEmailHeader,
    cell: DataTableEmailField,
  },
  {
    accessorKey: "Phone",
    header: DataTablePhoneHeader,
    cell: DataTablePhoneField,
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
    accessorKey: "url",
    header: "URL",
    cell: DataTableWebsiteField,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: DataTableDescriptionField,
  },
];
