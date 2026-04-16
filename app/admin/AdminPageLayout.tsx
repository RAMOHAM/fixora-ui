"use client";

import { useState } from "react";

import AdminBarNavbar from "./AdminBarNavbar";
import AdminBarSidePanel from "./AdminBarSidePanel";

export default function AdminPageLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--admin-surface)]">
      <div className="flex min-h-screen">
        <AdminBarSidePanel open={menuOpen} onClose={() => setMenuOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminBarNavbar onMenuClick={() => setMenuOpen(true)} />

          <main className="flex-1 px-4 py-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1180px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

