"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Upload,
  Check,
} from "lucide-react";
import { useCreateCatalogComic, useUpdateCatalogComic } from "@/hooks/useCatalog";
import { CatalogDetail, ComicCreatePayload, ComicUpdatePayload } from "@/services/catalogService";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "create" | "edit";

interface Props {
  mode: Mode;
  open: boolean;
  onClose: () => void;
  defaultValues?: Partial<CatalogDetail>;
  comicId?: number;
  onCreated?: (id: number) => void;
}

type FormData = {
  // Step 1 – Basic Info
  series_name: string;
  issue_number: string;
  volume: string;
  series_year_began: string;
  publisher_name: string;
  imprint: string;
  publication_year: string;
  publication_month: string;
  cover_price: string;
  barcode: string;
  isbn: string;
  key_issue_status: boolean;
  cover_image: File | null;
  // Step 2 – Physical Details
  page_count: string;
  cover_artist: string;
  cover_description: string;
  printing_edition: string;
  dimensions: string;
  paper_stock: string;
  binding_type: string;
  cover_type: string;
  // Step 3 – Story & Editorial
  first_appearances: string;
  origin_stories: string;
  death_return_characters: string;
  costume_identity_changes: string;
  crossover_events: string;
  historic_significance: string;
  additional_notes: string;
  // Step 4 – Distribution & Pricing
  distribution_type: string;
  regional_variants: string;
  recall_pulped: string;
  low_distribution_status: string;
  print_run_numbers: string;
  market_price_loose: string;
  market_price_complete: string;
  market_price_new: string;
  market_price_graded: string;
  price_grade_40: string;
  price_grade_60: string;
  price_grade_80: string;
  price_grade_92: string;
  price_grade_94: string;
  price_grade_98: string;
  price_grade_100: string;
};

const EMPTY: FormData = {
  series_name: "", issue_number: "", volume: "", series_year_began: "",
  publisher_name: "", imprint: "", publication_year: "", publication_month: "",
  cover_price: "", barcode: "", isbn: "", key_issue_status: false, cover_image: null,
  page_count: "", cover_artist: "", cover_description: "", printing_edition: "",
  dimensions: "", paper_stock: "", binding_type: "", cover_type: "",
  first_appearances: "", origin_stories: "", death_return_characters: "",
  costume_identity_changes: "", crossover_events: "", historic_significance: "",
  additional_notes: "",
  distribution_type: "", regional_variants: "", recall_pulped: "",
  low_distribution_status: "", print_run_numbers: "",
  market_price_loose: "", market_price_complete: "", market_price_new: "",
  market_price_graded: "",
  price_grade_40: "", price_grade_60: "", price_grade_80: "", price_grade_92: "",
  price_grade_94: "", price_grade_98: "", price_grade_100: "",
};

function fromDetail(d: Partial<CatalogDetail>): FormData {
  return {
    series_name: d.series_name ?? "",
    issue_number: d.issue_number ?? "",
    volume: d.volume ?? "",
    series_year_began: d.series_year_began != null ? String(d.series_year_began) : "",
    publisher_name: d.publisher_name ?? "",
    imprint: d.imprint ?? "",
    publication_year: d.publication_year ?? "",
    publication_month: d.publication_month ?? "",
    cover_price: d.cover_price ?? "",
    barcode: d.barcode ?? "",
    isbn: d.isbn ?? "",
    key_issue_status: d.key_issue_status ?? false,
    cover_image: null,
    page_count: d.page_count != null ? String(d.page_count) : "",
    cover_artist: d.cover_artist ?? "",
    cover_description: d.cover_description ?? "",
    printing_edition: d.printing_edition ?? "",
    dimensions: d.dimensions ?? "",
    paper_stock: d.paper_stock ?? "",
    binding_type: d.binding_type ?? "",
    cover_type: d.cover_type ?? "",
    first_appearances: d.first_appearances ?? "",
    origin_stories: d.origin_stories ?? "",
    death_return_characters: d.death_return_characters ?? "",
    costume_identity_changes: d.costume_identity_changes ?? "",
    crossover_events: d.crossover_events ?? "",
    historic_significance: d.historic_significance ?? "",
    additional_notes: d.additional_notes ?? "",
    distribution_type: d.distribution_type ?? "",
    regional_variants: d.regional_variants ?? "",
    recall_pulped: d.recall_pulped ?? "",
    low_distribution_status: d.low_distribution_status ?? "",
    print_run_numbers: d.print_run_numbers ?? "",
    market_price_loose: d.market_price_loose != null ? String(d.market_price_loose) : "",
    market_price_complete: d.market_price_complete != null ? String(d.market_price_complete) : "",
    market_price_new: d.market_price_new != null ? String(d.market_price_new) : "",
    market_price_graded: d.market_price_graded != null ? String(d.market_price_graded) : "",
    price_grade_40: d.price_grade_40 != null ? String(d.price_grade_40) : "",
    price_grade_60: d.price_grade_60 != null ? String(d.price_grade_60) : "",
    price_grade_80: d.price_grade_80 != null ? String(d.price_grade_80) : "",
    price_grade_92: d.price_grade_92 != null ? String(d.price_grade_92) : "",
    price_grade_94: d.price_grade_94 != null ? String(d.price_grade_94) : "",
    price_grade_98: d.price_grade_98 != null ? String(d.price_grade_98) : "",
    price_grade_100: d.price_grade_100 != null ? String(d.price_grade_100) : "",
  };
}

const STEPS = [
  { label: "Basic Info" },
  { label: "Physical" },
  { label: "Editorial" },
  { label: "Pricing" },
];

// ─── Small field primitives ───────────────────────────────────────────────────

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[10px] font-sf-pro text-zinc-500 uppercase tracking-wider mb-1 block">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-sm font-sf-pro text-[#F1F1F1] placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors";
const textareaCls =
  "w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-sm font-sf-pro text-[#F1F1F1] placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors resize-none";

function Field({
  label, required, span,
  children,
}: {
  label: string;
  required?: boolean;
  span?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <Label required={required}>{label}</Label>
      {children}
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Step1({ form, set, mode }: { form: FormData; set: (k: keyof FormData, v: FormData[keyof FormData]) => void; mode: Mode }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    set("cover_image", f);
    setPreview(URL.createObjectURL(f));
  }

  return (
    <div className="space-y-4">
      <FieldGroup>
        <Field label="Series Name" required>
          <input className={inputCls} placeholder="e.g. Batman" value={form.series_name}
            onChange={e => set("series_name", e.target.value)} />
        </Field>
        <Field label="Issue Number" required>
          <input className={inputCls} placeholder="e.g. 1" value={form.issue_number}
            onChange={e => set("issue_number", e.target.value)} />
        </Field>
        <Field label="Volume">
          <input className={inputCls} placeholder="e.g. 1" value={form.volume}
            onChange={e => set("volume", e.target.value)} />
        </Field>
        <Field label="Series Year Began">
          <input className={inputCls} placeholder="e.g. 1939" type="number" value={form.series_year_began}
            onChange={e => set("series_year_began", e.target.value)} />
        </Field>
        <Field label="Publisher" required>
          <input className={inputCls} placeholder="e.g. DC Comics" value={form.publisher_name}
            onChange={e => set("publisher_name", e.target.value)} />
        </Field>
        <Field label="Imprint">
          <input className={inputCls} placeholder="e.g. Vertigo" value={form.imprint}
            onChange={e => set("imprint", e.target.value)} />
        </Field>
        <Field label="Publication Year">
          <input className={inputCls} placeholder="e.g. 1986" value={form.publication_year}
            onChange={e => set("publication_year", e.target.value)} />
        </Field>
        <Field label="Publication Month">
          <input className={inputCls} placeholder="e.g. 03" value={form.publication_month}
            onChange={e => set("publication_month", e.target.value)} />
        </Field>
        <Field label="Cover Price">
          <input className={inputCls} placeholder="e.g. 0.30 USD" value={form.cover_price}
            onChange={e => set("cover_price", e.target.value)} />
        </Field>
        <Field label="Barcode">
          <input className={inputCls} placeholder="Barcode" value={form.barcode}
            onChange={e => set("barcode", e.target.value)} />
        </Field>
        <Field label="ISBN">
          <input className={inputCls} placeholder="ISBN" value={form.isbn}
            onChange={e => set("isbn", e.target.value)} />
        </Field>

        {/* Key Issue toggle */}
        <Field label="Key Issue">
          <button
            type="button"
            onClick={() => set("key_issue_status", !form.key_issue_status)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-sf-pro transition-all w-fit ${
              form.key_issue_status
                ? "bg-[#C3F001]/10 border-[#C3F001]/40 text-[#C3F001]"
                : "bg-[#1A1A1A] border-[#2A2A2A] text-zinc-500"
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
              form.key_issue_status ? "bg-[#C3F001] border-[#C3F001]" : "border-zinc-600"
            }`}>
              {form.key_issue_status && <Check size={9} className="text-black" strokeWidth={3} />}
            </span>
            Mark as key issue
          </button>
        </Field>
      </FieldGroup>

      {/* Cover Image — only for create */}
      {mode === "create" && (
        <div>
          <Label>Cover Image</Label>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-zinc-700 text-xs font-sf-pro text-zinc-500 hover:border-zinc-500 hover:text-zinc-300 transition-colors w-full justify-center"
          >
            <Upload size={13} />
            {form.cover_image ? form.cover_image.name : "Choose cover image"}
          </button>
          {preview && (
            <div className="mt-2 w-20 aspect-2/3 rounded overflow-hidden border border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Step2({ form, set }: { form: FormData; set: (k: keyof FormData, v: FormData[keyof FormData]) => void }) {
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Field label="Page Count">
          <input className={inputCls} type="number" placeholder="e.g. 32" value={form.page_count}
            onChange={e => set("page_count", e.target.value)} />
        </Field>
        <Field label="Cover Artist">
          <input className={inputCls} placeholder="Artist name" value={form.cover_artist}
            onChange={e => set("cover_artist", e.target.value)} />
        </Field>
        <Field label="Cover Description" span>
          <textarea className={textareaCls} rows={2} placeholder="Describe the cover…" value={form.cover_description}
            onChange={e => set("cover_description", e.target.value)} />
        </Field>
        <Field label="Printing Edition">
          <input className={inputCls} placeholder="e.g. 1st print" value={form.printing_edition}
            onChange={e => set("printing_edition", e.target.value)} />
        </Field>
        <Field label="Dimensions">
          <input className={inputCls} placeholder="e.g. 170x260mm" value={form.dimensions}
            onChange={e => set("dimensions", e.target.value)} />
        </Field>
        <Field label="Paper Stock">
          <input className={inputCls} placeholder="e.g. newsprint" value={form.paper_stock}
            onChange={e => set("paper_stock", e.target.value)} />
        </Field>
        <Field label="Binding Type">
          <input className={inputCls} placeholder="e.g. saddle-stitched" value={form.binding_type}
            onChange={e => set("binding_type", e.target.value)} />
        </Field>
        <Field label="Cover Type">
          <input className={inputCls} placeholder="e.g. glossy" value={form.cover_type}
            onChange={e => set("cover_type", e.target.value)} />
        </Field>
      </FieldGroup>
    </div>
  );
}

function Step3({ form, set }: { form: FormData; set: (k: keyof FormData, v: FormData[keyof FormData]) => void }) {
  return (
    <div className="space-y-3">
      {(
        [
          ["first_appearances", "First Appearances"],
          ["origin_stories", "Origin Stories"],
          ["death_return_characters", "Death / Return of Characters"],
          ["costume_identity_changes", "Costume / Identity Changes"],
          ["crossover_events", "Crossover Events"],
          ["historic_significance", "Historic Significance"],
          ["additional_notes", "Additional Notes"],
        ] as [keyof FormData, string][]
      ).map(([key, label]) => (
        <div key={key}>
          <Label>{label}</Label>
          <textarea
            className={textareaCls}
            rows={2}
            placeholder={label}
            value={form[key] as string}
            onChange={e => set(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

function Step4({ form, set }: { form: FormData; set: (k: keyof FormData, v: FormData[keyof FormData]) => void }) {
  return (
    <div className="space-y-5">
      {/* Distribution */}
      <div>
        <p className="text-[10px] font-michroma text-zinc-600 uppercase tracking-widest mb-3">Distribution</p>
        <FieldGroup>
          <Field label="Distribution Type">
            <input className={inputCls} placeholder="e.g. mass market" value={form.distribution_type}
              onChange={e => set("distribution_type", e.target.value)} />
          </Field>
          <Field label="Regional Variants">
            <input className={inputCls} placeholder="Variants" value={form.regional_variants}
              onChange={e => set("regional_variants", e.target.value)} />
          </Field>
          <Field label="Recall / Pulped">
            <input className={inputCls} placeholder="Recall info" value={form.recall_pulped}
              onChange={e => set("recall_pulped", e.target.value)} />
          </Field>
          <Field label="Low Distribution Status">
            <input className={inputCls} placeholder="Status" value={form.low_distribution_status}
              onChange={e => set("low_distribution_status", e.target.value)} />
          </Field>
          <Field label="Print Run Numbers" span>
            <input className={inputCls} placeholder="e.g. 100,000" value={form.print_run_numbers}
              onChange={e => set("print_run_numbers", e.target.value)} />
          </Field>
        </FieldGroup>
      </div>

      {/* Market Prices */}
      <div>
        <p className="text-[10px] font-michroma text-zinc-600 uppercase tracking-widest mb-3">Market Prices (USD)</p>
        <FieldGroup>
          {(
            [
              ["market_price_loose", "Loose"],
              ["market_price_complete", "Complete"],
              ["market_price_new", "New / Sealed"],
              ["market_price_graded", "Graded"],
            ] as [keyof FormData, string][]
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              <input className={inputCls} type="number" step="0.01" placeholder="0.00"
                value={form[key] as string} onChange={e => set(key, e.target.value)} />
            </Field>
          ))}
        </FieldGroup>
      </div>

      {/* Grade Prices */}
      <div>
        <p className="text-[10px] font-michroma text-zinc-600 uppercase tracking-widest mb-3">Prices by Grade (USD)</p>
        <FieldGroup>
          {(
            [
              ["price_grade_40", "4.0 (VG)"],
              ["price_grade_60", "6.0 (FN)"],
              ["price_grade_80", "8.0 (VF)"],
              ["price_grade_92", "9.2 (NM-)"],
              ["price_grade_94", "9.4 (NM)"],
              ["price_grade_98", "9.8 (NM/MT)"],
              ["price_grade_100", "10.0 (GM)"],
            ] as [keyof FormData, string][]
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              <input className={inputCls} type="number" step="0.01" placeholder="0.00"
                value={form[key] as string} onChange={e => set(key, e.target.value)} />
            </Field>
          ))}
        </FieldGroup>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function ComicFormModal({
  mode, open, onClose, defaultValues, comicId, onCreated,
}: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(() =>
    defaultValues ? fromDetail(defaultValues) : EMPTY
  );
  const bodyRef = useRef<HTMLDivElement>(null);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setStep(0);
      setForm(defaultValues ? fromDetail(defaultValues) : EMPTY);
    }
  }, [open, defaultValues]);

  // Scroll step body to top when changing steps
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step]);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  const createMutation = useCreateCatalogComic((id) => {
    onCreated?.(id);
    onClose();
  });

  const updateMutation = useUpdateCatalogComic(comicId ?? 0, () => {
    onClose();
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function validate(): string | null {
    if (step === 0) {
      if (!form.series_name.trim()) return "Series name is required.";
      if (!form.issue_number.trim()) return "Issue number is required.";
      if (!form.publisher_name.trim()) return "Publisher is required.";
    }
    return null;
  }

  function handleNext() {
    const err = validate();
    if (err) { alert(err); return; }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  }

  function numOrUndef(v: string) {
    const n = parseFloat(v);
    return v.trim() === "" ? undefined : isNaN(n) ? undefined : n;
  }

  function handleSubmit() {
    const err = validate();
    if (err) { alert(err); return; }

    if (mode === "create") {
      const payload: ComicCreatePayload = {
        series_name: form.series_name,
        issue_number: form.issue_number,
        publisher_name: form.publisher_name,
        ...(form.volume && { volume: form.volume }),
        ...(form.series_year_began && { series_year_began: Number(form.series_year_began) }),
        ...(form.imprint && { imprint: form.imprint }),
        ...(form.publication_year && { publication_year: form.publication_year }),
        ...(form.publication_month && { publication_month: form.publication_month }),
        ...(form.cover_price && { cover_price: form.cover_price }),
        ...(form.barcode && { barcode: form.barcode }),
        ...(form.isbn && { isbn: form.isbn }),
        key_issue_status: form.key_issue_status,
        ...(form.cover_image && { cover_image: form.cover_image }),
        ...(form.page_count && { page_count: Number(form.page_count) }),
        ...(form.cover_artist && { cover_artist: form.cover_artist }),
        ...(form.cover_description && { cover_description: form.cover_description }),
        ...(form.printing_edition && { printing_edition: form.printing_edition }),
        ...(form.dimensions && { dimensions: form.dimensions }),
        ...(form.paper_stock && { paper_stock: form.paper_stock }),
        ...(form.binding_type && { binding_type: form.binding_type }),
        ...(form.cover_type && { cover_type: form.cover_type }),
        ...(form.first_appearances && { first_appearances: form.first_appearances }),
        ...(form.origin_stories && { origin_stories: form.origin_stories }),
        ...(form.death_return_characters && { death_return_characters: form.death_return_characters }),
        ...(form.costume_identity_changes && { costume_identity_changes: form.costume_identity_changes }),
        ...(form.crossover_events && { crossover_events: form.crossover_events }),
        ...(form.historic_significance && { historic_significance: form.historic_significance }),
        ...(form.additional_notes && { additional_notes: form.additional_notes }),
        ...(form.distribution_type && { distribution_type: form.distribution_type }),
        ...(form.regional_variants && { regional_variants: form.regional_variants }),
        ...(form.recall_pulped && { recall_pulped: form.recall_pulped }),
        ...(form.low_distribution_status && { low_distribution_status: form.low_distribution_status }),
        ...(form.print_run_numbers && { print_run_numbers: form.print_run_numbers }),
      };
      createMutation.mutate(payload);
    } else {
      const payload: ComicUpdatePayload = {
        series_name: form.series_name || undefined,
        issue_number: form.issue_number || undefined,
        publisher_name: form.publisher_name || undefined,
        volume: form.volume || undefined,
        series_year_began: form.series_year_began ? Number(form.series_year_began) : undefined,
        imprint: form.imprint || undefined,
        publication_year: form.publication_year || undefined,
        publication_month: form.publication_month || undefined,
        cover_price: form.cover_price || undefined,
        barcode: form.barcode || undefined,
        isbn: form.isbn || undefined,
        key_issue_status: form.key_issue_status,
        page_count: form.page_count ? Number(form.page_count) : undefined,
        cover_artist: form.cover_artist || undefined,
        cover_description: form.cover_description || undefined,
        printing_edition: form.printing_edition || undefined,
        dimensions: form.dimensions || undefined,
        paper_stock: form.paper_stock || undefined,
        binding_type: form.binding_type || undefined,
        cover_type: form.cover_type || undefined,
        first_appearances: form.first_appearances || undefined,
        origin_stories: form.origin_stories || undefined,
        death_return_characters: form.death_return_characters || undefined,
        costume_identity_changes: form.costume_identity_changes || undefined,
        crossover_events: form.crossover_events || undefined,
        historic_significance: form.historic_significance || undefined,
        additional_notes: form.additional_notes || undefined,
        distribution_type: form.distribution_type || undefined,
        regional_variants: form.regional_variants || undefined,
        recall_pulped: form.recall_pulped || undefined,
        low_distribution_status: form.low_distribution_status || undefined,
        print_run_numbers: form.print_run_numbers || undefined,
        market_price_loose: numOrUndef(form.market_price_loose),
        market_price_complete: numOrUndef(form.market_price_complete),
        market_price_new: numOrUndef(form.market_price_new),
        market_price_graded: numOrUndef(form.market_price_graded),
        price_grade_40: numOrUndef(form.price_grade_40),
        price_grade_60: numOrUndef(form.price_grade_60),
        price_grade_80: numOrUndef(form.price_grade_80),
        price_grade_92: numOrUndef(form.price_grade_92),
        price_grade_94: numOrUndef(form.price_grade_94),
        price_grade_98: numOrUndef(form.price_grade_98),
        price_grade_100: numOrUndef(form.price_grade_100),
      };
      updateMutation.mutate(payload);
    }
  }

  if (!open) return null;

  const isLastStep = step === STEPS.length - 1;

  const modalContent = (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-xl bg-[#111111] border border-[#FFFFFF22] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFFFFF15] shrink-0">
          <div>
            <h2 className="text-sm font-michroma font-semibold text-[#F1F1F1]">
              {mode === "create" ? "Add Comic" : "Edit Comic"}
            </h2>
            <p className="text-[10px] font-sf-pro text-zinc-600 mt-0.5">
              Step {step + 1} of {STEPS.length} — {STEPS[step].label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 rounded-md hover:bg-zinc-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-0 px-5 pt-4 pb-2 shrink-0">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <button
                onClick={() => i < step && setStep(i)}
                className="flex flex-col items-center gap-1 group flex-1"
                disabled={i >= step}
              >
                <div className={`h-1 w-full rounded-full transition-all ${
                  i < step
                    ? "bg-[#C3F001]"
                    : i === step
                    ? "bg-[#C3F001]/60"
                    : "bg-zinc-800"
                }`} />
                <span className={`text-[9px] font-sf-pro transition-colors hidden sm:block ${
                  i === step ? "text-[#C3F001]" : i < step ? "text-zinc-400" : "text-zinc-700"
                }`}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && <div className="w-1.5" />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 py-4">
          {step === 0 && <Step1 form={form} set={set} mode={mode} />}
          {step === 1 && <Step2 form={form} set={set} />}
          {step === 2 && <Step3 form={form} set={set} />}
          {step === 3 && <Step4 form={form} set={set} />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#FFFFFF15] shrink-0 gap-3">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-sf-pro text-zinc-500 border border-zinc-800 hover:text-zinc-300 hover:border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={13} /> Back
          </button>

          <div className="flex items-center gap-2">
            {!isLastStep && (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-sf-pro text-zinc-300 border border-zinc-700 hover:text-white hover:border-zinc-600 transition-all"
              >
                Next <ChevronRight size={13} />
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-michroma font-semibold bg-[#C3F001] text-[#171717] hover:bg-[#C3F001]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isPending ? (
                <><Loader2 size={12} className="animate-spin" /> Saving…</>
              ) : mode === "create" ? (
                "Create Comic"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
