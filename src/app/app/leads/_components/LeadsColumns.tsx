"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  CalendarDays,
  Component,
  LucideFileText,
  LucideUsers,
  Sparkle,
  Users,
} from "lucide-react";
import { CheckboxHead, LogoHead, PrimaryHead } from "@/components/table_headers";
import { AiScoreField, LastInteractionField, PrimaryField, SecondaryField, StatusField, CheckboxField } from "@/components/table_fields";
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
    cell: ({ getValue, row }) => (
      <PrimaryField getValue={getValue} row={row} isAccount={true} />
    ),
  },
  {
    id: "contacts",
    accessorKey: "contacts",
    header: () => <LogoHead title="Contacts" Icon={LucideUsers} />,
    cell: ({ getValue, row }) => (
      <SecondaryField row={row} urlType="lead" accountId={row.original.id} />
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: () => <LogoHead title="Status" Icon={Component} />,
    cell: ({ getValue, row }) => <StatusField getValue={getValue} />,
  },
  {
    id: "AI score",
    accessorKey: "score",
    header: () => <LogoHead title="AI Score" Icon={CalendarDays} />,
    cell: AiScoreField,
  },
  {
    id: "last activity",
    accessorKey: "activities",
    header: () => <LogoHead title="Last Activity" Icon={Users} />,
    cell: ({ getValue, row }) => <LastInteractionField getValue={getValue} />,
  },
];
