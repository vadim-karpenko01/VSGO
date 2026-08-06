import {
  DOCUMENTS_BUCKET,
  getDocumentPublicUrl,
  getSupabaseBrowserClient,
  getSupabaseConfig,
} from "@/lib/supabase/client";

export type DocumentSection = "members" | "legislation";

export type SiteDocument = {
  id: number;
  section: DocumentSection;
  title: string;
  file_path: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string | null;
};

const FALLBACK_DOCUMENTS: Record<DocumentSection, SiteDocument[]> = {
  members: [
    {
      id: -1,
      section: "members",
      title: "Члени Конфедерації",
      file_path: "/docs/chleni-konfederatsii.pdf",
      sort_order: 1,
      is_published: true,
      created_at: "",
      updated_at: null,
    },
  ],
  legislation: [
    {
      id: -1,
      section: "legislation",
      title: "Документ 1",
      file_path: "/docs/Legislation_1.pdf",
      sort_order: 1,
      is_published: true,
      created_at: "",
      updated_at: null,
    },
    {
      id: -2,
      section: "legislation",
      title: "Документ 2",
      file_path: "/docs/Legislation_2.pdf",
      sort_order: 2,
      is_published: true,
      created_at: "",
      updated_at: null,
    },
    {
      id: -3,
      section: "legislation",
      title: "Документ 3",
      file_path: "/docs/Legislation_3.pdf",
      sort_order: 3,
      is_published: true,
      created_at: "",
      updated_at: null,
    },
  ],
};

function sanitizeFileName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 120);
}

export function documentUrl(doc: SiteDocument) {
  return getDocumentPublicUrl(doc.file_path);
}

export async function fetchDocuments(
  section: DocumentSection,
): Promise<{ documents: SiteDocument[]; fromFallback: boolean; error: string | null }> {
  if (!getSupabaseConfig().isConfigured) {
    return {
      documents: FALLBACK_DOCUMENTS[section],
      fromFallback: true,
      error: null,
    };
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      documents: FALLBACK_DOCUMENTS[section],
      fromFallback: true,
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("documents")
    .select(
      "id, section, title, file_path, sort_order, is_published, created_at, updated_at",
    )
    .eq("section", section)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return {
      documents: FALLBACK_DOCUMENTS[section],
      fromFallback: true,
      error: error.message,
    };
  }

  return {
    documents: (data ?? []) as SiteDocument[],
    fromFallback: false,
    error: null,
  };
}

export async function uploadDocument(params: {
  section: DocumentSection;
  title: string;
  file: File;
}): Promise<{ document: SiteDocument | null; error: string | null }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      document: null,
      error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and ANON_KEY.",
    };
  }

  if (params.file.type !== "application/pdf") {
    return { document: null, error: "Only PDF files are allowed" };
  }

  const safeName = sanitizeFileName(params.file.name || "document.pdf");
  const filePath = `${params.section}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(filePath, params.file, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    return { document: null, error: uploadError.message };
  }

  const { data: existing } = await supabase
    .from("documents")
    .select("sort_order")
    .eq("section", params.section)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;
  const title = params.title.trim() || safeName;

  const { data, error } = await supabase
    .from("documents")
    .insert({
      section: params.section,
      title,
      file_path: filePath,
      sort_order: nextOrder,
      is_published: true,
      updated_at: new Date().toISOString(),
    })
    .select(
      "id, section, title, file_path, sort_order, is_published, created_at, updated_at",
    )
    .single();

  if (error) {
    await supabase.storage.from(DOCUMENTS_BUCKET).remove([filePath]);
    return { document: null, error: error.message };
  }

  return { document: data as SiteDocument, error: null };
}

export async function deleteDocument(
  doc: SiteDocument,
): Promise<{ error: string | null }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and ANON_KEY.",
    };
  }

  if (doc.id < 0) {
    return { error: "Cannot delete local fallback documents" };
  }

  if (!doc.file_path.startsWith("/")) {
    const { error: storageError } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .remove([doc.file_path]);
    if (storageError) {
      return { error: storageError.message };
    }
  }

  const { error } = await supabase.from("documents").delete().eq("id", doc.id);
  return { error: error?.message ?? null };
}
