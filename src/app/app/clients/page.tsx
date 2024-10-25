import { ClientsColumns } from "@/components/clients/ClientsColumns";
import { ClientTable } from "@/components/clients/ClientsTable";
import { Metadata } from "next";
import React from "react";
import { getAllWorkspaceClients } from "@/data-access/accounts";
import { cookies } from "next/headers";
import { selectedWorkspaceCookie } from "@/constants";
import { AccountFull } from "@/types/entities";

export const metadata: Metadata = {
  title: "Clients",
  description: "List of Clients",
};

async function ClientsPage() {
  const workspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";
  const data = await getAllWorkspaceClients(workspaceId);
  return (
    <ClientTable columns={ClientsColumns} tableData={data as AccountFull[]} />
  );
}

export default ClientsPage;
