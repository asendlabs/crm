// ----------------- DealsPage.tsx -----------------
import { Metadata } from "next";
import React, { Suspense } from "react";
import { cookies } from "next/headers";
import { selectedWorkspaceCookie } from "@/constants";
import { getAllWorkspaceDeals } from "@/data-access/deal";
import { getAllWorkspaceAccounts } from "@/data-access/accounts";
import { DealStage, DealWithPrimaryContact } from "@/types/entities";
import { DealViewProvider, Views } from "@/providers/deal-view-provider";
import { getWorkspaceById } from "@/data-access/workspaces";
import { DealTable } from "./_components/DealsTable";
import { DealColumns } from "./_components/DealsColumns";
import { Loader } from "lucide-react";
import { fetchWithRetry } from "@/lib/utils/fetchWithRetry";
import { decode } from "js-base64";

export const metadata: Metadata = {
  title: "deals",
  description: "list of sales opportunities",
};

export default async function DealsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const initialView = (searchParams?.view as Views) || "board";
  const workspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";

  const decodedWorkspaceId = decode(decodeURI(workspaceId));

  const [workspace, deals, accounts] = await Promise.all([
    fetchWithRetry(() => getWorkspaceById(decodedWorkspaceId), "workspace"),
    fetchWithRetry(() => getAllWorkspaceDeals(decodedWorkspaceId), "deals"),
    fetchWithRetry(
      () => getAllWorkspaceAccounts(decodedWorkspaceId),
      "accounts",
    ),
  ]);

  return (
    <DealViewProvider view={initialView}>
      <Suspense
        fallback={
          <section className="flex min-h-screen flex-col items-center justify-center text-gray-700">
            <div className="flex items-center gap-1.5">
              <Loader className="size-4 animate-spin" /> Loading
            </div>
          </section>
        }
      >
        <DealTable
          columns={DealColumns}
          deals={(deals as DealWithPrimaryContact[]) || []}
          accounts={accounts || []}
          dealStages={(workspace?.dealStages as DealStage[]) || undefined}
        />
      </Suspense>
    </DealViewProvider>
  );
}
