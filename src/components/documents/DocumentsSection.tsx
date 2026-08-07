"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageCard } from "@/components/home/PageChrome";
import {
  getSession,
  onAuthChange,
  type GalleryAdminSession,
} from "@/lib/gallery-admin/auth";
import {
  deleteDocument,
  documentUrl,
  fetchDocuments,
  uploadDocument,
  type DocumentSection,
  type SiteDocument,
} from "@/lib/documents";
import { getSupabaseConfig } from "@/lib/supabase/client";

export function DocumentsSection({
  section,
  emptyLabel = "Документів поки немає",
}: {
  section: DocumentSection;
  emptyLabel?: string;
}) {
  const [session, setSession] = useState<GalleryAdminSession>(null);
  const [documents, setDocuments] = useState<SiteDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromFallback, setFromFallback] = useState(false);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isAdmin = Boolean(session);
  const supabaseReady = getSupabaseConfig().isConfigured;

  const reload = async () => {
    setLoading(true);
    const result = await fetchDocuments(section);
    setDocuments(result.documents);
    setFromFallback(result.fromFallback);
    if (result.error) setError(result.error);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    void getSession().then((next) => {
      if (active) setSession(next);
    });
    const unsubscribe = onAuthChange(setSession);
    void reload();
    return () => {
      active = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.[0]) return;
    setBusy(true);
    setError(null);
    const result = await uploadDocument({
      section,
      title,
      file: files[0],
    });
    setBusy(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (result.error) {
      setError(result.error);
      return;
    }
    setTitle("");
    await reload();
  };

  const handleDelete = async (doc: SiteDocument) => {
    const confirmed = window.confirm(`Видалити «${doc.title}»?`);
    if (!confirmed) return;
    setBusy(true);
    setError(null);
    const result = await deleteDocument(doc);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    await reload();
  };

  return (
    <div className="space-y-4">
      {isAdmin ? (
        <PageCard
          tone="soft"
          className="border-2 border-[var(--nav-active)] p-4 sm:p-5"
        >
          <p className="mb-3 text-base font-black uppercase tracking-wide text-[var(--brand-heading)]">
            Керування PDF
          </p>
          {!supabaseReady ? (
            <p className="mb-3 text-sm text-amber-700 dark:text-amber-300">
              Додайте NEXT_PUBLIC_SUPABASE_URL і NEXT_PUBLIC_SUPABASE_ANON_KEY у
              .env.local, щоб зберігати файли в Supabase.
            </p>
          ) : null}
          {fromFallback && supabaseReady ? (
            <p className="mb-3 text-sm text-amber-700 dark:text-amber-300">
              Показано локальні файли (fallback). Перевірте RLS політики в
              Supabase.
            </p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 space-y-1.5">
              <label
                htmlFor={`doc-title-${section}`}
                className="text-sm font-semibold"
              >
                Назва документа
              </label>
              <Input
                id={`doc-title-${section}`}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Наприклад: Документ 4"
                className="h-11 border-2 border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-950"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(event) => handleUpload(event.target.files)}
            />
            <Button
              type="button"
              disabled={busy || !supabaseReady}
              onClick={() => fileInputRef.current?.click()}
              className="h-11 bg-[var(--brand-surface)] text-white hover:opacity-90"
            >
              <Upload className="h-4 w-4" />
              Додати PDF
            </Button>
          </div>
        </PageCard>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400"
        >
          {error}
        </p>
      ) : null}

      {loading ? (
        <PageCard className="p-6 text-center text-gray-500">
          Завантаження документів…
        </PageCard>
      ) : null}

      {!loading && documents.length === 0 ? (
        <PageCard className="p-6 text-center text-gray-500">{emptyLabel}</PageCard>
      ) : null}

      {!loading &&
        documents.map((doc) => (
          <PageCard key={`${doc.id}-${doc.file_path}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
              <p className="font-semibold text-[var(--brand-heading)]">
                {doc.title}
              </p>
              {isAdmin && doc.id > 0 ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => handleDelete(doc)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="h-4 w-4" />
                  Видалити
                </Button>
              ) : null}
            </div>
            <div className="flex min-h-[800px] items-center justify-center bg-gray-50 p-4 md:p-6 dark:bg-gray-950">
              <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-white shadow-sm dark:bg-gray-100">
                <iframe
                  src={documentUrl(doc)}
                  title={doc.title}
                  className="h-[80vh] w-full"
                />
              </div>
            </div>
          </PageCard>
        ))}
    </div>
  );
}
