import { User } from "@/services/userService";
import UserRoleBadge from "./user-role-badge";
import { Coins, ScanLine, Library, MessageSquareCheck } from "lucide-react";

interface Props {
  users: User[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const avatarColors = [
  "bg-violet-500/20 text-violet-400",
  "bg-amber-500/20 text-amber-400",
  "bg-teal-500/20 text-teal-400",
  "bg-rose-500/20 text-rose-400",
  "bg-sky-500/20 text-sky-400",
  "bg-emerald-500/20 text-emerald-400",
];

function avatarColor(id: number) {
  return avatarColors[id % avatarColors.length];
}

export default function UserTable({ users }: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#FFFFFF33] font-sf-pro bg-[#111111B2]">
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Stats
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {users.map((user, index) => (
              <tr
                key={user.user_id}
                className={`transition-colors hover:bg-zinc-900/40 ${
                  index % 2 === 0 ? "bg-[#171717]" : "bg-[#0D0D0D]"
                } ${!user.is_active ? "opacity-50" : ""}`}
              >
                {/* User cell */}
                <td className="px-4 py-3">
                  <div className="flex items-center font-sf-pro gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${avatarColor(user.user_id)}`}
                    >
                      {getInitials(user.full_name)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-200 flex items-center gap-1.5">
                        {user.full_name}
                        {!user.is_active && (
                          <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full">
                            deleted
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-600 mt-0.5">
                        {user.username ? (
                          <span className="text-zinc-500">
                            @{user.username}
                          </span>
                        ) : null}
                        {user.username && " · "}
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-4 py-3">
                  <UserRoleBadge role={user.role} />
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`inline-flex items-center font-sf-pro gap-1 text-xs ${
                        user.onboarding_complete
                          ? "text-primary"
                          : "text-[#888888]"
                      }`}
                    >
                      {user.onboarding_complete ? "Onboarded" : "Pending setup"}
                    </span>
                  </div>
                </td>

                {/* Stats */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    {user.coins > 0 && (
                      <span className="flex items-center font-michroma gap-1 text-amber-400">
                        <Coins size={11} />
                        {user.coins}
                      </span>
                    )}
                    {user.scan_count > 0 && (
                      <span className="flex items-center font-michroma gap-1">
                        <ScanLine size={11} />
                        {user.scan_count}
                      </span>
                    )}
                    {user.collection_size > 0 && (
                      <span className="flex items-center font-michroma gap-1">
                        <Library size={11} />
                        {user.collection_size}
                      </span>
                    )}
                    {user.approved_feedback_count > 0 && (
                      <span className="flex items-center gap-1 font-michroma text-primary">
                        <MessageSquareCheck size={11} />
                        {user.approved_feedback_count}
                      </span>
                    )}
                    {user.coins === 0 &&
                      user.scan_count === 0 &&
                      user.collection_size === 0 &&
                      user.approved_feedback_count === 0 && (
                        <span className="text-zinc-700">—</span>
                      )}
                  </div>
                </td>

                {/* Joined */}
                <td className="px-4 py-3 text-xs font-sf-pro text-zinc-600">
                  {formatDate(user.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y font-sf-pro divide-zinc-800/60">
        {users.map((user) => (
          <div
            key={user.user_id}
            className={`p-4 ${!user.is_active ? "opacity-50" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${avatarColor(user.user_id)}`}
                >
                  {getInitials(user.full_name)}
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-200">
                    {user.full_name}
                  </div>
                  <div className="text-xs text-zinc-600">
                    {user.username ? `@${user.username} · ` : ""}
                    {user.email}
                  </div>
                </div>
              </div>
              <UserRoleBadge role={user.role} />
            </div>

            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <span
                className={`text-xs flex font-sf-pro items-center gap-1 ${
                  user.onboarding_complete ? "text-primary" : "text-[#888888]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    user.onboarding_complete ? "bg-primary" : "bg-[#888888]"
                  }`}
                />
                {user.onboarding_complete ? "Onboarded" : "Pending setup"}
              </span>
              {user.coins > 0 && (
                <span className="text-xs flex items-center font-michroma gap-1 text-amber-400">
                  <Coins size={11} /> {user.coins} coins
                </span>
              )}
              <span className="text-xs text-zinc-600 font-sf-pro ml-auto">
                {formatDate(user.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
