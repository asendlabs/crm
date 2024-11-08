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
import { usePathname, useRouter } from "next/navigation";
import { CommandContext } from "@/providers/commandProvider";
import { cn } from "@/lib/utils/tailwind";

type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  searchParams?: string;
};

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
  const [loadedPathnames, setLoadedPathnames] = React.useState<string[]>([]);
  const [loadingPathname, setLoadingPathname] = React.useState<string>("");
  const { user, cookieselectedworkspaceid: cookieSelectedWorkspaceId } = props;
  const router = useRouter();

  const { commandOpen, setCommandOpen } = React.useContext(CommandContext);

  // Create a ref to track if the component is mounted
  const isMounted = React.useRef(false);

  // Collect all routes that need to be prefetched
  const allRoutes = React.useMemo(() => {
    const routes = ["/app/home"];
    nav.forEach((item) => {
      routes.push(item.url + (item.searchParams || ""));
    });
    return routes;
  }, []);

  const prefetchAllRoutes = React.useCallback(() => {
    // Small delay to ensure we don't interfere with initial page load
    setTimeout(() => {
      allRoutes.forEach((route) => {
        if (route !== pathname) {
          router.prefetch(route);
        }
      });
      setLoading(false);
      if (loadedPathnames.length === 0) {
        setLoadedPathnames([pathname]);
      }
    }, 100);
  }, [router, allRoutes, pathname, loadedPathnames]);

  // Handle initial route prefetching
  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;

      // Wait for the page to be fully loaded
      if (typeof window !== "undefined") {
        if (document.readyState === "complete") {
          prefetchAllRoutes();
        } else {
          window.addEventListener("load", prefetchAllRoutes);
          return () => window.removeEventListener("load", prefetchAllRoutes);
        }
      }
    }
  }, [prefetchAllRoutes]);

  const handleNavigation = (url: string) => () => {
    router.replace(url);
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
        />
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
                onDoubleClick={() => {
                  handleNavigation("/app/home");
                  toggleSidebar();
                }}
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
                  onDoubleClick={() => {
                    handleNavigation(item.url);
                    toggleSidebar();
                  }}
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
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserButton user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
