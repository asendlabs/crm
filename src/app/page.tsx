import Link from "next/link";
import { googleOAuthClient } from "@/lib/auth";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24">
      <Link href="/inbox" className="bg-black p-4 text-white">
        Go to CRM
      </Link>
      <h1>Homepage, Build in Progress, Coming Soon</h1>
    </main>
  );
}
