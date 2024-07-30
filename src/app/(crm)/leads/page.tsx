"use client";

import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LeadsPage() {
  return (
    <section className="px-6 py-4 flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold">Leads</h1>
        <div className="flex flex-row gap-2">
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              className="w-full rounded-lg bg-background pl-8 md:w-60 lg:w-60 max-h-7"
              placeholder="Search..."
            />
          </div>
          <Button className="flex flex-row gap-1 max-h-7 max-w-28 rounded-lg ">
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default LeadsPage;
