"use client";

import { useState } from "react";
import {
  Home,
  Info,
  Users,
  Building2,
  ScrollText,
  Settings,
  Camera,
  Newspaper,
  Phone,
  ChevronDown,
  ChevronRight,
  FileText,
  Network,
  UserCheck,
  Scale,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import {
  ROUTE_ROOT,
  ROUTE_MEMBERS,
  ROUTE_OFFICES,
  ROUTE_LEGISLATION,
  ROUTE_ACTIVITIES,
  ROUTE_GALLERY,
  ROUTE_NEWS,
  ROUTE_CONTACTS,
  ROUTE_STATUS,
  ROUTE_STRUCTURE,
  ROUTE_MEMBERSHIP,
  ROUTE_RIGHTS,
  ROUTE_TASKS,
} from "@/constants";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: Home, label: "Головна", href: ROUTE_ROOT, active: true },
  { icon: Info, label: "Про Конфедерацію", expandable: true },
  { icon: Users, label: "Члени Конфедерації", href: ROUTE_MEMBERS },
  { icon: Building2, label: "Відокремлені підрозділи", href: ROUTE_OFFICES },
  { icon: ScrollText, label: "Законодавство", href: ROUTE_LEGISLATION },
  { icon: Settings, label: "Наша діяльність", href: ROUTE_ACTIVITIES },
  { icon: Camera, label: "Фотогалерея", href: ROUTE_GALLERY },
  { icon: Newspaper, label: "Новини", href: ROUTE_NEWS },
  { icon: Phone, label: "Контакти", href: ROUTE_CONTACTS },
];

const aboutItems = [
  { icon: FileText, label: "Статус", href: ROUTE_STATUS },
  { icon: Network, label: "Структура", href: ROUTE_STRUCTURE },
  { icon: UserCheck, label: "Умови вступу", href: ROUTE_MEMBERSHIP },
  { icon: Scale, label: "Права та обов’язки", href: ROUTE_RIGHTS },
  { icon: Target, label: "Завдання Конфедерації", href: ROUTE_TASKS },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [openAbout, setOpenAbout] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="left"
        className="flex h-dvh max-h-dvh w-[min(20rem,85vw)] max-w-[85vw] flex-col gap-0 overflow-hidden overscroll-none bg-white p-0 dark:bg-background sm:max-w-sm"
      >
        <SheetHeader className="shrink-0 border-b border-border px-4 py-4 pr-12">
          <SheetTitle className="text-[var(--brand-primary)]">Меню</SheetTitle>
        </SheetHeader>

        <nav className="min-h-0 flex-1 touch-pan-y space-y-2 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            if (item.expandable) {
              return (
                <div key={index} className="min-w-0 space-y-1">
                  <Button
                    variant="ghost"
                    className="h-auto w-full max-w-full justify-start gap-3 px-4 py-3 font-black text-[var(--brand-primary)] hover:bg-[var(--brand-primary-10)]"
                    onClick={() => setOpenAbout((v) => !v)}
                  >
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={2.4} />
                    <span className="min-w-0 flex-1 text-left break-words whitespace-normal">
                      Про Конфедерацію
                    </span>
                    {openAbout ? (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                  </Button>
                  {openAbout && (
                    <div className="min-w-0 space-y-1 border-l-2 border-[var(--brand-primary)]/20 pl-3">
                      {aboutItems.map((sub, i) => {
                        const SubIcon = sub.icon;
                        return (
                          <Button
                            asChild
                            key={i}
                            variant="ghost"
                            className="h-auto w-full max-w-full justify-start gap-3 px-3 py-2 text-base font-black text-[var(--brand-primary)] hover:bg-[var(--brand-primary-10)]"
                            onClick={onClose}
                          >
                            <Link href={sub.href} className="min-w-0">
                              <SubIcon
                                className="h-4 w-4 shrink-0"
                                strokeWidth={2.4}
                              />
                              <span className="min-w-0 flex-1 text-left leading-tight break-words whitespace-normal">
                                {sub.label}
                              </span>
                            </Link>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            const isActive = (item.href ?? "/") === pathname;
            return (
              <Button
                asChild
                key={index}
                variant={isActive ? "default" : "ghost"}
                className={`h-auto w-full max-w-full justify-start gap-3 px-4 py-3 font-black ${
                  isActive
                    ? "bg-gradient-to-r from-[var(--brand-surface)] to-[var(--brand-secondary)] text-white hover:from-[color-mix(in_oklab,var(--brand-surface)_90%,transparent)] hover:to-[color-mix(in_oklab,var(--brand-secondary)_90%,transparent)]"
                    : "text-[var(--brand-primary)] hover:bg-[var(--brand-primary-10)]"
                }`}
                onClick={onClose}
              >
                <Link
                  href={item.href ?? "/"}
                  aria-current={isActive ? "page" : undefined}
                  className="flex w-full min-w-0 items-start gap-3"
                >
                  <Icon
                    className="mt-[2px] h-5 w-5 shrink-0"
                    strokeWidth={2.4}
                  />
                  <span className="min-w-0 flex-1 text-left break-words whitespace-normal">
                    {item.label}
                  </span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
