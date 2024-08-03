"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Contact } from "@/db/schema";
import { DataTableCheckbox } from "@/components/data-table/DataTableCheckbox";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DataTableDescriptionField } from "@/components/data-table/custom-fields/DataTableDescriptionField";
import { DataTableDropdownField } from "@/components/data-table/custom-fields/DataTableDropdownField";
import { DataTableEmailField } from "@/components/data-table/custom-fields/DataTableEmailField";
import { DataTableField } from "@/components/data-table/custom-fields/DataTableField";
import { DataTableHeaderCheckbox } from "@/components/data-table/DataTableHeaderCheckbox";
import { DataTablePhoneField } from "@/components/data-table/custom-fields/DataTablePhone";
import { DataTablePrimaryField } from "@/components/data-table/custom-fields/DataTablePrimaryField";
import { DataTableSecondaryField } from "@/components/data-table/custom-fields/DataTableSecondaryField";
import { DataTableWebsiteField } from "@/components/data-table/custom-fields/DataTableWebsiteField";
import { statusEnum } from "@/db/schema";
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
    header: "Company",
    cell: DataTableSecondaryField,
    
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
