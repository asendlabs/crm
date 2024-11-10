"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogTitle } from "../ui/dialog";
import { CommandContext } from "@/providers/commandProvider";
import { GoToLink } from "./commands/GoToLink";
import {
  Book,
  BookText,
  CheckSquare,
  Clock,
  Command,
  Headset,
  LucideIcon,
  MessageSquareText,
} from "lucide-react";
import { CustomIconLink } from "./commands/CustomIconLink";
import { SignOutCommand } from "./commands/SignOutCommand";
import { usePathname } from "next/navigation";
import { ShowInViewCommand } from "./commands/ShowInViewCommand";
import { SwitchPanelCommand } from "./commands/SwitchPanelCommand";
import { NewLeadForm } from "@/app/app/_components/forms/NewLeadForm";
import { NewContactForm } from "@/app/app/_components/forms/NewContactForm";
import { Account } from "@database/types";
import { NewDealForm } from "@/app/app/_components/forms/NewDealForm";

interface CommandLink {
  title: string;
  url: string;
}

interface CustomLogoLink {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface SwitchPanelCommandProps {
  panel: string;
  PanelIcon: LucideIcon;
}

interface CommandData {
  gotoLinks: CommandLink[];
  helpLinks: CustomLogoLink[];
  showInViewPathnames: string[];
  switchPanelPathnames: string[];
  panels: SwitchPanelCommandProps[];
}

const commandsData: CommandData = {
  gotoLinks: [
    { title: "Leads", url: "/app/leads" },
    { title: "Clients", url: "/app/clients" },
    { title: "Deals", url: "/app/deals?view=board" },
    { title: "Account Settings", url: "/app/settings/account" },
    { title: "Workspace Settings", url: "/app/settings/workspace" },
    { title: "Billing Settings", url: "/app/settings/billing" },
    { title: "Appearance Settings", url: "/app/settings/appearance" },
    { title: "Home", url: "/app/home" },
  ],
  helpLinks: [
    { title: "Contact Support", url: "/reach/support", icon: Headset },
    { title: "Give Feedback", url: "/reach/feedback", icon: MessageSquareText },
    { title: "Read Documentation", url: "#", icon: Book },
  ],
  panels: [
    { panel: "activity", PanelIcon: Clock },
    { panel: "tasks", PanelIcon: CheckSquare },
  ],
  showInViewPathnames: ["/app/deals"],
  switchPanelPathnames: ["/app/client/", "/app/leads/"],
};

export function CommandPalette({ accounts }: { accounts: Account[] }) {
  const { commandOpen, setCommandOpen } = React.useContext(CommandContext);

  const pathname = usePathname();

  const shouldRenderShowInViewCommand = commandsData.showInViewPathnames.some(
    (path) => pathname.startsWith(path),
  );

  const shouldRenderSwitchPanelCommand = React.useMemo(() => {
    const pathSegments = pathname.split("/");
    if (pathSegments.length !== 4) return false;

    return (
      (pathname.startsWith("/app/clients/") && pathname !== "/app/clients/") ||
      (pathname.startsWith("/app/leads/") && pathname !== "/app/leads/")
    );
  }, [pathname]);

  // React.useEffect(() => {
  //   const down = (e: KeyboardEvent) => {
  //     if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault();
  //       setCommandOpen((prev) => !prev);
  //     }
  //   };

  //   document.addEventListener("keydown", down);
  //   return () => document.removeEventListener("keydown", down);
  // }, [setCommandOpen]);

  const runCommand = (command: () => void) => {
    setCommandOpen(false);
    command();
  };

  return (
    <>
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Create">
            <NewLeadForm runCommandAction={runCommand} addLead={() => {}} />
            <NewContactForm
              runCommandAction={runCommand}
              addContact={() => {}}
              accounts={accounts}
            />
            <NewDealForm
              runCommandAction={runCommand}
              addDeal={() => {}}
              accounts={accounts}
            />
          </CommandGroup>
          <CommandGroup heading="Navigation">
            {commandsData.gotoLinks.map((link) => (
              <GoToLink
                key={link.title}
                {...link}
                runCommandAction={runCommand}
              />
            ))}
          </CommandGroup>
          <CommandSeparator className="my-2" />
          <CommandGroup heading="Help">
            {commandsData.helpLinks.map((link) => (
              <CustomIconLink
                Icon={link.icon}
                key={link.title}
                {...link}
                runCommandAction={runCommand}
              />
            ))}
          </CommandGroup>
          {shouldRenderShowInViewCommand ||
            (shouldRenderSwitchPanelCommand && (
              <>
                <CommandSeparator className="my-2" />
                <CommandGroup heading="Miscellaneous">
                  {shouldRenderShowInViewCommand && (
                    <ShowInViewCommand runCommandAction={runCommand} />
                  )}
                  {shouldRenderSwitchPanelCommand &&
                    commandsData.panels.map((panel) => (
                      <SwitchPanelCommand
                        key={panel.panel}
                        runCommandAction={runCommand}
                        {...panel}
                      />
                    ))}
                </CommandGroup>
              </>
            ))}
          <CommandSeparator className="my-2" />
          <CommandGroup heading="Account">
            <SignOutCommand runCommandAction={runCommand} />
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
