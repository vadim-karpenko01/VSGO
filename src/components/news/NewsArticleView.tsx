"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageCard,
  ContentTitle,
  ContentSubtitle,
} from "@/components/home/PageChrome";
import { NewsEditorForm } from "@/components/news/NewsEditorForm";
import { NewsBody } from "@/components/news/NewsBody";
import {
  getSession,
  onAuthChange,
  type GalleryAdminSession,
} from "@/lib/gallery-admin/auth";
import {
  deleteNews,
  fetchNewsById,
  updateNews,
  type NewsInput,
  type SiteNews,
} from "@/lib/news";
import { ROUTE_NEWS } from "@/constants";

export function NewsArticleView({ id }: { id: number }) {
  const router = useRouter();
  const [session, setSession] = useState<GalleryAdminSession>(null);
  const [item, setItem] = useState<SiteNews | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const isAdmin = Boolean(session);

  const reload = async () => {
    setLoading(true);
    const result = await fetchNewsById(id);
    setItem(result.item);
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
  }, [id]);

  const handleUpdate = async (input: NewsInput) => {
    if (!item) return;
    setBusy(true);
    setError(null);
    const result = await updateNews(item.id, input);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setEditing(false);
    if (result.item) setItem(result.item);
  };

  const handleDelete = async () => {
    if (!item) return;
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
    router.push(ROUTE_NEWS);
  };

  if (loading) {
    return (
      <PageCard className="p-6 text-center text-gray-500">
        Завантаження новини…
      </PageCard>
    );
  }

  if (!item) {
    return (
      <PageCard className="space-y-4 p-6 text-center">
        <p className="text-gray-500">Новину не знайдено</p>
        <Button asChild variant="outline">
          <Link href={ROUTE_NEWS}>
            <ArrowLeft className="h-4 w-4" />
            До списку новин
          </Link>
        </Button>
      </PageCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={ROUTE_NEWS}>
            <ArrowLeft className="h-4 w-4" />
            До списку
          </Link>
        </Button>
        {isAdmin && item.id > 0 ? (
          <div className="flex flex-wrap gap-2">
            {!editing ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-4 w-4" />
                Редагувати
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => void handleDelete()}
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-4 w-4" />
              Видалити
            </Button>
          </div>
        ) : null}
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400"
        >
          {error}
        </p>
      ) : null}

      {editing ? (
        <PageCard
          tone="soft"
          className="border-2 border-[var(--nav-active)] p-4 sm:p-5"
        >
          <p className="mb-3 text-base font-black uppercase tracking-wide text-[var(--brand-heading)]">
            Редагування новини
          </p>
          <NewsEditorForm
            initial={item}
            busy={busy}
            submitLabel="Зберегти зміни"
            onCancel={() => setEditing(false)}
            onSubmit={handleUpdate}
          />
        </PageCard>
      ) : (
        <PageCard className="space-y-5 p-5 md:p-6">
          <div className="space-y-2 text-center">
            <ContentTitle>{item.title}</ContentTitle>
            {item.subtitle ? (
              <ContentSubtitle>{item.subtitle}</ContentSubtitle>
            ) : null}
          </div>
          <div className="space-y-4 border-t border-border pt-4">
            <NewsBody content={item.body_md} />
          </div>
        </PageCard>
      )}
    </div>
  );
}
