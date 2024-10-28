import { SettingsDialog } from "@/components/settings-dialog";
import React from "react";

async function HomePage() {
  return (
    <section className="flex h-screen select-none flex-col items-center justify-center">
      Welcome to CRM
      <SettingsDialog />
    </section>
  );
}

export default HomePage;
