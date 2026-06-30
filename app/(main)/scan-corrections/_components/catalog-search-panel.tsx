"use client";

import { useScanCorrectionCatalogSearch } from "@/hooks/useScanCorrections";
import { Loader2, Search } from "lucide-react";
import CatalogMatchCard from "./catalog-match-card";

interface Props {
  correctionId: string;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function CatalogSearchPanel({
  correctionId,
  selectedId,
  onSelect,
}: Props) {
  const { data, isLoading, isError } =
    useScanCorrectionCatalogSearch(correctionId);

  return (
    <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
      <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
        Catalog matches
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={20} className="animate-spin text-zinc-600" />
        </div>
      ) : isError || !data ? (
        <p className="text-xs font-sf-pro text-zinc-500 py-4 text-center">
          Failed to load catalog matches.
        </p>
      ) : data.barcode_matches.length === 0 &&
        data.catalog_results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <Search size={20} className="text-zinc-700" />
          <p className="text-xs font-sf-pro text-zinc-500">
            No catalog matches found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.barcode_matches.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-sf-pro text-[#888888] uppercase tracking-wider">
                Barcode matches
              </p>
              <div className="space-y-2">
                {data.barcode_matches.map((match) => (
                  <CatalogMatchCard
                    key={`barcode-${match.id}`}
                    match={match}
                    selected={selectedId === match.id}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </div>
          )}

          {data.catalog_results.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-sf-pro text-[#888888] uppercase tracking-wider">
                Other results
              </p>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {data.catalog_results.map((match) => (
                  <CatalogMatchCard
                    key={`catalog-${match.id}`}
                    match={match}
                    selected={selectedId === match.id}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </div>
          )}

          {data.tip && (
            <p className="text-[10px] font-sf-pro text-zinc-600 italic">
              {data.tip}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
