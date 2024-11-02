import { PageTitle } from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import React from "react";
export default async function HomePage() {
  return (
    <section className="flex h-screen flex-col gap-3 px-5 py-4">
      <div className="flex select-none flex-row items-center justify-between">
        <PageTitle>Home</PageTitle>
        <div className="flex flex-row gap-2">
          <Button variant={"outline"} className="h-8">
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </section>
  );
}
