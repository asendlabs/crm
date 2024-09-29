import { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";
import { selectedWorkspaceCookie } from "@/config";
import { OpportunityTable } from "@/components/opportunities/OpportunitiesTable";
import { OpportunityColumns } from "@/components/opportunities/OpportunitiesColumns";
import { getAllWorkspaceOpportunities } from "@/data-access/opportunities";
import { getAllWorkspaceAccounts } from "@/data-access/accounts";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "List of Opportunties",
};

async function LeadsPage() {
  const workspaceId = cookies().get(selectedWorkspaceCookie)?.value || "";
  const data = await getAllWorkspaceOpportunities(workspaceId);
  const accounts = await getAllWorkspaceAccounts(workspaceId);
  return <OpportunityTable columns={OpportunityColumns} tableData={data} accounts={accounts} />;
}

export default LeadsPage;
