"use client";

import { FileText } from "lucide-react";
import {
  PageShell,
  PageHeading,
  PageCard,
} from "@/components/home/PageChrome";
import { DocumentsSection } from "@/components/documents/DocumentsSection";

export default function Page() {
  return (
    <PageShell>
      <PageHeading title="Законодавство" icon={FileText} />

      <PageCard tone="soft" className="p-5 md:p-6">
        <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
          Нормативно-правові акти та документи, що регулюють діяльність ВСГО
          «Конфедерація ГОІУ».
        </p>
      </PageCard>

      <DocumentsSection section="legislation" />
    </PageShell>
  );
}
