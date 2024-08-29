"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Contact } from "@/database/schemas/types";
import { DataTableCheckbox } from "@/components/table-fields/DataTableCheckbox";
import { DataTableColumnHeader } from "@/components/table-headers/DataTableColumnHeader";
import { DataTableEmailField } from "@/components/table-fields/DataTableEmailField";
import DataTableEmailHeader from "@/components/table-headers/DataTableEmailHeader";
import { DataTableField } from "@/components/table-fields/DataTableField";
import { DataTableHeaderCheckbox } from "@/components/table-headers/DataTableHeaderCheckbox";
import { DataTableLeadField } from "@/components/table-fields/DataTableLeadField";
import { DataTablePhoneField } from "@/components/table-fields/DataTablePhoneField";
import DataTablePhoneHeader from "@/components/table-headers/DataTablePhoneHeader";
import { DataTablePrimaryField } from "@/components/table-fields/DataTablePrimaryField";
import { DataTableWebsiteField } from "@/components/table-fields/DataTableWebsiteField";

export const ContactsColumns: ColumnDef<Contact>[] = [
  {
    id: "select",
    header: DataTableHeaderCheckbox,
    cell: DataTableCheckbox,
  },
  {
    accessorKey: "contactName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Name" />
    ),
    cell: DataTablePrimaryField,
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
    cell: DataTableField,
  },
  {
    accessorKey: "email",
    header: DataTableEmailHeader,
    cell: DataTableEmailField,
  },

  {
    accessorKey: "phone",
    header: DataTablePhoneHeader,
    cell: DataTablePhoneField,
  },
  {
    accessorKey: "leadId",
    header: "Lead",
    cell: DataTableLeadField,
  },
  {
    accessorKey: "url",
    header: "Url",
    cell: DataTableWebsiteField,
  },
];
