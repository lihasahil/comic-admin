import { BetaTester } from "@/services/beta-checklist.service";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TesterCard({ tester }: { tester: BetaTester }) {
  const initials = tester.full_name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#FFFFFF33] bg-[#111111B2] p-4 transition-colors hover:border-zinc-700">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C3F001] text-[#171717] text-sm font-michroma">
          {initials}
        </div>
        <div className="min-w-0 font-sf-pro">
          <p className="truncate text-sm font-medium text-white">
            {tester.full_name}
          </p>
          <p className="truncate text-xs text-zinc-500">{tester.email}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t font-sf-pro border-zinc-800 pt-3 text-xs text-zinc-500">
        <span>ID: {tester.user_id}</span>
        <span>Confirmed {formatDate(tester.confirmed_at)}</span>
      </div>
    </div>
  );
}
