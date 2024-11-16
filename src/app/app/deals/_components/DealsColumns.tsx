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
} from "@/app/app/_components/table_headers";
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
} from "@/app/app/_components/table_fields";
import { DealWithPrimaryContact } from "@/types/entities";

export const DealColumns: ColumnDef<DealWithPrimaryContact>[] = [
  {
    id: "select",
    header: CheckboxHead,
    cell: CheckboxField,
  },
  {
    id: "title",
    header: () => <PrimaryHead title="deal title" />,
    cell: ({ getValue, row }) => (
      <SecondaryField
        row={row}
        urlType={row.original.account?.type ?? ""} // Account type is used to determine the URL path
        accountId={row.original.accountId}
        entityId={row.original.id}
        entityType={"deal"}
        showAvatar={false} // Hides avatar in the title column for a cleaner look
      />
    ),
    accessorKey: "title",
  },
  {
    id: "account",
    header: () => <LogoHead title="lead or client" Icon={Building} />,
    cell: ({ getValue, row }) => (
      <SecondaryField
        row={row}
        urlType={row.original.account?.type ?? ""}
        isPrimary
        accountId={row.original.accountId}
      />
    ),
    accessorKey: "account",
  },
  {
    id: "stage",
    header: () => <LogoHead title="deal stage" Icon={Route} />,
    cell: DealStageField,
    accessorKey: "stage",
  },
  {
    id: "value",
    header: () => <LogoHead title="deal value" Icon={DollarSign} />,
    cell: ValueField,
    accessorKey: "value",
  },
  {
    id: "expected close",
    header: () => <LogoHead title="expected close" Icon={CalendarDays} />,
    cell: ExpectedCloseField,
    accessorKey: "expectedCloseDate",
  },
];
