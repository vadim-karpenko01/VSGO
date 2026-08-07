import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageShell } from "@/components/home/PageChrome";

export const metadata: Metadata = {
  title: "Адмін",
  description: "Вхід адміністратора",
  robots: { index: false, follow: false },
  alternates: { canonical: "/admin" },
};

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageShell className="flex min-h-[60vh] items-center justify-center py-6">
      {children}
    </PageShell>
  );
}
