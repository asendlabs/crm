import { authGateways } from "@/lib/gateways";
import { Loader2 } from "lucide-react";
import React from "react";

async function HomePage() {
  const response = await authGateways.internalApp("home");
  if (response) {
    return (
      <section className="flex h-screen select-none flex-col items-center justify-center">
        Welcome to CRM
      </section>
    );
  }
  return (
    <section className="flex h-screen select-none flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-black/50" />
    </section>
  );
}

export default HomePage;
