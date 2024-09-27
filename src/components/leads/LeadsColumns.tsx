"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account } from "@database/types";
import { CheckboxField } from "@/components/tables/fields/CheckboxField";
import { PrimaryField } from "@/components/tables/fields/PrimaryField";
import { CalendarDays, Component, LucideFileText, LucideUsers, Sparkle, Users } from "lucide-react";
import { LogoHead } from "@/components/tables/headers/LogoHead";
import { CheckboxHead } from "@/components/tables/headers/CheckboxHead";
import { PrimaryHead } from "@/components/tables/headers/PrimaryHead";
import { EditableField } from "../tables/fields/EditableField";
import { SecondaryField } from "../tables/fields/SecondaryField";
import { StatusField } from "../tables/fields/StatusField";
import { AiScoreField } from "../tables/fields/AiScoreField";
import { UneditableField } from "../tables/fields/UneditableField";
import { TimestampField } from "../tables/fields/TimestampField";

export const LeadsColumns: ColumnDef<Account>[] = [
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
    accessorKey: "contacts",
    header: () => <LogoHead title="Contacts" Icon={LucideUsers} />,
    cell: SecondaryField,
  },
  
  {
    accessorKey: "status",
    header: () => <LogoHead title="Status" Icon={Component} />,
    cell: StatusField,
  },
  {
    accessorKey: "score",
    header: () => <LogoHead title="AI Score" Icon={CalendarDays} />,
    cell: AiScoreField,
  },
  {
    accessorKey: "interaction",
    header: () => <LogoHead title="Last Interaction" Icon={Users} />,
    cell: TimestampField,
  },
];
