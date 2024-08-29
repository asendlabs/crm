"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckbox } from "@/components/table-fields/DataTableCheckbox";
import { DataTableColumnHeader } from "@/components/table-headers/DataTableColumnHeader";
import { DataTableContactField } from "@/components/table-fields/DataTableContactsField";
import { DataTableDescriptionField } from "@/components/fields/custom-fields/DataTableDescriptionField";
import { DataTableEmailField } from "@/components/table-fields/DataTableEmailField";
import DataTableEmailHeader from "@/components/table-headers/DataTableEmailHeader";
import { DataTableField } from "@/components/table-fields/DataTableField";
import { DataTableHeaderCheckbox } from "@/components/table-headers/DataTableHeaderCheckbox";
import { DataTablePhoneField } from "@/components/table-fields/DataTablePhoneField";
import DataTablePhoneHeader from "@/components/table-headers/DataTablePhoneHeader";
import { DataTablePrimaryField } from "@/components/table-fields/DataTablePrimaryField";
import { DataTableStatusField } from "@/components/table-fields/DataTableStatusField";
import { DataTableWebsiteField } from "@/components/table-fields/DataTableWebsiteField";
import { Lead } from "@/database/schemas/types";
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
