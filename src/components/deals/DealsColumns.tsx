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
  LucideFileText,
  LucideUsers,
  Sparkle,
  Users,
} from "lucide-react";
import { LogoHead } from "@/components/tables/headers/LogoHead";
import { CheckboxHead } from "@/components/tables/headers/CheckboxHead";
import { PrimaryHead } from "@/components/tables/headers/PrimaryHead";
import { EditableField } from "../tables/fields/EditableField";
import { SecondaryField } from "../tables/fields/SecondaryField";
import { StatusField } from "../tables/fields/StatusField";
import { AiScoreField } from "../tables/fields/AiScoreField";
import { UneditableField } from "../tables/fields/UneditableField";
import { TimestampField } from "../tables/fields/TimestampField";

export const DealColumns: ColumnDef<Deal>[] = [
  {
    id: "select",
    header: CheckboxHead,
    cell: CheckboxField,
  },
  {
    id: "title",
    header: () => <PrimaryHead title="Title" />,
    cell: PrimaryField,
    accessorKey: "title",
  },
  {
    id: "primaryContact",
    header: () => <LogoHead title="Lead or Client" Icon={Building} />,
    cell: ({ getValue, row }) => (
      <SecondaryField
        arrayName="primaryContact"
        getValue={getValue}
        row={row}
      />
    ),
    accessorKey: "primaryContact",
  },
  {
    id: "ai_probability",
    header: () => <LogoHead title="Probability" Icon={Bot} />,
    accessorKey: "ai_probability",
  },
];
