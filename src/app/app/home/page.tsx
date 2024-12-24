import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { GoToPageButton } from "./_components/GoToPageButton";

export default async function HomePage() {
  return (
    <section className="flex h-screen flex-col gap-3 px-5 py-4">
      <div className="flex select-none flex-row items-center justify-between">
        <PageTitle>Home</PageTitle>
        <div className="flex flex-row gap-2">
          <Button variant={"outline"} className="h-8">
            Write feedback
          </Button>
        </div>
      </div>
      <div className="flex h-full items-center justify-center gap-2">
        Go to <GoToPageButton label="Leads" href="/app/leads" />
        or <GoToPageButton label="Deals" href="/app/deals" />
        or <GoToPageButton label="Clients" href="/app/clients" />
      </div>
    </section>
  );
}
