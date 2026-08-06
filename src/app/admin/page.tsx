"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminLogin } from "@/context/AdminLoginContext";
import { ROUTE_GALLERY } from "@/constants";

export default function AdminPage() {
  const router = useRouter();
  const { openLogin } = useAdminLogin();

  useEffect(() => {
    openLogin();
    router.replace(ROUTE_GALLERY);
  }, [openLogin, router]);

  return (
    <p className="py-12 text-center text-base text-gray-500 dark:text-gray-400">
      Відкриваємо вікно входу…
    </p>
  );
}
