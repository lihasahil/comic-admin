"use client";

import { useParams, useRouter } from "next/navigation";
import { useSubmission, usePreviewBlob } from "@/hooks/useSubmissions";

import {
  ArrowLeft,
  Loader2,
  User,
  Barcode,
  BookOpen,
  Eye,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import DefectMap from "../_components/DefectMap";
import GradeComparison from "../_components/GradeComparison";
import ReviewPanel from "../_components/ReviewPanel";

function Field({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[10px] text-zinc-600 uppercase tracking-wider">
        {label}
      </dt>
      <dd className="text-xs text-zinc-300 mt-0.5">{value}</dd>
    </div>
  );
}

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);

  const { data, isLoading, isError } = useSubmission(id);
  const { data: previewUrl, isFetching: previewLoading } = usePreviewBlob(
    id,
    showPreview,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-zinc-600" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-zinc-500">Submission not found.</p>
        <button
          onClick={() => router.back()}
          className="text-xs text-amber-400 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div>
        {/* Page title */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          {/* Back */}

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-2 text-sm text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold font-michroma text-[#FFFFFF]">
                {data.submission_id}
              </h1>
              <p className="text-xs font-sf-pro text-[#888888] mt-1">
                Submitted{" "}
                {new Date(data.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Preview button */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-sf-pro text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-white hover:border-zinc-700 transition-all"
          >
            {previewLoading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Eye size={12} />
            )}
            {showPreview ? "Hide" : "Load"} annotated preview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Annotated preview (if loaded) */}
            {showPreview && previewUrl && (
              <div className="rounded-xl overflow-hidden border border-zinc-800">
                <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">
                    Annotated Preview
                  </span>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-zinc-600 hover:text-zinc-400 flex items-center gap-1"
                  >
                    <ExternalLink size={10} /> Open full size
                  </a>
                </div>
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "60%" }}
                >
                  <Image
                    src={previewUrl}
                    alt="Annotated preview"
                    fill
                    className="object-contain bg-[#111111B2]"
                    sizes="700px"
                  />
                </div>
              </div>
            )}

            {/* Defect map */}
            <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
              <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-4">
                Defect map · {data.defects.length} defects
              </p>
              <DefectMap
                imageUrl={data.front_image_url}
                defects={data.defects}
              />
            </div>

            {/* Angle images */}
            {Object.keys(data.angle_image_paths).length > 0 && (
              <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
                <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
                  Angle views
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(data.angle_image_paths).map(
                    ([angle, url]) => (
                      <a
                        key={angle}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="relative aspect-2/3 rounded-lg overflow-hidden border border-[#FFFFFF33] hover:border-[#FFFFFF33]/70 transition-colors"
                      >
                        <Image
                          src={url}
                          alt={`Angle ${angle}°`}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                        <span className="absolute bottom-0.5 left-0.5 text-xs text-[#C3F001] py-1 px-3 rounded-md font-michroma bg-[#C3F0011A] border border-[#C3F0014D]">
                          {angle}
                          <span className="align-top text-[7px]">°</span>
                        </span>
                      </a>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Grade comparison */}
            <GradeComparison
              userGradeValue={data.user_grade_value}
              userGradeLabel={data.user_grade_label}
              aiGradeValue={data.ai_grade_value}
              aiGradeLabel={data.ai_grade_label}
            />

            {/* Review panel */}
            <ReviewPanel
              submissionId={data.submission_id}
              currentStatus={data.status}
              currentNotes={data.admin_notes}
            />

            {/* Comic info */}
            <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
              <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
                Comic info
              </p>
              <dl className="space-y-2.5 font-sf-pro">
                <Field
                  label="Title"
                  value={data.comic_scan.manual_comic_info.title}
                />
                <Field
                  label="Issue"
                  value={data.comic_scan.manual_comic_info.issue_number}
                />
                <Field
                  label="Publisher"
                  value={data.comic_scan.manual_comic_info.publisher}
                />
                <Field
                  label="Year"
                  value={data.comic_scan.manual_comic_info.year}
                />
                <div>
                  <dt className="text-[10px] text-zinc-600 uppercase tracking-wider flex items-center gap-1">
                    <Barcode size={10} /> Barcode
                  </dt>
                  <dd className="text-xs text-zinc-400 font-mono mt-0.5">
                    {data.comic_scan.barcode}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    Combined grade
                  </dt>
                  <dd className="text-xs text-zinc-300 mt-0.5">
                    {data.comic_scan.combined_grade_value} —{" "}
                    {data.comic_scan.combined_grade_label}
                  </dd>
                </div>
              </dl>
            </div>

            {/* User info */}
            <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
              <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
                Submitted by
              </p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <User size={13} className="text-zinc-500" />
                </div>
                <div>
                  <div className="text-sm font-medium font-sf-pro text-zinc-300">
                    {data.user.full_name}
                  </div>
                  <div className="text-xs font-sf-pro text-zinc-600">
                    {data.user.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Scan ID */}
            <div className="text-sm text-[#F1F1F1] font-sf-pro px-1">
              Scan: {data.comic_scan.comic_scan_id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
