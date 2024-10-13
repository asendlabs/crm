import { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";
import { selectedWorkspaceCookie } from "@/config";
import { DealTable } from "@/components/deals/DealsTable";
import { DealColumns } from "@/components/deals/DealsColumns";
import { getAllWorkspaceDeals } from "@/data-access/deal";
import { getAllWorkspaceAccounts } from "@/data-access/accounts";
import { DealStage, DealWithPrimaryContact } from "@/types/entities";
import { DealViewProvider, Views } from "@/providers/dealsViewProvider";
import { getWorkspaceById } from "@/data-access/workspaces";

export const metadata: Metadata = {
  title: "Deals",
  description: "List of Opportunties",
};

export default async function page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const initialView = (searchParams?.view as Views) || "board";
  const workspaceId = cookies().get(selectedWorkspaceCookie)?.value || "";
  const workspace = await getWorkspaceById(workspaceId)
  const data = await getAllWorkspaceDeals(workspaceId);
  const accounts = await getAllWorkspaceAccounts(workspaceId);
  return (
    <DealViewProvider view={initialView}>
      <DealTable
        columns={DealColumns}
        tableData={data as DealWithPrimaryContact[]}
        deals={data as DealWithPrimaryContact[]}
        accounts={accounts}
        dealStages={(workspace?.dealStages as DealStage[]) || undefined}
      />
    </DealViewProvider>
  );
}
