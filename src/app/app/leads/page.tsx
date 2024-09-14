import { LeadsColumns } from "@/components/tables/leads/LeadsColumns";
import { LeadTable } from "@/components/tables/leads/LeadsTable";
import { Metadata } from "next";
import React from "react";
import {
  getAllWorkspaceAccounts,
  getAllWorkspaceLeads,
} from "@/data-access/accounts";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Leads | Asend",
  description: "List of Leads",
};

async function LeadsPage() {
  const workspaceId = cookies().get("selectedWorkspaceId")?.value || "";
  const data = await getAllWorkspaceLeads(workspaceId);
  return <LeadTable columns={LeadsColumns} tableData={data} />;
}

export default LeadsPage;
