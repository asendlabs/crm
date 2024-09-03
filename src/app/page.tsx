import { authGateways } from "@/lib/gateways";
import { Loader2 } from "lucide-react";

export default async function DefaultPage() {
  await authGateways.externalApp();
  return (
    <main className="flex h-screen flex-col items-center justify-center text-black dark:bg-gray-950 dark:text-white">
      <Loader2 className="h-8 w-8 animate-spin" />
    </main>
  );
}
