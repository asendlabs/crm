import { LeadsColumns } from "@/components/leads/LeadsColumns";
import { LeadTable } from "@/components/leads/LeadsTable";
import { Metadata } from "next";
import React from "react";
import { getAllWorkspaceLeads } from "@/data-access/accounts";
import { cookies } from "next/headers";
import { selectedWorkspaceCookie } from "@/constants";
import { AccountFull } from "@/types/entities";

export const metadata: Metadata = {
  title: "Leads",
  description: "List of Leads",
};

async function LeadsPage() {
  const workspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";
  const data = await getAllWorkspaceLeads(workspaceId);
  return <LeadTable columns={LeadsColumns} tableData={data as AccountFull[]} />;
}

export default LeadsPage;
