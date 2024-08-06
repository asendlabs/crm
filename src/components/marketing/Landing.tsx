import Link from "next/link";
import React from "react";

function Landing() {
  return (
    <main className="flex min-h-screen items-center justify-center gap-1 p-24">
      This is a temporary landing page. Please
      <Link href="/auth" className="text-blue-400 underline">
        sign in
      </Link>{" "}
      to continue.
    </main>
  );
}

export default Landing;
