import { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";
import { selectedWorkspaceCookie } from "@/config";
import { DealTable } from "@/components/deals/DealsTable";
import { DealColumns } from "@/components/deals/DealsColumns";
import { getAllWorkspaceDeals } from "@/data-access/deal";
import { getAllWorkspaceAccounts } from "@/data-access/accounts";

export const metadata: Metadata = {
  title: "Deals",
  description: "List of Opportunties",
};

async function LeadsPage() {
  const workspaceId = cookies().get(selectedWorkspaceCookie)?.value || "";
  const data = await getAllWorkspaceDeals(workspaceId);
  const accounts = await getAllWorkspaceAccounts(workspaceId);
  return (
    <DealTable columns={DealColumns} tableData={data} accounts={accounts} />
  );
}

export default LeadsPage;
