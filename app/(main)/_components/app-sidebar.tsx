"use client";

import Link from "next/link";
import {
  Lightbulb,
  LayoutDashboard,
  ChevronRight,
  MoreHorizontal,
  LogOut,
  User2,
  Scan,
  CheckCircle,
  BookOpen,
  ScanSearch,
  Image,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/use-auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: User2 },
  { href: "/feedback", label: "Feedback", icon: CheckCircle },
  { href: "/scans", label: "Scan", icon: Scan },
  { href: "/submissions", label: "Defect Submissions", icon: Lightbulb },
  { href: "/catalog", label: "Comic Catalog", icon: BookOpen },
  { href: "/scan-corrections", label: "Scan Corrections", icon: ScanSearch },
  { href: "/comic-image", label: "Comic Image", icon: Image },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { user } = useAuth();
  const { mutate: logout } = useLogout();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[rgba(255,255,255,0.2)] relative z-50"
      style={{
        background: "rgba(17, 17, 17, 0.7)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {/* ── Header ─────────────────────────────── */}
      <SidebarHeader
        className={cn(
          "border-b border-[#2A2A2A] transition-all duration-300",
          isCollapsed
            ? "h-18 px-0 items-center justify-center"
            : "h-[95.5px] px-6 items-center",
        )}
        style={{ display: "flex", flexDirection: "row" }}
      >
        {isCollapsed ? (
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: "rgba(195,240,1,0.1)" }}
          >
            <span
              className="text-[11px] font-bold tracking-wide"
              style={{ fontFamily: "Michroma, sans-serif", color: "#C3F001" }}
            >
              CS
            </span>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1
              className="text-[15px] leading-5 tracking-[0.375px] whitespace-nowrap"
              style={{
                fontFamily: "Michroma, sans-serif",
                fontWeight: 400,
                color: "#F1F1F1",
              }}
            >
              ComicSmith
            </h1>
            <span
              className="text-[10px] leading-4 tracking-[1px] uppercase whitespace-nowrap"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                color: "#C3F001",
                marginTop: "4px",
              }}
            >
              Admin Platform
            </span>
          </div>
        )}
      </SidebarHeader>

      {/* ── Nav ────────────────────────────────── */}
      <SidebarContent style={{ padding: "16px 12px 0" }}>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={label}
                      className={cn(
                        "gap-3 rounded-md text-sm leading-5 font-sf-pro",
                        "transition-colors duration-150",
                        "hover:bg-[rgba(255,255,255,0.05)]",
                        active
                          ? "bg-[rgba(195,240,1,0.1)] text-[#C3F001] hover:bg-[rgba(195,240,1,0.15)]"
                          : "text-[#888888] hover:text-[#F1F1F1]",
                      )}
                    >
                      <Link
                        href={href}
                        className="relative flex items-center gap-3 w-full"
                      >
                        <Icon
                          className={cn(
                            "shrink-0 transition-colors",
                            active ? "text-[#C3F001]" : "text-[#888888]",
                          )}
                          size={20}
                          strokeWidth={1.67}
                        />
                        <span
                          className={cn(
                            "transition-all duration-300 overflow-hidden whitespace-nowrap",
                            isCollapsed
                              ? "w-0 opacity-0"
                              : "w-auto opacity-100",
                          )}
                        >
                          {label}
                        </span>
                        {active && !isCollapsed ? (
                          <ChevronRight className="absolute right-4" />
                        ) : (
                          ""
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ───────────────────────────────── */}
      <SidebarFooter
        className={cn(
          "border-t border-[#2A2A2A] transition-all duration-300",
          isCollapsed
            ? "h-18 px-0 py-0 flex items-center justify-center"
            : "h-17 py-4 px-2",
        )}
      >
        {isCollapsed ? (
          /* Collapsed: just avatar */
          <div className="shrink-0 rounded-full border-2 border-[#C3F001] bg-[#2A2A2A] size-8 overflow-hidden flex items-center justify-center">
            <span className="text-[11px] font-semibold text-[#C3F001] font-inter">
              {user?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
            </span>
          </div>
        ) : (
          /* Expanded: avatar + name + 3-dot menu */
          <div
            className="relative flex items-center gap-3 w-full"
            ref={dropdownRef}
          >
            {/* Avatar */}
            <div className="shrink-0 rounded-full border-2 border-[#C3F001] bg-[#2A2A2A] size-9 overflow-hidden flex items-center justify-center">
              <span className="text-[13px] font-semibold text-[#C3F001] font-inter">
                {user?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
              </span>
            </div>

            {/* Name + username */}
            <div className="flex flex-col overflow-hidden flex-1 min-w-0">
              <span className="text-[13px] leading-5 whitespace-nowrap font-inter text-[#F1F1F1] truncate">
                {user?.full_name ?? "—"}
              </span>
            </div>

            {/* 3-dot button */}
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="shrink-0 flex items-center justify-center size-7 rounded-md text-[#555555] hover:text-[#F1F1F1] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute bottom-10 right-0 w-40 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-xl z-50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[13px] font-inter text-red-400 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
