import { OtherFields } from "@/services/scan-collection-correction.service";

function formatVal(v: unknown) {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}

function label(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function OtherFieldsDiff({
  other_fields,
}: {
  other_fields: OtherFields;
}) {
  const keys = Array.from(
    new Set([
      ...Object.keys(other_fields.was),
      ...Object.keys(other_fields.submitted),
    ]),
  ).filter((k) => other_fields.was[k] !== other_fields.submitted[k]);

  if (keys.length === 0) return null;

  return (
    <div className="rounded-lg border font-sf-pro border-zinc-800 divide-y divide-zinc-800 overflow-hidden">
      <div className="grid grid-cols-3 gap-2 bg-zinc-900 px-3 py-1.5 text-[10px] font-michroma text-zinc-500">
        <span>FIELD</span>
        <span>WAS</span>
        <span>SUBMITTED</span>
      </div>
      {keys.map((k) => (
        <div key={k} className="grid grid-cols-3 gap-2 px-3 py-1.5 text-xs">
          <span className="text-zinc-500">{label(k)}</span>
          <span className="text-zinc-400">
            {formatVal(other_fields.was[k])}
          </span>
          <span className="text-white">
            {formatVal(other_fields.submitted[k])}
          </span>
        </div>
      ))}
    </div>
  );
}
