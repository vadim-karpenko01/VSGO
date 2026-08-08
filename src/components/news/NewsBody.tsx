"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "a",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "blockquote",
];

export function NewsBody({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    setHtml(
      DOMPurify.sanitize(content, {
        ALLOWED_TAGS,
        ALLOWED_ATTR: ["href", "target", "rel"],
      }),
    );
  }, [content]);

  return (
    <div
      className={cn(
        "news-body space-y-4 text-base font-medium leading-relaxed text-gray-700 md:text-lg dark:text-white",
        "[&_a]:text-[var(--brand-link)] [&_a]:underline [&_a]:hover:opacity-80",
        "[&_h2]:mb-3 [&_h2]:mt-2 [&_h2]:text-left [&_h2]:text-base [&_h2]:font-black [&_h2]:text-[var(--brand-heading)] md:[&_h2]:text-lg",
        "[&_h3]:mb-3 [&_h3]:mt-2 [&_h3]:text-left [&_h3]:text-base [&_h3]:font-black [&_h3]:text-[var(--brand-heading)] md:[&_h3]:text-lg",
        "[&_p]:text-base [&_p]:leading-relaxed md:[&_p]:text-lg",
        "[&_ul]:m-0 [&_ul]:list-none [&_ul]:space-y-2 [&_ul]:p-0",
        "[&_ol]:m-0 [&_ol]:list-none [&_ol]:space-y-2 [&_ol]:p-0",
        "[&_li]:relative [&_li]:pl-4",
        "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.55em] [&_li]:before:block [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:bg-[var(--brand-sky)] [&_li]:before:content-['']",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
