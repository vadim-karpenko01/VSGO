"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import type { GalleryImage } from "@/lib/gallery";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export type GalleryGridItem = GalleryImage & {
  id?: string;
};

export function GalleryGrid({
  images,
  onDelete,
}: {
  images: GalleryGridItem[];
  onDelete?: (image: GalleryGridItem) => void;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? images[activeIndex] : null;

  const goPrev = () => {
    if (activeIndex === null || images.length === 0) return;
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  };

  const goNext = () => {
    if (activeIndex === null || images.length === 0) return;
    setActiveIndex((activeIndex + 1) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={image.id ?? image.src}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-white dark:bg-gray-900"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-heading)]"
              aria-label={`Відкрити фото: ${image.alt}`}
            >
              {image.src.startsWith("data:") || image.src.startsWith("blob:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  draggable={false}
                />
              ) : (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </button>
            {onDelete ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(image);
                  if (activeIndex === index) setActiveIndex(null);
                  else if (activeIndex !== null && activeIndex > index) {
                    setActiveIndex(activeIndex - 1);
                  }
                }}
                className="absolute right-2 top-2 z-10 rounded-full bg-black/70 p-1.5 text-white opacity-100 transition-opacity hover:bg-black/85 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label={`Видалити фото: ${image.alt}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <Dialog
        open={activeIndex !== null}
        onOpenChange={(open) => {
          if (!open) setActiveIndex(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[94vh] w-auto max-w-[min(98vw,1280px)] gap-0 overflow-visible border-0 bg-transparent p-0 shadow-none sm:max-w-[min(98vw,1280px)]"
        >
          <DialogTitle className="sr-only">
            {active?.alt ?? "Фото галереї"}
          </DialogTitle>
          {active ? (
            <div className="relative flex items-center justify-center gap-2 sm:gap-4">
              {images.length > 1 ? (
                <button
                  type="button"
                  onClick={goPrev}
                  className="shrink-0 rounded-full bg-black/60 p-2 text-white transition-opacity hover:opacity-90"
                  aria-label="Попереднє фото"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              ) : null}
              <div className="relative min-w-0">
                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  className="absolute -right-1 -top-1 z-10 rounded-full bg-black/60 p-2 text-white transition-opacity hover:opacity-90 sm:right-0 sm:top-0"
                  aria-label="Закрити"
                >
                  <X className="h-5 w-5" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.src}
                  alt={active.alt}
                  className="max-h-[90vh] max-w-[min(calc(98vw-7rem),1100px)] object-contain"
                  draggable={false}
                />
              </div>
              {images.length > 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="shrink-0 rounded-full bg-black/60 p-2 text-white transition-opacity hover:opacity-90"
                  aria-label="Наступне фото"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
