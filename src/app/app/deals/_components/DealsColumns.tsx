"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account, Deal } from "@database/types";
import {
  Bot,
  Building,
  CalendarDays,
  Component,
  DollarSign,
  LucideFileText,
  LucideUsers,
  Route,
  Sparkle,
  Users,
} from "lucide-react";
import {
  CheckboxHead,
  LogoHead,
  PrimaryHead,
} from "@/components/table_headers";
import {
  AiScoreField,
  LastInteractionField,
  PrimaryField,
  SecondaryField,
  StatusField,
  CheckboxField,
  DealStageField,
  ValueField,
  ExpectedCloseField,
} from "@/components/table_fields";
import { DealWithPrimaryContact } from "@/types/entities";

export const DealColumns: ColumnDef<DealWithPrimaryContact>[] = [
  {
    id: "select",
    header: CheckboxHead,
    cell: CheckboxField,
  },
  {
    id: "title",
    header: () => <PrimaryHead title="Deal Title" />,
    cell: ({ getValue, row }) => (
      <PrimaryField getValue={getValue} row={row} isAccount={false} />
    ),
    accessorKey: "title",
  },
  {
    id: "account",
    header: () => <LogoHead title="Lead or Client" Icon={Building} />,
    cell: ({ getValue, row }) => (
      <SecondaryField
        row={row}
        urlType={row.original.account?.type ?? ""}
        accountId={row.original.accountId}
        entityId={row.original.id}
        entityType={"deal"}
      />
    ),
    accessorKey: "account",
  },
  {
    id: "stage",
    header: () => <LogoHead title="Deal Stage" Icon={Route} />,
    cell: DealStageField,
    accessorKey: "stage",
  },
  {
    id: "value",
    header: () => <LogoHead title="Deal Value" Icon={DollarSign} />,
    cell: ValueField,
    accessorKey: "value",
  },
  {
    id: "expected close",
    header: () => <LogoHead title="Expected Close" Icon={CalendarDays} />,
    cell: ExpectedCloseField,
    accessorKey: "expectedCloseDate",
  },
];
