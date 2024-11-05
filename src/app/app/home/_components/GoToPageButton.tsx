"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/hooks/use-performance-router";
import {
  ArrowUpRight,
  Building,
  Handshake,
  LucideIcon,
  SquareUserRound,
} from "lucide-react";
import React from "react";

interface GoToPageButtonProps {
  label: string;
  href: string;
}

export function GoToPageButton(props: GoToPageButtonProps) {
  let IconComponent;

  const router = useRouter({
    fancy: true,
  });

  const handleClick = () => {
    router.push(props.href);
  };

  switch (props.href) {
    case "/app/leads":
      IconComponent = <Building className="mr-1.5" size={12} />;
      break;
    case "/app/clients":
      IconComponent = <SquareUserRound className="mr-1.5" size={12} />;
      break;
    case "/app/deals":
      IconComponent = <Handshake className="mr-1.5" size={12} />;
      break;
    default:
      IconComponent = <ArrowUpRight className="mr-1.5" size={12} />;
      break;
  }

  return (
    <Button onClick={handleClick} variant={"outline"} className="h-7 px-1.5">
      {IconComponent}
      {props.label}
    </Button>
  );
}
