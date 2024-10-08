"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account } from "@database/types";
import { CheckboxField } from "@/components/tables/fields/CheckboxField";
import { PrimaryField } from "@/components/tables/fields/PrimaryField";
import {
  CalendarDays,
  Component,
  LucideFileText,
  LucideUsers,
  Sparkle,
  Users,
} from "lucide-react";
import { LogoHead } from "@/components/tables/headers/LogoHead";
import { CheckboxHead } from "@/components/tables/headers/CheckboxHead";
import { PrimaryHead } from "@/components/tables/headers/PrimaryHead";
import { SecondaryField } from "../tables/fields/SecondaryField";
import { StatusField } from "../tables/fields/StatusField";
import { AiScoreField } from "../tables/fields/AiScoreField";
import { LastInteractionField } from "../tables/fields/LastInteractionField";
import { AccountFull } from "@/types/entities";

export const ClientsColumns: ColumnDef<AccountFull>[] = [
  {
    id: "select",
    header: CheckboxHead,
    cell: CheckboxField,
  },
  {
    id: "accountName",
    accessorKey: "accountName",
    header: () => <PrimaryHead title="Client Name" />,
    cell: ({ getValue, row }) => (
      <PrimaryField getValue={getValue} row={row} isAccount={true} />
    ),
  },
  {
    id: "contacts",
    accessorKey: "contacts",
    header: () => <LogoHead title="Contacts" Icon={LucideUsers} />,
    cell: ({ getValue, row }) => <SecondaryField row={row} />,
  },
  {
    id: "last activity",
    accessorKey: "activities",
    header: () => <LogoHead title="Last Activity" Icon={Users} />,
    cell: ({ getValue, row }) => <LastInteractionField getValue={getValue} />,
  },
];
