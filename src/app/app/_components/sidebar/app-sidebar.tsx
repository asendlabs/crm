"use client";

import * as React from "react";
import {
  Frame,
  Map,
  Handshake,
  Building,
  SquareUserRound,
  PieChart,
  Search,
  Home,
  Loader,
  Cog,
  Mail,
  Settings,
  PanelLeft,
} from "lucide-react";
import { UserWithWorkspaceAndProfile } from "@/types/entities";
import { UserButton } from "./user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useRouter } from "@/hooks/use-performance-router";
import { CommandContext } from "@/providers/commandProvider";
import { cn } from "@/lib/utils/tailwind";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  searchParams?: string;
};

// Sample data can be replaced with actual props
const nav: NavItem[] = [
  {
    title: "Leads",
    url: "/app/leads",
    icon: Building,
  },
  {
    title: "Deals",
    url: "/app/deals",
    searchParams: "?view=board",
    icon: Handshake,
  },
  {
    title: "Clients",
    url: "/app/clients",
    icon: SquareUserRound,
  },
];

interface AppSidebarProps {
  user: UserWithWorkspaceAndProfile;
  cookieselectedworkspaceid: string;
}

export function AppSidebar({
  ...props
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadingPathname, setLoadingPathname] = React.useState<string>("");
  const { user, cookieselectedworkspaceid: cookieSelectedWorkspaceId } = props; // Use the props if needed
  const router = useRouter();

  const { commandOpen, setCommandOpen } = React.useContext(CommandContext);

  const handleHover = (url: string) => () => {
    router.prefetch(url);
  };

  React.useEffect(() => {
    setLoading(false);
  }, []);

  const handleNavigation2 = (url: string) => () => {
    setLoading(true);
    try {
      router.push(url);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleNavigation = (url: string) => () => {
    setLoading(true);
    setLoadingPathname(url);
    router.push(url);
    setTimeout(() => {
      setLoading(false);
      setLoadingPathname("");
    }, 150);
  };

  const {
    open: isSidebarOpen,
    setOpen: setIsSidebarOpen,
    toggleSidebar,
  } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <section className="relative flex items-center gap-2 p-2">
        <WorkspaceSwitcher
          workspaces={user.workspaces}
          cookieSelectedWorkspaceId={cookieSelectedWorkspaceId}
        />{" "}
        {/* {isSidebarOpen && (
          <div
            className="mt-[0.34rem] flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border"
            onClick={toggleSidebar}
          >
            <PanelLeft className="size-4" />
            <span className="sr-only">Toggle Sidebar</span>
          </div>
        )} */}
        {/* Use props if available */}
      </section>
      <SidebarContent>
        <SidebarGroup className="mt-0.5">
          <SidebarMenu>
            <SidebarMenuItem className="">
              <SidebarMenuButton
                className="flex justify-between"
                onClick={() => {
                  setCommandOpen(!commandOpen);
                }}
              >
                <div className="flex items-center gap-2">
                  <Search className="size-4" />
                  <span>Search</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <div
                onClick={handleNavigation("/app/home")}
                onMouseOver={handleHover("/app/home")}
              >
                <SidebarMenuButton isActive={pathname === "/app/home"}>
                  <div className="flex items-center gap-2">
                    {loading && loadingPathname === "/app/home" ? (
                      <Loader className="size-4 animate-spin" />
                    ) : (
                      <Home className="size-4" />
                    )}
                    <span>Home</span>
                  </div>
                </SidebarMenuButton>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-1">
          <SidebarMenu>
            {nav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <div
                  onClick={handleNavigation(
                    item.url + (item.searchParams || ""),
                  )}
                  onMouseOver={handleHover(item.url)}
                >
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.url)}
                    className="data-[state=open]:bg-black"
                  >
                    <div className="flex items-center gap-2">
                      {loading && loadingPathname === item.url ? (
                        <Loader className="size-4 animate-spin data-[state=open]:bg-black" />
                      ) : (
                        <item.icon className={cn("size-4")} />
                      )}
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </div>
                {/* </div> */}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserButton user={user} /> {/* Use props if available */}
      </SidebarFooter>
    </Sidebar>
  );
}
