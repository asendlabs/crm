"use client";
import { CommandItem } from "@/components/ui/command";
import { useRouter } from "@/hooks/use-performance-router";
import { logoutAction } from "@/server/logout";
import { Loader, LogOut } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

interface LogoutCommandProps {
  runCommandFunction: (command: () => void) => void;
}

export function LogoutCommand({ runCommandFunction }: LogoutCommandProps) {
  const router = useRouter();
  const { execute } = useServerAction(logoutAction);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  return (
    <CommandItem
      className="group flex gap-2"
      onSelect={() =>
        runCommandFunction(async () => {
          setIsLoggingOut(true);
          try {
            const response = await execute();
            if (!response) {
              toast.error("Unable to logout");
              return;
            }
            router.replace("/login");
            toast.success("Logged out successfully", {
              position: "bottom-right",
              duration: 2000,
              richColors: false,
            });
          } catch (error) {
            toast.error("Internal error occurred");
          } finally {
            setIsLoggingOut(false);
          }
        })
      }
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <Loader className="!size-[1.5rem] rounded-md border p-1" />
      ) : (
        <LogOut className="!size-[1.5rem] rounded-md border p-1" />
      )}
      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
    </CommandItem>
  );
}
