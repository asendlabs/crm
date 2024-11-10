import { Loader } from "lucide-react";

// This is the global loading page for the app

export default function Loading() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center text-gray-700">
      <div className="flex items-center gap-1.5">
        <Loader className="size-4 animate-spin" /> Loading...
      </div>
    </section>
  );
}
