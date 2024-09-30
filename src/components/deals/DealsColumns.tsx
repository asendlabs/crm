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
    id: "value",
    header: () => <PrimaryHead title="Deal Value" />,
    cell: PrimaryField,
  },
  {
    id: "accountName",
    header: () => <LogoHead title="Lead or Customer" Icon={Building} />,
    cell: ({ getValue, row }) => (
      <SecondaryField arrayName="account" getValue={getValue} row={row} />
    ),
  },
  {
    id: "ai_probability",
    header: () => <LogoHead title="Probability" Icon={Bot} />,
  },
];
