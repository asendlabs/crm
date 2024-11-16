import { Metadata } from "next";
import React, { Suspense } from "react";
import {
  getAllWorkspaceClients,
  getAllWorkspaceAccounts,
} from "@/data-access/accounts";
import { cookies } from "next/headers";
import { selectedWorkspaceCookie } from "@/constants";
import { AccountFull } from "@/types/entities";
import { ClientTable } from "./_components/ClientsTable";
import { ClientsColumns } from "./_components/ClientsColumns";
import { Loader } from "lucide-react";
import { getWorkspaceById } from "@/data-access/workspaces";
import { fetchWithRetry } from "@/lib/utils/fetchWithRetry";
import { decode } from "js-base64";

export const metadata: Metadata = {
  title: "Clients",
  description: "List of Clients",
};

export default async function ClientsPage() {
  const workspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";

  const decodedWorkspaceId = decode(decodeURI(workspaceId));

  const [clients] = await Promise.all([
    fetchWithRetry(() => getAllWorkspaceClients(decodedWorkspaceId), "clients"),
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
      <ClientTable
        columns={ClientsColumns}
        tableData={(clients as AccountFull[]) || []}
      />
    </Suspense>
  );
}
