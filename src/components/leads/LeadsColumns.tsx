"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account } from "@database/types";
import { CheckboxField } from "@/components/tables/fields/CheckboxField";
import { PrimaryField } from "@/components/tables/fields/PrimaryField";
import { LucideFileText, LucideUsers } from "lucide-react";
import { LogoHead } from "@/components/tables/headers/LogoHead";
import { CheckboxHead } from "@/components/tables/headers/CheckboxHead";
import { PrimaryHead } from "@/components/tables/headers/PrimaryHead";
import { EditableField } from "../tables/fields/EditableField";
import { SecondaryField } from "../tables/fields/SecondaryField";
import { StatusField } from "../tables/fields/StatusField";

export const LeadsColumns: ColumnDef<Account>[] = [
  {
    id: "select",
    header: CheckboxHead,
    cell: CheckboxField,
  },
  {
    id: "accountName",
    accessorKey: "accountName",
    header: () => <PrimaryHead title="Lead Name" />,
    cell: PrimaryField,
  },
  {
    accessorKey: "contacts",
    header: () => <LogoHead title="Contacts" Icon={LucideUsers} />,
    cell: SecondaryField,
  },
  {
    accessorKey: "status",
    header: () => <LogoHead title="Status" Icon={LucideUsers} />,
    cell: StatusField,
  },
];
