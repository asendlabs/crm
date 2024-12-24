// TODO: Add loading state

import { Loader, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="flex items-center gap-1.5">
        <Loader2 className="size-4 animate-spin" /> Loading
      </div>
    </main>
  );
}
