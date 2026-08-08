"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewsRichEditor } from "@/components/news/NewsRichEditor";
import type { NewsInput, SiteNews } from "@/lib/news";

function hasText(html: string) {
  return html.replace(/<[^>]*>/g, "").trim().length > 0;
}

export function NewsEditorForm({
  initial,
  busy,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Pick<SiteNews, "title" | "subtitle" | "body_md"> | null;
  busy?: boolean;
  submitLabel: string;
  onSubmit: (input: NewsInput) => Promise<void> | void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [bodyHtml, setBodyHtml] = useState(initial?.body_md ?? "");

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!hasText(bodyHtml)) return;
        void onSubmit({
          title,
          subtitle,
          body_md: bodyHtml,
        });
      }}
    >
      <div className="space-y-1.5">
        <label htmlFor="news-title" className="text-sm font-semibold">
          Заголовок
        </label>
        <Input
          id="news-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          className="h-11 border-2 border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-950"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="news-subtitle" className="text-sm font-semibold">
          Підзаголовок
        </label>
        <Input
          id="news-subtitle"
          value={subtitle}
          onChange={(event) => setSubtitle(event.target.value)}
          className="h-11 border-2 border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-950"
        />
      </div>
      <div className="space-y-1.5">
        <span className="text-sm font-semibold">Текст</span>
        <NewsRichEditor value={bodyHtml} onChange={setBodyHtml} />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Кнопки зверху: жирний, курсив, заголовок, списки, посилання.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          disabled={busy || !hasText(bodyHtml)}
          className="h-11 bg-[var(--brand-surface)] text-white hover:opacity-90"
        >
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={onCancel}
            className="h-11"
          >
            Скасувати
          </Button>
        ) : null}
      </div>
    </form>
  );
}
