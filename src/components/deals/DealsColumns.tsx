"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account, Deal } from "@database/types";
import { CheckboxField } from "@/components/tables/fields/CheckboxField";
import { PrimaryField } from "@/components/tables/fields/PrimaryField";
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
import { LogoHead } from "@/components/tables/headers/LogoHead";
import { CheckboxHead } from "@/components/tables/headers/CheckboxHead";
import { PrimaryHead } from "@/components/tables/headers/PrimaryHead";
import { SecondaryField } from "../tables/fields/SecondaryField";
import { DealWithPrimaryContact } from "@/types/entities";
import { ExpectedCloseField } from "../tables/fields/ExpectedCloseField";
import { UneditableField } from "../tables/fields/UneditableField";
import { ValueField } from "../tables/fields/ValueField";
import { DealStageField } from "../tables/fields/DealStageField";

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
