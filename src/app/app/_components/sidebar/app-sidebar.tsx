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
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useRouter } from "@/hooks/use-performance-router";
import { CommandContext } from "@/providers/commandProvider";

type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
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

  const { open, setOpen } = React.useContext(CommandContext);

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

  return (
    <Sidebar collapsible="none" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher
          workspaces={user.workspaces}
          cookieSelectedWorkspaceId={cookieSelectedWorkspaceId}
        />{" "}
        {/* Use props if available */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="mt-0.5">
          <SidebarMenu>
            <SidebarMenuItem className="">
              <SidebarMenuButton
                className="flex justify-between"
                onClick={() => {
                  setOpen(!open);
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
                  {loading && loadingPathname === "/app/home" ? (
                    <Loader className="size-4 animate-spin" />
                  ) : (
                    <Home className="size-4" />
                  )}
                  <span>Home</span>
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
                  onClick={handleNavigation(item.url)}
                  onMouseOver={handleHover(item.url)}
                >
                  <SidebarMenuButton isActive={pathname.startsWith(item.url)}>
                    {loading && loadingPathname === item.url ? (
                      <Loader className="size-4 animate-spin" />
                    ) : (
                      <item.icon className="size-4" />
                    )}
                    <span>{item.title}</span>
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
      <SidebarRail />
    </Sidebar>
  );
}
