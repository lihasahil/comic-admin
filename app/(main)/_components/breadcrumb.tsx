"use client";

import { usePathname } from "next/navigation";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "List User",
  "/feedback": "Manage User Feedback",
  "/scans": "Manage User Comic Scan",
  "/submissions": "Manage User Manual Grading",
};

export function Breadcrumb() {
  const pathname = usePathname();

  const currentLabel =
    Object.entries(routeLabels).find(([route]) =>
      pathname.startsWith(route),
    )?.[1] ?? "Dashboard";

  return (
    <div className="flex items-center gap-6">
      <span
        className="text-[13px] leading-5"
        style={{ fontFamily: "Inter, sans-serif", color: "#888888" }}
      >
        ComicSmith
      </span>
      <span
        className="text-[13px] leading-5"
        style={{ fontFamily: "Inter, sans-serif", color: "#F1F1F1" }}
      >
        {currentLabel}
      </span>
    </div>
  );
}
