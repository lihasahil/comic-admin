"use client";

import { Loader2, Check } from "lucide-react";
import { useCorrectionCatalogSearch } from "@/hooks/use-scan-collection-correction";
import { CatalogSearchResult } from "@/services/scan-collection-correction.service";

function ResultRow({
  result,
  selected,
  onClick,
  badge,
}: {
  result: CatalogSearchResult;
  selected: boolean;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors ${
        selected
          ? "border-[#C3F001] bg-[#C3F001]/10"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
      }`}
    >
      <img
        src={result.image_url}
        alt={result.series_name}
        className="h-14 w-10 shrink-0 rounded object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm text-white">
            {result.series_name} #{result.issue_number}
          </p>
          {badge && (
            <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-michroma text-emerald-400">
              {badge}
            </span>
          )}
        </div>
        <p className="truncate text-xs text-zinc-500">
          {result.publisher_name} · {result.publication_year} · Vol{" "}
          {result.volume} · ${result.cover_price} · ID {result.id}
        </p>
      </div>
      {selected && <Check size={16} className="shrink-0 text-[#C3F001]" />}
    </button>
  );
}

/**
 * Auto-fetches catalog matches for this correction_id (barcode matches +
 * suggestions) — no manual search query needed, since correction_id
 * already scopes the search on the backend.
 */
export default function CatalogSearchPanel({
  correctionId,
  selectedId,
  onSelect,
}: {
  correctionId: number;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}) {
  const { data, isLoading } = useCorrectionCatalogSearch(correctionId);

  const barcodeMatches = data?.barcode_matches ?? [];
  const catalogResults = data?.catalog_results ?? [];
  const hasAny = barcodeMatches.length > 0 || catalogResults.length > 0;

  return (
    <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium">
          Catalog match
        </p>
        {selectedId && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-[11px] text-zinc-500 hover:text-white"
          >
            Clear selection
          </button>
        )}
      </div>

      <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 size={18} className="animate-spin text-zinc-600" />
          </div>
        ) : !hasAny ? (
          <p className="py-4 text-center text-xs text-zinc-500">
            No catalog matches found.
          </p>
        ) : (
          <>
            {barcodeMatches.map((r) => (
              <ResultRow
                key={`barcode-${r.id}`}
                result={r}
                selected={selectedId === r.id}
                onClick={() => onSelect(selectedId === r.id ? null : r.id)}
                badge="Barcode match"
              />
            ))}
            {catalogResults.map((r) => (
              <ResultRow
                key={`catalog-${r.id}`}
                result={r}
                selected={selectedId === r.id}
                onClick={() => onSelect(selectedId === r.id ? null : r.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
