import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Download, Sparkles, History, CreditCard, LogOut, Layers, Zap } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

const navItems = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, exact: true },
  { title: "New Scrape", url: "/app/scrape", icon: Download },
  { title: "History", url: "/app/history", icon: History },
  { title: "Billing", url: "/app/billing", icon: CreditCard },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const isActive = (url: string, exact?: boolean) =>
    exact ? path === url : path === url || path.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
            <Layers className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-base">SiteHarvest</span>}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.exact)}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="mx-2 mt-4 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-primary" /> AI Studio
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Unlock summaries, SEO audits, keyword extraction & tech-stack detection.
                </p>
                <Button asChild size="sm" className="mt-3 w-full">
                  <Link to="/app/billing"><Zap className="mr-1 h-3 w-3" />Upgrade</Link>
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && user && (
          <div className="mb-2 truncate text-xs text-muted-foreground">{user.email}</div>
        )}
        <Button
          variant="ghost" size="sm"
          className="w-full justify-start"
          onClick={async () => { await signOut(); navigate({ to: "/" }); }}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
