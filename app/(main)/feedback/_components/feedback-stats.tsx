import { Feedback } from "@/services/feedbackService";
import { MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";

interface Props {
  feedbacks: Feedback[];
  total: number;
}

export default function FeedbackStats({ feedbacks, total }: Props) {
  const pending = feedbacks.filter((f) => f.status === "pending").length;
  const approved = feedbacks.filter((f) => f.status === "approved").length;
  const rejected = feedbacks.filter((f) => f.status === "rejected").length;

  const stats = [
    {
      label: "Total",
      value: total,
      icon: MessageSquare,
      color: "text-zinc-400",
      bg: "bg-zinc-800",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
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
            <div className="text-xl font-bold font-michroma text-white tabular-nums">
              {value}
            </div>
            <div className="text-xs font-sf-pro text-[#888888]">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
