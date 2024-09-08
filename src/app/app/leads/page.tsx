import { LeadsColumns } from "@/components/tables/leads/LeadsColumns";
import { LeadTable } from "@/components/tables/leads/LeadsTable";
import { svFetchAllWorkspaceLeads } from "@/actions/leads";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Leads | Asend",
  description: "List of Leads",
};

async function LeadsPage() {
  const { data } = await svFetchAllWorkspaceLeads();
  return <LeadTable columns={LeadsColumns} tableData={data} />;
}

export default LeadsPage;
