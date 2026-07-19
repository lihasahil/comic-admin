"use client";

import { Loader2 } from "lucide-react";
import { useCorrectionCatalogSearch } from "@/hooks/use-scan-collection-correction";
import { CatalogSearchResult } from "@/services/scan-collection-correction.service";

function ResultRow({
  result,
  onPick,
  badge,
}: {
  result: CatalogSearchResult;
  onPick: (id: number) => void;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(result.id)}
      className="flex w-full items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-2.5 text-left hover:border-zinc-700"
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
    </button>
  );
}

/**
 * Reference-only lookup — automatically fetches catalog matches for
 * this correction_id (barcode matches + suggestions). No manual query
 * needed since correction_id already scopes the search on the backend.
 * Clicking a result fills catalog_comic_id in the parent form.
 */
export function CatalogLookup({
  correctionId,
  onPick,
}: {
  correctionId: number;
  onPick: (id: number) => void;
}) {
  const { data, isLoading } = useCorrectionCatalogSearch(correctionId);

  const barcodeMatches = data?.barcode_matches ?? [];
  const catalogResults = data?.catalog_results ?? [];
  const hasAny = barcodeMatches.length > 0 || catalogResults.length > 0;

  return (
    <div className="space-y-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-2 max-h-56 overflow-y-auto">
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 size={18} className="animate-spin text-zinc-600" />
        </div>
      ) : !hasAny ? (
        <p className="py-4 text-center text-xs text-zinc-500">
          No matches found.
        </p>
      ) : (
        <>
          {barcodeMatches.map((r) => (
            <ResultRow
              key={`b-${r.id}`}
              result={r}
              onPick={onPick}
              badge="Barcode match"
            />
          ))}
          {catalogResults.map((r) => (
            <ResultRow key={`c-${r.id}`} result={r} onPick={onPick} />
          ))}
        </>
      )}
    </div>
  );
}
