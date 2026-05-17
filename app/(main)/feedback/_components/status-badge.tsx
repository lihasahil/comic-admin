import { FeedbackStatus } from "@/services/feedbackService";

interface Props {
  status: FeedbackStatus;
}

const config: Record<FeedbackStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30",
  },
  approved: {
    label: "Approved",
    className: "bg-primary/10 text-primary ring-1 ring-primary/30",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
  },
};

export default function StatusBadge({ status }: Props) {
  const { label, className } = config[status] ?? config.pending;

  return (
    <span
      className={`inline-flex items-center font-sf-pro gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
