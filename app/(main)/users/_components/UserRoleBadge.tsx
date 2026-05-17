import { UserRole } from "@/services/userService";

interface Props {
  role: UserRole;
}

export default function UserRoleBadge({ role }: Props) {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1.5 font-sf-pro rounded-full px-2.5 py-0.5 text-xs font-medium bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/25">
        Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full font-sf-pro px-2.5 py-0.5 text-xs font-medium bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700/50">
      User
    </span>
  );
}
