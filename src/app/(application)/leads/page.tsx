import { LeadColumns } from "@/components/tables/leads/LeadColumns";
import { LeadTable } from "@/components/tables/leads/LeadTable";
import { svFetchAllWorkspaceLeads } from "@/server/leads";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Leads | Asend",
  description: "List of Leads",
};

async function LeadsPage() {
  const { data } = await svFetchAllWorkspaceLeads();
  return <LeadTable columns={LeadColumns} tableData={data} />;
}

export default LeadsPage;
