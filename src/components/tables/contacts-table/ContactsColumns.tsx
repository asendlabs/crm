"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Contact } from "@/db/schema";
import { DataTableCheckbox } from "@/components/data-table/DataTableCheckbox";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DataTableEmailField } from "@/components/data-table/custom-fields/DataTableEmailField";
import { DataTableField } from "@/components/data-table/custom-fields/DataTableField";
import { DataTableHeaderCheckbox } from "@/components/data-table/DataTableHeaderCheckbox";
import { DataTableLeadField } from "@/components/data-table/custom-fields/DataTableLeadField";
import { DataTablePhoneField } from "@/components/data-table/custom-fields/DataTablePhone";
import { DataTablePrimaryField } from "@/components/data-table/custom-fields/DataTablePrimaryField";
import { DataTableWebsiteField } from "@/components/data-table/custom-fields/DataTableWebsiteField";

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
    accessorKey: "leadId",
    header: "Lead",
    cell: DataTableLeadField,
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
    cell: DataTableField,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: DataTableEmailField,
  },

  {
    accessorKey: "phone",
    header: "Phone",
    cell: DataTablePhoneField,
  },
  {
    accessorKey: "url",
    header: "Url",
    cell: DataTableWebsiteField,
  },
];
