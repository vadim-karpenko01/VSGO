import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { PageShell, PageHeading } from "@/components/home/PageChrome";
import { NewsArticleView } from "@/components/news/NewsArticleView";

export const metadata: Metadata = {
  title: "News",
  description: "News article",
  alternates: { canonical: "/news" },
  openGraph: { url: "/news", title: "News | VSGO" },
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  return (
    <PageShell>
      <PageHeading title="Новини" icon={FileText} />
      <NewsArticleView id={Number.isFinite(numericId) ? numericId : NaN} />
    </PageShell>
  );
}
