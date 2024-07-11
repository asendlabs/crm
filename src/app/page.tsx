import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24">
      <Link href="/home" className="bg-black p-4 text-white ">Go to Home</Link>
      <h1>Homepage, Build in Progress, Coming Soon</h1>
    </main>
  );
}
