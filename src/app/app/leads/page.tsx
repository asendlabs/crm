import { LeadsColumns } from "@/components/tables/leads/LeadsColumns";
import { LeadTable } from "@/components/tables/leads/LeadsTable";
import { Metadata } from "next";
import React from "react";
import {
  getAllWorkspaceAccounts,
  getAllWorkspaceLeads,
} from "@/data-access/accounts";
import { cookies } from "next/headers";
import { ckSelectedWorkspaceId } from "@/utils/cookie-names";

export const metadata: Metadata = {
  title: "Leads",
  description: "List of Leads",
};

async function LeadsPage() {
  const workspaceId = cookies().get(ckSelectedWorkspaceId)?.value || "";
  const data = await getAllWorkspaceLeads(workspaceId);
  return <LeadTable columns={LeadsColumns} tableData={data} />;
}

export default LeadsPage;
