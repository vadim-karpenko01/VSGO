import type { Metadata } from "next";
import { Camera } from "lucide-react";
import {
  PageShell,
  PageHeading,
  PageCard,
} from "@/components/home/PageChrome";
import { GalleryAdminClient } from "@/components/gallery/GalleryAdminClient";
import { GALLERY_IMAGES } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Photo gallery of events and activities",
  alternates: { canonical: "/gallery" },
  openGraph: { url: "/gallery", title: "Photo Gallery | VSGO" },
};

export default function Page() {
  return (
    <PageShell>
      <PageHeading title="Фотогалерея" icon={Camera} />
      <PageCard className="p-3 sm:p-4 md:p-5">
        <GalleryAdminClient baseImages={GALLERY_IMAGES} />
      </PageCard>
    </PageShell>
  );
}
