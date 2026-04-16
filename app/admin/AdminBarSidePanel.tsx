"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  CreditCard,
  Settings,
  Users,
  Wrench,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/professionals", label: "Professionals", icon: Users },
  { href: "/admin/revenue", label: "Revenue", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminBarSidePanel({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const activeHref =
    NAV_ITEMS.find((i) => pathname?.startsWith(i.href))?.href ?? "/admin/bookings";

  const Panel = (
    <aside
      className={cn(
        "flex h-full w-[280px] flex-col",
        "bg-[var(--admin-sidebar-bg)] text-[var(--admin-sidebar-fg)]",
        "border-r border-white/5"
      )}
    >
      <div className="flex items-center gap-3 px-6 pt-6">
        <div className="grid size-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
          <Wrench className="size-5 text-[var(--admin-accent)]" />
        </div>
        <div className="leading-tight">
          <div className="text-base font-semibold tracking-wide">
            FIXORA™ Elite
          </div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-white/55">
            Management Console
          </div>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.href === activeHref;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                "text-white/55 hover:text-white/85 hover:bg-white/5",
                active && "bg-white/5 text-[var(--admin-accent)]"
              )}
            >
              <Icon
                className={cn(
                  "size-[18px] text-white/45 group-hover:text-white/70",
                  active && "text-[var(--admin-accent)]"
                )}
              />
              <span className="truncate">{item.label}</span>
              <span
                aria-hidden
                className={cn(
                  "absolute right-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-full bg-transparent",
                  active && "bg-[var(--admin-accent)]"
                )}
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  // Desktop: always visible. Mobile: slides in with overlay.
  return (
    <>
      <div className="hidden h-screen lg:block">{Panel}</div>
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/45 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => onClose?.()}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full transition-transform",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="relative h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 text-white/70 hover:text-white"
              onClick={() => onClose?.()}
              aria-label="Close menu"
            >
              <X />
            </Button>
            {Panel}
          </div>
        </div>
      </div>
    </>
  );
}
