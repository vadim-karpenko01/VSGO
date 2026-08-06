"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AdminLoginContextValue = {
  isOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
};

const AdminLoginContext = createContext<AdminLoginContextValue | undefined>(
  undefined,
);

export function AdminLoginProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openLogin = useCallback(() => setIsOpen(true), []);
  const closeLogin = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openLogin, closeLogin }),
    [isOpen, openLogin, closeLogin],
  );

  return (
    <AdminLoginContext.Provider value={value}>
      {children}
    </AdminLoginContext.Provider>
  );
}

export function useAdminLogin() {
  const ctx = useContext(AdminLoginContext);
  if (!ctx) {
    throw new Error("useAdminLogin must be used within AdminLoginProvider");
  }
  return ctx;
}
