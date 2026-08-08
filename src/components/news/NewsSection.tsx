"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageCard, ContentTitle, ContentSubtitle } from "@/components/home/PageChrome";
import { NewsEditorForm } from "@/components/news/NewsEditorForm";
import { NewsBody } from "@/components/news/NewsBody";
import {
  getSession,
  onAuthChange,
  type GalleryAdminSession,
} from "@/lib/gallery-admin/auth";
import {
  createNews,
  deleteNews,
  fetchNews,
  updateNews,
  type NewsInput,
  type SiteNews,
} from "@/lib/news";
import { getSupabaseConfig } from "@/lib/supabase/client";

export function NewsSection() {
  const [session, setSession] = useState<GalleryAdminSession>(null);
  const [news, setNews] = useState<SiteNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromFallback, setFromFallback] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const isAdmin = Boolean(session);
  const supabaseReady = getSupabaseConfig().isConfigured;

  const reload = async () => {
    setLoading(true);
    const result = await fetchNews();
    setNews(result.news);
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
  }, []);

  const handleCreate = async (input: NewsInput) => {
    setBusy(true);
    setError(null);
    const result = await createNews(input);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setShowCreate(false);
    await reload();
  };

  const handleUpdate = async (id: number, input: NewsInput) => {
    setBusy(true);
    setError(null);
    const result = await updateNews(id, input);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setEditingId(null);
    await reload();
  };

  const handleDelete = async (item: SiteNews) => {
    const confirmed = window.confirm(`Видалити «${item.title}»?`);
    if (!confirmed) return;
    setBusy(true);
    setError(null);
    const result = await deleteNews(item.id);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (editingId === item.id) setEditingId(null);
    await reload();
  };

  const startEdit = (id: number) => {
    setShowCreate(false);
    setEditingId(id);
  };

  const startCreate = () => {
    setEditingId(null);
    setShowCreate(true);
  };

  return (
    <div className="space-y-4">
      {isAdmin ? (
        <PageCard
          tone="soft"
          className="border-2 border-[var(--nav-active)] p-4 sm:p-5"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-base font-black uppercase tracking-wide text-[var(--brand-heading)]">
              Керування новинами
            </p>
            {!showCreate ? (
              <Button
                type="button"
                disabled={busy || !supabaseReady}
                onClick={startCreate}
                className="h-10 bg-[var(--brand-surface)] text-white hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Додати
              </Button>
            ) : null}
          </div>
          {!supabaseReady ? (
            <p className="mb-3 text-sm text-amber-700 dark:text-amber-300">
              Додайте NEXT_PUBLIC_SUPABASE_URL і NEXT_PUBLIC_SUPABASE_ANON_KEY у
              .env.local, щоб зберігати новини в Supabase.
            </p>
          ) : null}
          {fromFallback && supabaseReady ? (
            <p className="mb-3 text-sm text-amber-700 dark:text-amber-300">
              Показано локальну новину (fallback). Виконайте SQL з
              supabase/news.sql і додайте першу новину через форму.
            </p>
          ) : null}
          {showCreate ? (
            <NewsEditorForm
              key="create-news"
              busy={busy}
              submitLabel="Зберегти новину"
              onCancel={() => setShowCreate(false)}
              onSubmit={handleCreate}
            />
          ) : null}
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
          Завантаження новин…
        </PageCard>
      ) : null}

      {!loading && news.length === 0 ? (
        <PageCard className="p-6 text-center text-gray-500">
          Новин поки немає
        </PageCard>
      ) : null}

      {!loading &&
        news.map((item) => {
          const isEditing = isAdmin && editingId === item.id;

          return (
            <PageCard key={item.id} className="space-y-5 p-5 md:p-6">
              {isEditing ? (
                <>
                  <p className="text-base font-black uppercase tracking-wide text-[var(--brand-heading)]">
                    Редагування новини
                  </p>
                  <NewsEditorForm
                    key={`edit-${item.id}`}
                    initial={item}
                    busy={busy}
                    submitLabel="Зберегти зміни"
                    onCancel={() => setEditingId(null)}
                    onSubmit={(input) => handleUpdate(item.id, input)}
                  />
                </>
              ) : (
                <>
                  {isAdmin && item.id > 0 ? (
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => startEdit(item.id)}
                      >
                        <Pencil className="h-4 w-4" />
                        Редагувати
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => handleDelete(item)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                        Видалити
                      </Button>
                    </div>
                  ) : null}
                  <div className="space-y-2 text-center">
                    <ContentTitle>{item.title}</ContentTitle>
                    {item.subtitle ? (
                      <ContentSubtitle>{item.subtitle}</ContentSubtitle>
                    ) : null}
                  </div>
                  <div className="space-y-4 border-t border-border pt-4">
                    <NewsBody content={item.body_md} />
                  </div>
                </>
              )}
            </PageCard>
          );
        })}
    </div>
  );
}
