import type { Metadata } from "next";
import { Activity } from "lucide-react";
import {
  PageShell,
  PageHeading,
  PageCard,
} from "@/components/home/PageChrome";

export const metadata: Metadata = {
  title: "Our Activities",
  description: "Activities and initiatives of the Confederation",
  alternates: { canonical: "/activities" },
  openGraph: { url: "/activities", title: "Our Activities | VSGO" },
};

export default function Page() {
  return (
    <PageShell>
      <PageHeading title="Наша діяльність" icon={Activity} />
      <PageCard tone="soft" className="p-5 md:p-6">
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Контент буде додано незабаром.
        </p>
      </PageCard>
    </PageShell>
  );
}
