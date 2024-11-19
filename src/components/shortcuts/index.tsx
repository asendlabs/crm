"use client";
import { CommandContext } from "@/providers/command-provider";
import { useContext, useEffect } from "react";

export function Shortcuts() {
  const { setCommandOpen } = useContext(CommandContext);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return <></>;
}
