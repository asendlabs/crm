import { authGateways } from "@/lib/gateways";
import React from "react";

async function InboxPage() {
  await authGateways.internalApp("home");
  return (
    <section className="flex h-screen select-none flex-col items-center justify-center">
      Welcome to CRM
    </section>
  );
}

export default InboxPage;
