import { PageTitle } from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { GoToPageButton } from "./_components/GoToPageButton";
export default async function HomePage() {
  return (
    <section className="flex h-screen flex-col gap-3 px-5 py-4">
      <div className="flex select-none flex-row items-center justify-between">
        <PageTitle>Home</PageTitle>
        <div className="flex flex-row gap-2">
          <Button variant={"outline"} className="h-8">
            write feedback
          </Button>
        </div>
      </div>
      <div className="flex h-full items-center justify-center gap-2">
        go to <GoToPageButton label="leads" href="/app/leads" />
        or <GoToPageButton label="deals" href="/app/deals" />
        or <GoToPageButton label="clients" href="/app/clients" />
      </div>
    </section>
  );
}
