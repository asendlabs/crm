"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckbox } from "@/components/table-fields/DataTableCheckbox";
import { DataTableColumnHeader } from "@/components/table-headers/DataTableColumnHeader";
import { DataTableHeaderCheckbox } from "@/components/table-headers/DataTableHeaderCheckbox";
import { DataTablePrimaryField } from "@/components/table-fields/DataTablePrimaryField";
import { Account } from "@database/types";

export const AccountColumns: ColumnDef<Account>[] = [
  {
    id: "select",
    header: DataTableHeaderCheckbox,
    cell: DataTableCheckbox,
  },
  {
    accessorKey: "accountName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Name" />
    ),
    cell: DataTablePrimaryField,
  },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ getValue, row, column, table }) => (
  //     <DataTableStatusField
  //       statusEnum={leadStatusEnum}
  //       getValue={getValue}
  //       row={row}
  //       column={column}
  //       table={table}
  //     />
  //   ),
  // },
];
