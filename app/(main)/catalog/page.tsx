"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useCatalogSearch } from "@/hooks/useCatalog";
import { Search, Loader2, BookOpen, X, Plus } from "lucide-react";
import CatalogCard from "./_components/catalog-card";
import ComicFormModal from "./_components/comic-form-modal";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState("");
  const [issueNo, setIssueNo] = useState("");
  const [keyIssueOnly, setKeyIssueOnly] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 400);
  const debouncedPublisher = useDebounce(publisher, 400);
  const debouncedYear = useDebounce(year, 400);
  const debouncedIssueNo = useDebounce(issueNo, 400);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasSearch = !!(
    debouncedQuery ||
    debouncedPublisher ||
    debouncedYear ||
    debouncedIssueNo ||
    keyIssueOnly
  );

  const searchParams = {
    ...(debouncedQuery ? { q: debouncedQuery } : {}),
    ...(debouncedPublisher ? { publisher: debouncedPublisher } : {}),
    ...(debouncedYear ? { year: debouncedYear } : {}),
    ...(debouncedIssueNo ? { issue_number: debouncedIssueNo } : {}),

    key_issue_only: keyIssueOnly,
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useCatalogSearch(searchParams, hasSearch);

  const comics = data?.pages.flatMap((p) => p.results) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  // Infinite scroll via IntersectionObserver
  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect]);

  function clearFilters() {
    setQuery("");
    setPublisher("");
    setYear("");
    setKeyIssueOnly(false);
  }

  return (
    <div className="min-h-screen text-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold font-michroma tracking-tight text-white">
              Comic Catalog
            </h1>
            <p className="text-sm font-sf-pro text-zinc-500 mt-1">
              Search and browse the comic database
            </p>
          </div>
          <div className="flex items-center gap-3">
            {total > 0 && (
              <span className="text-xs font-sf-pro text-zinc-500 self-center">
                {total.toLocaleString()} results
              </span>
            )}
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 bg-[#C3F001] text-[#171717] font-michroma rounded-lg px-4 py-2.5 text-[13px] hover:opacity-90 active:opacity-80 transition-opacity"
            >
              <Plus size={14} />
              Add Comic
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by series or title…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111111B2] border border-[#FFFFFF33] text-sm font-sf-pro text-[#F1F1F1] placeholder:text-zinc-600 focus:outline-none focus:border-[#FFFFFF55] transition-colors"
            />
          </div>

          {/* Secondary filters row */}
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="Publisher"
              className="flex-1 min-w-35 px-3 py-2 rounded-xl bg-[#111111B2] border border-[#FFFFFF33] text-sm font-sf-pro text-[#F1F1F1] placeholder:text-zinc-600 focus:outline-none focus:border-[#FFFFFF55] transition-colors"
            />
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
              className="w-28 px-3 py-2 rounded-xl bg-[#111111B2] border border-[#FFFFFF33] text-sm font-sf-pro text-[#F1F1F1] placeholder:text-zinc-600 focus:outline-none focus:border-[#FFFFFF55] transition-colors"
            />
            <input
              type="text"
              value={issueNo}
              onChange={(e) => setIssueNo(e.target.value)}
              placeholder="Issue No"
              className="w-28 px-3 py-2 rounded-xl bg-[#111111B2] border border-[#FFFFFF33] text-sm font-sf-pro text-[#F1F1F1] placeholder:text-zinc-600 focus:outline-none focus:border-[#FFFFFF55] transition-colors"
            />

            {/* Key issue toggle */}
            <button
              onClick={() => setKeyIssueOnly((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-sf-pro transition-all ${
                keyIssueOnly
                  ? "bg-[#C3F001]/10 border-[#C3F001]/40 text-[#C3F001]"
                  : "bg-[#111111B2] border-[#FFFFFF33] text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${keyIssueOnly ? "bg-[#C3F001]" : "bg-zinc-700"}`}
              />
              Key Issues Only
            </button>

            {hasSearch && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-sf-pro text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X size={12} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {!hasSearch ? (
          <div className="flex flex-col items-center font-sf-pro justify-center py-24 gap-3">
            <BookOpen size={36} className="text-zinc-800" />
            <p className="text-sm text-zinc-600">
              Search the catalog to find comics
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={28} className="animate-spin text-[#888888]" />
            <p className="text-sm font-sf-pro text-[#888888]">
              Loading catalog…
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center font-sf-pro justify-center py-20 gap-3">
            <BookOpen size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">Failed to load catalog.</p>
            <button
              onClick={() => refetch()}
              className="text-xs text-amber-400 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : comics.length === 0 ? (
          <div className="flex flex-col items-center font-sf-pro justify-center py-20 gap-3">
            <BookOpen size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">No comics found.</p>
            {hasSearch && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#C3F001] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {comics.map((comic) => (
              <CatalogCard key={comic.id} comic={comic} />
            ))}

            {/* Infinite scroll sentinel */}
            <div
              ref={sentinelRef}
              className="py-4 flex items-center justify-center"
            >
              {isFetchingNextPage && (
                <Loader2 size={20} className="animate-spin text-zinc-600" />
              )}
              {!hasNextPage && comics.length > 0 && (
                <p className="text-xs text-zinc-700 font-sf-pro">
                  All {total.toLocaleString()} results loaded
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <ComicFormModal
        mode="create"
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(id) => router.push(`/catalog/${id}`)}
      />
    </div>
  );
}
