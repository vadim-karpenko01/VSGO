"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getSession,
  onAuthChange,
  signOut,
  type GalleryAdminSession,
} from "@/lib/gallery-admin/auth";

export function AdminSessionBar() {
  const [session, setSession] = useState<GalleryAdminSession>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setReady(true);
    return onAuthChange(setSession);
  }, []);

  if (!ready || !session) return null;

  return (
    <div className="mb-4 overflow-hidden rounded-xl border-2 border-[var(--nav-active)] bg-[var(--nav-submenu)] shadow-sm dark:bg-[var(--nav-submenu)]/20">
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-wide text-[var(--brand-heading)]">
            Режим адміністратора
          </p>
          <p className="truncate text-sm text-gray-600 dark:text-gray-300">
            {session.user.email}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => void signOut()}
        >
          <LogOut className="h-4 w-4" />
          Вийти
        </Button>
      </div>
    </div>
  );
}
