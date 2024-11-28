"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account } from "@database/types";
import {
  CalendarDays,
  Component,
  LucideFileText,
  LucideUsers,
  Sparkle,
  Users,
} from "lucide-react";
import { AccountFull } from "@/types/entities";
import {
  CheckboxHead,
  LogoHead,
  PrimaryHead,
} from "@/app/app/_components/table_headers";
import {
  AiScoreField,
  LastInteractionField,
  PrimaryField,
  SecondaryField,
  StatusField,
  CheckboxField,
} from "@/app/app/_components/table_fields";

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
    cell: ({ getValue, row }) => (
      <SecondaryField
        row={row}
        accountId={row.original.id}
        urlType="client"
        entityType={"contact"}
      />
    ),
  },
  {
    id: "last activity",
    accessorKey: "activities",
    header: () => <LogoHead title="Last activity" Icon={Users} />,
    cell: ({ getValue, row }) => <LastInteractionField getValue={getValue} />,
  },
];
