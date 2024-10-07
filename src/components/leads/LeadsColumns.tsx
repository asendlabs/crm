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
import { TimestampField } from "../tables/fields/TimestampField";
import { AccountFull } from "@/types/entities";

export const LeadsColumns: ColumnDef<AccountFull>[] = [
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
    id: "contacts",
    accessorKey: "contacts",
    header: () => <LogoHead title="Contacts" Icon={LucideUsers} />,
    cell: ({ getValue, row }) => (
      <SecondaryField arrayName="contacts" getValue={getValue} row={row} />
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: () => <LogoHead title="Status" Icon={Component} />,
    cell: ({ getValue, row }) => <StatusField getValue={getValue} />,
  },
  {
    id: "score",
    accessorKey: "score",
    header: () => <LogoHead title="AI Score" Icon={CalendarDays} />,
    cell: AiScoreField,
  },
  {
    id: "activities",
    accessorKey: "activities",
    header: () => <LogoHead title="Last Activity" Icon={Users} />,
    cell: ({ getValue, row }) => <TimestampField getValue={getValue} />,
  },
];
