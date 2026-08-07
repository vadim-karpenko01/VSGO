import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type GalleryAdminUser = {
  id: string;
  email: string;
};

export type GalleryAdminSession = {
  user: GalleryAdminUser;
} | null;

type SessionListener = (session: GalleryAdminSession) => void;

const listeners = new Set<SessionListener>();
let authSubscriptionBound = false;

function toAdminSession(user: User | null): GalleryAdminSession {
  if (!user?.id || !user.email) return null;

  const allowList = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (
    allowList.length > 0 &&
    !allowList.includes(user.email.trim().toLowerCase())
  ) {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

function fromSupabaseSession(session: Session | null): GalleryAdminSession {
  return toAdminSession(session?.user ?? null);
}

function notify(session: GalleryAdminSession) {
  listeners.forEach((listener) => listener(session));
}

function ensureAuthSubscription() {
  if (authSubscriptionBound || typeof window === "undefined") return;
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  authSubscriptionBound = true;
  supabase.auth.onAuthStateChange((_event, session) => {
    notify(fromSupabaseSession(session));
  });
}

export async function getSession(): Promise<GalleryAdminSession> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  ensureAuthSubscription();
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return fromSupabaseSession(data.session);
}

function mapAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase();
  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid_credentials")
  ) {
    return "Невірна електронна пошта або пароль";
  }
  if (normalized.includes("email not confirmed")) {
    return "Електронну пошту не підтверджено";
  }
  if (normalized.includes("too many requests")) {
    return "Забагато спроб. Спробуйте пізніше";
  }
  return "Не вдалося увійти. Перевірте дані та спробуйте ще раз";
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ session: GalleryAdminSession; error: string | null }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      session: null,
      error: "Авторизацію не налаштовано. Зверніться до розробника.",
    };
  }

  ensureAuthSubscription();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return {
      session: null,
      error: mapAuthErrorMessage(error.message),
    };
  }

  const session = fromSupabaseSession(data.session);
  if (!session) {
    await supabase.auth.signOut();
    return {
      session: null,
      error: "Цей акаунт не має прав адміністратора",
    };
  }

  notify(session);
  return { session, error: null };
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    notify(null);
    return;
  }
  await supabase.auth.signOut();
  notify(null);
}

export function onAuthChange(listener: SessionListener): () => void {
  listeners.add(listener);
  ensureAuthSubscription();
  void getSession().then((session) => listener(session));
  return () => {
    listeners.delete(listener);
  };
}
