import { selectedWorkspaceCookie } from "@/constants";
import { getEmailIntegrationsByWorkspaceId } from "@/data-access/emails";
import { cookies } from "next/headers";
import React from "react";
import { ConnectEmailButton } from "./_components/ConnectEmailButton";

async function page() {
  const workspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";
  const checkIfEmailConnected =
    await getEmailIntegrationsByWorkspaceId(workspaceId);
  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      {checkIfEmailConnected && checkIfEmailConnected.length > 0 ? (
        <p>Emails connected
            {JSON.stringify(checkIfEmailConnected)}
        </p>
      ) : (
        <p className="flex gap-2 items-center">No emails accounts connected
            <ConnectEmailButton />
        </p>
      )}
    </section>
  );
}

export default page;
