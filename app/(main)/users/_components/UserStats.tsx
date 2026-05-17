import { User } from "@/services/userService";
import { Users, ShieldCheck, UserX, CheckCircle2 } from "lucide-react";

interface Props {
  users: User[];
  total: number;
}

export default function UserStats({ users, total }: Props) {
  const admins = users.filter((u) => u.role === "admin").length;
  const inactive = users.filter((u) => !u.is_active).length;
  const onboarded = users.filter((u) => u.onboarding_complete).length;

  const stats = [
    {
      label: "Total users",
      value: total,
      icon: Users,
      color: "text-zinc-400",
      bg: "bg-zinc-800",
    },
    {
      label: "Admins",
      value: admins,
      icon: ShieldCheck,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Inactive",
      value: inactive,
      icon: UserX,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      label: "Onboarded",
      value: onboarded,
      icon: CheckCircle2,
      color: "text-primary",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div
          key={label}
          className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4 flex items-center gap-3"
        >
          <div className={`p-2 rounded-lg ${bg}`}>
            <Icon size={16} className={color} />
          </div>
          <div>
            <div className="text-xl font-bold font-michroma text-[#F1F1F1] tabular-nums">
              {value}
            </div>
            <div className="text-xs text-[#888888] font-sf-pro">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
