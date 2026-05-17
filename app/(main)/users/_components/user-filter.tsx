"use client";

import { UserRole } from "@/services/userService";

export type RoleFilter = UserRole | "all";

interface Props {
  role: RoleFilter;
  onRoleChange: (v: RoleFilter) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

const roleOptions: { label: string; value: RoleFilter }[] = [
  { label: "All", value: "all" },
  { label: "Users", value: "user" },
  { label: "Admins", value: "admin" },
];

export default function UserFilter({
  role,
  onRoleChange,
  search,
  onSearchChange,
}: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-48 max-w-xs">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search name, email, username…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-sm font-sf-pro rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-[#F1F1F1] placeholder:text-[#888888] focus:outline-none focus:border-zinc-700 transition-colors"
        />
      </div>

      {/* Role filter */}
      <div className="flex items-center gap-1 bg-[#111111B2] font-michroma border border-[#FFFFFF33] rounded-xl p-1 w-full md:w-fit overflow-x-auto">
        {roleOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onRoleChange(opt.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all `}
            style={{
              color: role === opt.value ? "#171717" : "#888888",
              background: role === opt.value ? "#C3F001" : "transparent",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
