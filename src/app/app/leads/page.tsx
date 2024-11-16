import { Metadata } from "next";
import React, { Suspense } from "react";
import { getAllWorkspaceLeads } from "@/data-access/accounts";
import { cookies } from "next/headers";
import { selectedWorkspaceCookie } from "@/constants";
import { AccountFull } from "@/types/entities";
import { LeadTable } from "./_components/LeadsTable";
import { LeadsColumns } from "./_components/LeadsColumns";
import { Loader } from "lucide-react";
import { fetchWithRetry } from "@/lib/utils/fetchWithRetry";
import { decode, fromBase64 } from "js-base64";
import { decryptFromBase64URI } from "@/lib/utils";

export const metadata: Metadata = {
  title: "leads",
  description: "List of leads",
};

export default async function LeadsPage() {
  const workspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";

  const [leads] = await Promise.all([
    fetchWithRetry(
      () => getAllWorkspaceLeads(decryptFromBase64URI(workspaceId)),
      "leads",
    ),
  ]);

  return (
    <Suspense
      fallback={
        <section className="flex min-h-screen flex-col items-center justify-center text-gray-700">
          <div className="flex items-center gap-1.5">
            <Loader className="size-4 animate-spin" /> Loading
          </div>
        </section>
      }
    >
      <LeadTable columns={LeadsColumns} tableData={leads || []} />
    </Suspense>
  );
}
