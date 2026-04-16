"use client";

import { Bell, Menu, Search, Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AdminBarNavbar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full",
        "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70",
        "border-b border-black/5"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => onMenuClick?.()}
          aria-label="Open menu"
        >
          <Menu />
        </Button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative w-full max-w-[420px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search operations..."
              className="h-10 rounded-xl pl-9 bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="hidden sm:inline-flex h-7 rounded-full px-3 text-[11px] font-semibold tracking-wide"
          >
            <span className="mr-2 inline-block size-2 rounded-full bg-emerald-500" />
            ADMIN PANEL
          </Badge>

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="size-5" />
          </Button>

          <div className="ml-1 grid size-9 place-items-center rounded-full bg-gradient-to-br from-slate-200 to-slate-100 ring-1 ring-black/5">
            <span className="text-xs font-semibold text-slate-700">RA</span>
          </div>
        </div>
      </div>
    </header>
  );
}
