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
} from "lucide-react";
import { UserWithWorkspaceAndProfile } from "@/types/entities";
import { UserButton } from "@/components/sidebar/user-button";
import { WorkspaceSwitcher } from "@/components/sidebar/workspace-switcher";
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
// Sample data can be replaced with actual props
const sampleData = {
  navMain: [
    {
      title: "Leads",
      url: "/app/leads",
      icon: Building,
    },
    { title: "Deals", url: "/app/deals", icon: Handshake },
    {
      title: "Clients",
      url: "/app/clients",
      icon: SquareUserRound,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

interface AppSidebarProps {
  user: UserWithWorkspaceAndProfile;
  cookieselectedworkspaceid: string;
}

export function AppSidebar({
  ...props
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [loading, setLoading] = React.useState(false);
  const { user, cookieselectedworkspaceid: cookieSelectedWorkspaceId } = props; // Use the props if needed
  const router = useRouter({
    fancy: false,
  });

  const handleHover = (url: string) => () => {
    router.prefetch(url);
  };

  const handleNavigation = (url: string) => () => {
    setLoading(true);
    try {
      router.push(url);
    } catch (error) {
    } finally {
      setLoading(false);
    }
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
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Search className="size-4" />
                <span>Search</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Home className="size-4" />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-1">
          <SidebarMenu>
            {sampleData.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <div
                  onClick={handleNavigation(item.url)}
                  onMouseOver={handleHover(item.url)}
                >
                  <SidebarMenuButton isActive={pathname.startsWith(item.url)}>
                    {loading ? (
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
