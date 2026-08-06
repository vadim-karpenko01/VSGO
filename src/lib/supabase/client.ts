import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "documents";

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
}

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;
  if (!browserClient) {
    browserClient = createClient(url, anonKey);
  }
  return browserClient;
}

export function getDocumentPublicUrl(filePath: string): string {
  if (filePath.startsWith("/") || filePath.startsWith("http")) {
    return filePath;
  }
  const { url, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return filePath;
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${filePath}`;
}

export const DOCUMENTS_BUCKET = BUCKET;
