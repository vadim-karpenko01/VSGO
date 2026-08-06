export type GalleryAdminUser = {
  id: string;
  email: string;
};

export type GalleryAdminSession = {
  user: GalleryAdminUser;
} | null;

const SESSION_KEY = "vsgo-gallery-admin";

const DEFAULT_EMAIL = "vadim@vsgo.local";
const DEFAULT_PASSWORD = "vadim-gallery";

type SessionListener = (session: GalleryAdminSession) => void;

const listeners = new Set<SessionListener>();

function getAdminEmail() {
  return (
    process.env.NEXT_PUBLIC_GALLERY_ADMIN_EMAIL?.trim() || DEFAULT_EMAIL
  );
}

function getAdminPassword() {
  return (
    process.env.NEXT_PUBLIC_GALLERY_ADMIN_PASSWORD?.trim() || DEFAULT_PASSWORD
  );
}

function readSession(): GalleryAdminSession {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GalleryAdminUser;
    if (!parsed?.id || !parsed?.email) return null;
    return { user: parsed };
  } catch {
    return null;
  }
}

function writeSession(session: GalleryAdminSession) {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
  } else {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session.user));
  }
  listeners.forEach((listener) => listener(session));
}

export function getSession(): GalleryAdminSession {
  return readSession();
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ session: GalleryAdminSession; error: string | null }> {
  const normalizedEmail = email.trim().toLowerCase();
  const expectedEmail = getAdminEmail().toLowerCase();
  const expectedPassword = getAdminPassword();

  if (normalizedEmail !== expectedEmail || password !== expectedPassword) {
    return { session: null, error: "Невірна електронна пошта або пароль" };
  }

  const session: GalleryAdminSession = {
    user: {
      id: "gallery-admin-vadim",
      email: expectedEmail,
    },
  };
  writeSession(session);
  return { session, error: null };
}

export async function signOut(): Promise<void> {
  writeSession(null);
}

export function onAuthChange(listener: SessionListener): () => void {
  listeners.add(listener);
  listener(readSession());
  return () => {
    listeners.delete(listener);
  };
}
