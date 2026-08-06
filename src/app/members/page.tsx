"use client";

import { Users } from "lucide-react";
import {
  PageShell,
  PageHeading,
  PageCard,
  PageBadge,
} from "@/components/home/PageChrome";
import { DocumentsSection } from "@/components/documents/DocumentsSection";

export default function Page() {
  return (
    <PageShell>
      <PageHeading title="Члени Конфедерації" icon={Users}>
        <PageBadge>PDF Документ</PageBadge>
      </PageHeading>

      <PageCard tone="soft" className="p-5 md:p-6">
        <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
          Повний список громадських об&apos;єднань - членів ВСГО «Конфедерація
          ГОІУ» з назвами організацій та веб-сторінками.
        </p>
      </PageCard>

      <DocumentsSection section="members" />
    </PageShell>
  );
}
