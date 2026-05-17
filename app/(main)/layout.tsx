"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { Breadcrumb } from "./_components/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navigate = useRouter();
  const scrollContainerRef = useRef<HTMLElement>(null);
  const { isAuthenticated, user } = useAuth();

  // ── Auth guard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      navigate.replace("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  // Reset scroll on route change
  useLayoutEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [pathname]);

  // Guards

  // Not logged in — useEffect redirects to /sign-in
  if (!isAuthenticated) return null;

  return (
    <SidebarProvider
      className="fixed inset-0"
      style={
        {
          "--sidebar-width": "260px",
          "--sidebar-width-icon": "52px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />

      <SidebarInset className="relative flex flex-col overflow-hidden bg-[#171717] h-screen w-full">
        {/* Subtle corner glows */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute"
            style={{
              width: "600px",
              height: "600px",
              left: "-200px",
              top: "-200px",
              background:
                "radial-gradient(circle, rgba(254, 100, 37, 0.15) 0%, rgba(254, 100, 37, 0.05) 40%, transparent 70%)",
            }}
          />
          <div
            className="absolute"
            style={{
              width: "800px",
              height: "800px",
              right: "-250px",
              bottom: "-250px",
              background:
                "radial-gradient(circle, rgba(37, 181, 254, 0.2) 0%, rgba(37, 181, 254, 0.1) 40%, transparent 70%)",
            }}
          />
        </div>

        {/* Top bar */}
        <header className="flex items-center justify-between shrink-0 h-[63.5px] px-4 sm:px-6 lg:px-8 py-3 bg-[rgba(17,17,17,0.7)] backdrop-blur-[10px] border-b border-[rgba(255,255,255,0.2)] z-40 sticky top-0">
          {/* Left: Sidebar Trigger + Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            <SidebarTrigger className="text-[#888888] cursor-pointer" />
            <div className="hidden sm:block">
              <Breadcrumb />
            </div>
          </div>
        </header>

        <main
          key={pathname}
          ref={scrollContainerRef}
          id="dashboard-content"
          className="relative flex-1 overflow-y-auto overflow-x-hidden p-2 md:p-8 z-10 bg-transparent"
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
