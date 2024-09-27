"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account, Opportunity } from "@database/types";
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
import { EditableField } from "../tables/fields/EditableField";
import { SecondaryField } from "../tables/fields/SecondaryField";
import { StatusField } from "../tables/fields/StatusField";
import { AiScoreField } from "../tables/fields/AiScoreField";
import { UneditableField } from "../tables/fields/UneditableField";
import { TimestampField } from "../tables/fields/TimestampField";

export const OpportunityColumns: ColumnDef<Opportunity>[] = [
  {
    id: "select",
    header: CheckboxHead,
    cell: CheckboxField,
  },
  {
    id: "value",
    header: () => <PrimaryHead title="Opportunity Value" />,
    cell: PrimaryField,
  },
];
