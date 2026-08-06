"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getSession,
  onAuthChange,
  signIn,
  type GalleryAdminSession,
} from "@/lib/gallery-admin/auth";
import { useAdminLogin } from "@/context/AdminLoginContext";
import { ROUTE_GALLERY } from "@/constants";

export function AdminLoginDialog() {
  const router = useRouter();
  const { isOpen, closeLogin } = useAdminLogin();
  const [session, setSession] = useState<GalleryAdminSession>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSession(getSession());
    return onAuthChange(setSession);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setPassword("");
    }
  }, [isOpen]);

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
    closeLogin();
    router.push(ROUTE_GALLERY);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) closeLogin();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="gap-5 p-6 sm:max-w-md sm:p-7"
        aria-describedby="admin-login-description"
      >
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl font-black uppercase tracking-wide text-[var(--brand-heading)]">
            {session ? "Ви вже увійшли" : "Вхід"}
          </DialogTitle>
          <DialogDescription
            id="admin-login-description"
            className="text-base leading-relaxed text-gray-600 dark:text-gray-300"
          >
            {session
              ? `Активний сеанс: ${session.user.email}. Можна перейти до галереї.`
              : "Увійдіть, щоб керувати фотогалереєю. Натисніть Escape, щоб закрити вікно."}
          </DialogDescription>
        </DialogHeader>

        {session ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              className="h-12 flex-1 bg-[var(--brand-surface)] text-base text-white hover:opacity-90"
              onClick={() => {
                closeLogin();
                router.push(ROUTE_GALLERY);
              }}
            >
              До галереї
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 flex-1 text-base"
              onClick={closeLogin}
            >
              Закрити
            </Button>
          </div>
        ) : (
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
              <label
                htmlFor="admin-password"
                className="text-base font-semibold"
              >
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
            <div className="flex flex-col gap-2 pt-1 sm:flex-row">
              <Button
                type="submit"
                disabled={busy}
                className="h-12 flex-1 bg-[var(--brand-surface)] text-base text-white hover:opacity-90"
              >
                Увійти
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 flex-1 text-base"
                onClick={closeLogin}
              >
                Скасувати
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
