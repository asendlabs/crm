"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HeaderCheckbox } from "@/components/tables/fields/HeaderCheckbox";
import { Account } from "@database/types";
import { BasicField } from "@/components/tables/fields/BasicField";
import { CheckboxField } from "@/components/tables/fields/CheckboxField";
import { BasicTitle } from "@/components/tables/fields/BasicTitle";
import { PrimaryField } from "@/components/tables/fields/PrimaryField";
import { PrimaryTitle } from "../tables/fields/PrimaryTitle";

export const LeadsColumns: ColumnDef<Account>[] = [
  {
    id: "select",
    header: HeaderCheckbox,
    cell: CheckboxField,
  },
  {
    id: "accountName",
    accessorKey: "accountName",
    header: () => <PrimaryTitle title="Lead Name" />,
    cell: PrimaryField,
  },
  {
    accessorKey: "description",
    header: () => <BasicTitle title="Description" />,
    cell: BasicField,
  },
];
