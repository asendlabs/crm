import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

import { Button } from "../ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col w-full border-t-[1px] border-gray-200 dark:bg-gray-900">
      <div className="flex flex-row pt-3 justify-center gap-6 text-sm">
        <Link href="/team">
          Team
        </Link>
        <Link href="/docs/terms">
          Terms of Service
        </Link>
        <Link href="/docs/privacy">
          Privacy Policy
        </Link>
        <Link href="/roadmap">
          Roadmap
        </Link>
      </div>
      <div className="pb-3 flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500">
          Copyright © {new Date().getFullYear()} Ascend CRM. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
