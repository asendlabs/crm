import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, Sigma, UserRoundPlusIcon } from "lucide-react";

import UserButton from "@/components/global/UserButton";
import { getUser } from "@/lib/lucia";

export default async function HomePage() {
  const user = await getUser();
  const username = user?.name.toString() || "";
  return (
    <section className="grid grid-flow-row gap-6 pt-6 px-3">
      <div className="absolute top-5 right-4">
        <UserButton />
      </div>
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold select-none">
          Hey, <span className="text-blue-600 ">{username}!</span>
        </h1>
        <hr className="h-[1px] bg-gray-100 my-5" />
        <h2 className="text-2xl font-semibold">Performance</h2>
        <p className="text-gray-500 text-sm">Check out how you are doing!</p>
      </div>
      {/* // TODO: Graphs */}
      <div className="grid grid-flow-col gap-4 grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckIcon className=" w-6 h-6" /> Closed Deals{" "}
            </CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRoundPlusIcon className=" w-6 h-6" /> New Leads{" "}
            </CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sigma className=" w-6 h-6" /> Conversion Rate{" "}
            </CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
      <hr className="h-[1px] bg-gray-100 my-5" />
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold">Recent Leads</h2>
      </div>
      {/* // TODO: Data Table */}
    </section>
  );
}
