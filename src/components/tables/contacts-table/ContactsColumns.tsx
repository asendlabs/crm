"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Contact } from "@/db/schema/types";
import { DataTableCheckbox } from "@/components/data-table/custom-fields/DataTableCheckbox";
import { DataTableColumnHeader } from "@/components/data-table/custom-headers/DataTableColumnHeader";
import { DataTableEmailField } from "@/components/data-table/custom-fields/DataTableEmailField";
import DataTableEmailHeader from "@/components/data-table/custom-headers/DataTableEmailHeader";
import { DataTableField } from "@/components/data-table/custom-fields/DataTableField";
import { DataTableHeaderCheckbox } from "@/components/data-table/custom-headers/DataTableHeaderCheckbox";
import { DataTableLeadField } from "@/components/data-table/custom-fields/DataTableLeadField";
import { DataTablePhoneField } from "@/components/data-table/custom-fields/DataTablePhoneField";
import DataTablePhoneHeader from "@/components/data-table/custom-headers/DataTablePhoneHeader";
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
