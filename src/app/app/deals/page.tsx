// ----------------- DealsPage.tsx -----------------
import { Metadata } from "next";
import { Suspense } from "react";
import { getAllWorkspaceDeals } from "@/data-access/deal";
import { getAllWorkspaceAccounts } from "@/data-access/accounts";
import { DealStage, DealWithPrimaryContact } from "@/types/entities";
import { DealViewProvider, Views } from "@/providers/deal-view-provider";
import { getWorkspaceById } from "@/data-access/workspaces";
import { DealTable } from "./_components/DealsTable";
import { DealColumns } from "./_components/DealsColumns";
import { Loader } from "lucide-react";
import { fetchWithRetry } from "@/lib/utils/fetchWithRetry";
import { getSelectedWorkspaceId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { afterCheckoutUrl } from "@/constants";

export const metadata: Metadata = {
  title: "Deals",
  description: "List of sales opportunities",
};

export default async function DealsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const initialView = (searchParams?.view as Views) || "board";
  const workspaceId = await getSelectedWorkspaceId();
  if (!workspaceId) {
    return redirect(afterCheckoutUrl);
  }

  console.log(workspaceId);

  const [workspace, deals, accounts] = await Promise.all([
    fetchWithRetry(() => getWorkspaceById(workspaceId), "workspace"),
    fetchWithRetry(() => getAllWorkspaceDeals(workspaceId), "deals"),
    fetchWithRetry(() => getAllWorkspaceAccounts(workspaceId), "accounts"),
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
