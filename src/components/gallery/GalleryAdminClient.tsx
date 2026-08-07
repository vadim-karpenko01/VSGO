"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "@/components/home/GalleryGrid";
import type { GalleryImage } from "@/lib/gallery";
import {
  getSession,
  onAuthChange,
  signOut,
  type GalleryAdminSession,
} from "@/lib/gallery-admin/auth";
import {
  addGalleryImages,
  deleteGalleryImage,
  loadGalleryImages,
  type ManagedGalleryImage,
} from "@/lib/gallery-admin/store";

export function GalleryAdminClient({
  baseImages,
}: {
  baseImages: GalleryImage[];
}) {
  const [session, setSession] = useState<GalleryAdminSession>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [images, setImages] = useState<ManagedGalleryImage[]>(() =>
    baseImages.map((image) => ({
      id: `static:${image.src}`,
      src: image.src,
      alt: image.alt,
      createdAt: "1970-01-01T00:00:00.000Z",
      isUserAdded: false,
    })),
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setImages(loadGalleryImages(baseImages));
    let active = true;
    void getSession().then((next) => {
      if (!active) return;
      setSession(next);
      setReady(true);
    });
    const unsubscribe = onAuthChange((next) => {
      setSession(next);
      setReady(true);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [baseImages]);

  const isAdmin = Boolean(session);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    const next = await addGalleryImages(baseImages, Array.from(files));
    setImages(next);
    setBusy(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (image: { id?: string; src: string }) => {
    const id = image.id ?? `static:${image.src}`;
    setImages(deleteGalleryImage(baseImages, id));
  };

  return (
    <div className="space-y-4">
      {ready && isAdmin ? (
        <div className="overflow-hidden rounded-xl border-2 border-[var(--nav-active)] bg-[var(--nav-submenu)] shadow-sm dark:bg-[var(--nav-submenu)]/20">
          <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
            <div className="min-w-0">
              <p className="text-base font-black uppercase tracking-wide text-[var(--brand-heading)]">
                Керування галереєю
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ви увійшли як {session?.user.email}. Додавайте фото або
                видаляйте їх іконкою кошика.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => handleUpload(event.target.files)}
              />
              <Button
                type="button"
                size="default"
                disabled={busy}
                onClick={() => fileInputRef.current?.click()}
                className="bg-[var(--brand-surface)] text-white hover:opacity-90"
              >
                <Upload className="h-4 w-4" />
                Додати фото
              </Button>
              <Button
                type="button"
                size="default"
                variant="outline"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Вийти
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <GalleryGrid
        images={images}
        onDelete={isAdmin ? handleDelete : undefined}
      />
    </div>
  );
}
