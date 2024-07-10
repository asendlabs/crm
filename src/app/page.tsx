"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
      <h1>Homepage, Build in Progress, Coming Soon</h1>
    </main>
  );
}
