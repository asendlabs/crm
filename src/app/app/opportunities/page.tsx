import { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";
import { selectedWorkspaceCookie } from "@/config";
import { OpportunityTable } from "@/components/opportunities/OpportunitiesTable";
import { OpportunityColumns } from "@/components/opportunities/OpportunitiesColumns";
import { getAllWorkspaceOpportunities } from "@/data-access/opportunities";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "List of Opportunties",
};

async function LeadsPage() {
  const workspaceId = cookies().get(selectedWorkspaceCookie)?.value || "";
  const data = await getAllWorkspaceOpportunities(workspaceId);
  return <OpportunityTable columns={OpportunityColumns} tableData={data} />;
}

export default LeadsPage;
