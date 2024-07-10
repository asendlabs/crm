"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavItems {
  title: string;
  Icon?: React.ReactNode;
  goto: string;
}

const navItems: NavItems[] = [
  {
    title: "Platform",
    goto: "/platform",
  },
  {
    title: "Why Ascend",
    goto: "/why",
  },
  {
    title: "Pricing",
    goto: "/pricing",
  },
  {
    title: "Support",
    goto: "/support",
    Icon: <ArrowUpRightIcon className="h-5 w-5" />,
  },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [buttonText, setButtonText] = useState("");
  const [buttonGoto, setButtonGoto] = useState("");
  
  useEffect(() => {
    if (pathname === "/signin") {
      setButtonText("Sign Up");
      setButtonGoto("/signup");
    } else if (pathname === "/signup") {
      setButtonText("Sign In");
      setButtonGoto("/signin");
    } else if (pathname === "/forgot") {
      setButtonText("Sign In");
      setButtonGoto("/signin");
    } else if (pathname === "/verify") {
      setButtonText("Sign In");
      setButtonGoto("/signin");
    }
  }, [pathname]);
  
  return (
    <nav className="flex items-center justify-between h-16 px-4">
      <Link className="font-re text-xl" href='/'>ASCEND</Link>
      <div className="items-center hidden md:flex gap-7">
        {navItems.map((item) => (
          <Link key={item.title} href={item.goto} className="flex items-center">
            {item.title}
            {item.Icon && <div className="mr-2">{item.Icon}</div>}
          </Link>
        ))}
      </div>
      <div>
        <Button
          onClick={() => {
            router.push(buttonGoto);
          }}
          className="h-9 font-medium"
        >
          {buttonText}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
