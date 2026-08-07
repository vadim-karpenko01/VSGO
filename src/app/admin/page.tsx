"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getSession,
  onAuthChange,
  signIn,
  signOut,
  type GalleryAdminSession,
} from "@/lib/gallery-admin/auth";
import { ROUTE_ROOT } from "@/constants";

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<GalleryAdminSession>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void getSession().then((next) => {
      if (!active) return;
      setSession(next);
      setReady(true);
    });
    return onAuthChange((next) => {
      setSession(next);
      setReady(true);
    });
  }, []);

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await signIn(email, password);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.replace(ROUTE_ROOT);
  };

  const handleSignOut = async () => {
    await signOut();
    setPassword("");
    setError(null);
  };

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm dark:bg-gray-900">
        <div className="h-40 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
      </div>
    );
  }

  if (session) {
    return (
      <div className="mx-auto w-full max-w-md space-y-5 rounded-2xl border border-[var(--brand-heading)]/25 bg-white p-8 shadow-md dark:bg-gray-900">
        <div>
          <h1 className="text-xl font-black uppercase tracking-wide text-[var(--brand-heading)]">
            Ви вже увійшли
          </h1>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
            Активний сеанс: {session.user.email}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="h-12 w-full bg-[var(--brand-surface)] text-base text-white hover:opacity-90"
          >
            <Link href={ROUTE_ROOT}>На головну</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full text-base"
            onClick={handleSignOut}
          >
            Вийти
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-border bg-white p-8 shadow-md dark:bg-gray-900">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-black uppercase tracking-wide text-[var(--brand-heading)]">
          Вхід для адміністратора
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400">
          Увійдіть через обліковий запис адміністратора (Supabase Auth).
        </p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="admin-email" className="text-base font-semibold">
            Електронна пошта
          </label>
          <Input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            className="h-12 border-2 border-gray-300 bg-white text-base shadow-none placeholder:text-gray-400 focus-visible:border-[var(--brand-heading)] dark:border-gray-500 dark:bg-gray-950"
            required
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="admin-password" className="text-base font-semibold">
            Пароль
          </label>
          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="h-12 border-2 border-gray-300 bg-white text-base shadow-none placeholder:text-gray-400 focus-visible:border-[var(--brand-heading)] dark:border-gray-500 dark:bg-gray-950"
            required
          />
        </div>
        {error ? (
          <p
            role="alert"
            className="rounded-md bg-red-50 px-3 py-2.5 text-base text-red-700 dark:bg-red-950/40 dark:text-red-400"
          >
            {error}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={busy}
          className="h-12 w-full bg-[var(--brand-surface)] text-base text-white hover:opacity-90"
        >
          Увійти
        </Button>
      </form>
    </div>
  );
}
