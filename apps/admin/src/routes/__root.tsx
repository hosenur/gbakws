import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../styles.css";
import Loader from "@/components/loader";
import type { trpc } from "@/lib/trpc";
import { SidebarInset, SidebarProvider } from "@gbakws/ui";
import AppSidebar from "@/components/app-sidebar";
import AppSidebarNav from "@/components/app-sidebar-nav";
import { I18nProvider } from "react-aria";

export interface RouterAppContext {
  trpc: typeof trpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "soil",
      },
      {
        name: "description",
        content: "my-better-t-app is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  const isFetching = useRouterState({
    select: (s) => s.isLoading,
  });

  return (
    <I18nProvider locale="en-IN">
      <HeadContent />
      <SidebarProvider>
        <AppSidebar collapsible="dock" />
        <SidebarInset>
          <AppSidebarNav />
          <div className="p-4 lg:p-6">
            {isFetching ? <Loader /> : <Outlet />}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </I18nProvider>
  );
}
