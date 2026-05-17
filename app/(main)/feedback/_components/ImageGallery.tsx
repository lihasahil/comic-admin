"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { FeedbackImage } from "@/services/feedbackService";
import Image from "next/image";

interface Props {
  images: FeedbackImage[];
}

export default function ImageGallery({ images }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (!images.length) return null;

  const prev = () =>
    setLightboxIdx((i) => (i !== null ? Math.max(0, i - 1) : null));
  const next = () =>
    setLightboxIdx((i) =>
      i !== null ? Math.min(images.length - 1, i + 1) : null
    );

  return (
    <>
      {/* Thumbnails */}
      <div className="flex items-center gap-1.5 flex-wrap mt-2">
        <span className="inline-flex items-center font-michroma gap-1 text-xs text-zinc-500">
          <Images size={12} />
          {images.length}
        </span>
        {images.slice(0, 4).map((img, idx) => (
          <button
            key={img.image_id}
            onClick={() => setLightboxIdx(idx)}
            className="relative h-10 w-10 rounded-md overflow-hidden border border-zinc-700/50 hover:border-amber-500/60 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <Image
              src={img.image_url}
              alt={`attachment-${idx + 1}`}
              fill
              className="object-cover"
              sizes="40px"
            />
          </button>
        ))}
        {images.length > 4 && (
          <button
            onClick={() => setLightboxIdx(4)}
            className="h-10 w-10 rounded-md bg-zinc-800 border font-michroma border-zinc-700/50 text-xs text-zinc-400 hover:text-amber-400 transition-colors flex items-center justify-center"
          >
            +{images.length - 4}
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="relative max-w-3xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute -top-10 right-0 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-zinc-700/50">
              <Image
                src={images[lightboxIdx].image_url}
                alt={`attachment-${lightboxIdx + 1}`}
                fill
                className="object-contain"
                sizes="800px"
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={prev}
                disabled={lightboxIdx === 0}
                className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs text-zinc-500">
                {lightboxIdx + 1} / {images.length}
              </span>
              <button
                onClick={next}
                disabled={lightboxIdx === images.length - 1}
                className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
