"use client";

import { Facebook, Mail } from "lucide-react";
import { useAdminLogin } from "@/context/AdminLoginContext";

export function Footer() {
  const { openLogin } = useAdminLogin();

  return (
    <footer className="relative w-full" style={{ background: "var(--footer-bg)" }}>
      <div className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-col items-center gap-3 px-4 py-5 pb-8 text-center md:flex-row md:items-center md:justify-between md:gap-6 md:px-4 md:pb-5 md:text-left">
        <p className="max-w-md text-sm leading-relaxed text-white/85 md:max-w-sm md:flex-1 lg:max-w-md xl:max-w-lg">
          © 2026 Конфедерація громадських організацій осіб з інвалідністю України.
          Усі права захищені.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-white/80 md:shrink-0">
          <a href="#" className="transition-colors hover:text-white">
            Карта сайту
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Політика конфіденційності
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="https://www.facebook.com/KonfederaciaVSGO/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877f2] text-white transition-opacity hover:opacity-80"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href="mailto:vsgo@ukr.net"
            aria-label="Email"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={openLogin}
        aria-label="Вхід адміністратора"
        className="absolute bottom-2 right-3 rounded px-1.5 py-0.5 text-[11px] leading-none text-white/30 transition-colors hover:text-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        Адмін
      </button>
    </footer>
  );
}
